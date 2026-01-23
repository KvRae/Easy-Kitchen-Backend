const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);


const register = async (req, res) => {
    const { username, email, password, phone } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required (username, email, password)' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength - minimum 6 characters
    if (typeof password !== 'string' || password.trim().length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Validate phone only if provided (allow optional)
    let normalizedPhone;
    if (phone !== undefined && phone !== null && String(phone).trim() !== '') {
        normalizedPhone = String(phone).trim();
        if (normalizedPhone.length < 8) {
            return res.status(400).json({ error: 'Phone number must be at least 8 characters if provided' });
        }
    }

    try {
        // Check if username or email already exists in the database
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this username or email' });
        }

        // If phone is provided, ensure it is unique
        if (normalizedPhone) {
            const phoneOwner = await User.findOne({ phone: normalizedPhone });
            if (phoneOwner) {
                return res.status(400).json({ error: 'Phone number already in use' });
            }
        }

        // Hash the password
        const hashedPass = await bcrypt.hash(password, 10);

        // Create the new user (phone is optional, not auto-generated)
        const user = new User({
            username,
            email,
            password: hashedPass,
            ...(normalizedPhone ? { phone: normalizedPhone } : {})
        });

        // Save the user to the database
        const newUser = await user.save();

        // Don't send sensitive data like the hashed password
        return res.status(201).json({
            message: 'Account created successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone,
            }
        });
    } catch (err) {
        console.error('Error in register:', err);
        res.status(500).json({ error: 'An error occurred while creating the user' });
    }
};




const login = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate that at least one login field is provided
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    if (!username && !email) {
        return res.status(400).json({ error: 'Username or email is required' });
    }

    try {
        // Build login field - prefer email if provided
        const loginField = email ? { email } : { username };

        const user = await User.findOne(loginField);
        if (!user) {
            return res.status(401).json({ error: 'Incorrect username or email, or password' });
        }

        // Compare the password with the stored hash
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Incorrect username or email, or password' });
        }

        // Ensure JWT_SECRET is configured
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                image: user.image,
                recettes: user.recettes,
                comments: user.comments
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                image: user.image
            },
            token: token
        });
    } catch (error) {
        console.error('Error in login:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const logout = (req, res) => {
    return res.status(200).json({ message: 'User logged out successfully' });
}

const loginWithGoogle = async (req, res) => {
    const { idToken } = req.body;

    // Validate input
    if (!idToken) {
        return res.status(400).json({ error: 'idToken is required' });
    }

    try {
        // Verify the token with Google
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const { email, name, picture } = payload;

        // Check if user exists in database
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user from Google auth
            user = new User({
                username: name || email.split('@')[0],
                email: email,
                password: 'google-auth-' + idToken.substring(0, 20), // Set a placeholder password
                image: picture || 'http://localhost:3000/api/users/image/avatar/avatar.jpg'
            });
            await user.save();
            console.log('New user created via Google auth:', email);
        }

        // Ensure JWT_SECRET is configured
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                image: user.image,
                recettes: user.recettes,
                comments: user.comments
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Google authentication successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                image: user.image,
                phone: user.phone
            },
            token: token
        });
    } catch (error) {
        console.error('Error verifying Google idToken:', error);
        return res.status(500).json({ error: 'Internal server error during Google authentication' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Validate email input
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User with this email does not exist' });
        }

        // Generate reset code
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        const token = generateResetToken(randomNumber);

        // Send reset code via email
        const success = await sendEmail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Easy Kitchen - Password Reset Code",
            html:
                `<!DOCTYPE html>
                <html lang="">
                <head>
                  <title>Email Template</title>
                  <style type="text/css">
                    @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700');
                  </style>
                </head>
                <body style="margin: 0; padding: 0; background-color: #fafbfc;">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                      <td align="center" bgcolor="#fafbfc" style="padding: 20px;">
                        <img src="" width="125" style="display: block; padding: 25px;"  alt=""/>
                      </td>
                    </tr>
                    <tr>
                      <td bgcolor="#fff" style="padding: 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="font-family: 'Open Sans', sans-serif; font-size: 16px; text-align: center; padding: 10px 25px;">
                              <span>Hello, ${user.username}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="font-family: 'Open Sans', sans-serif; font-size: 16px; text-align: center; padding: 10px 25px;">
                              Please use the verification code below on the Easy Kitchen app:
                            </td>
                          </tr>
                          <tr>
                            <td bgcolor="#20c997" style="font-family: 'Open Sans', sans-serif; font-size: 24px; font-weight: bold; text-align: center; padding: 10px 25px;">
                              ${randomNumber}
                            </td>
                          </tr>
                          <tr>
                            <td style="font-family: 'Open Sans', sans-serif; font-size: 16px; text-align: center; padding: 10px 25px;">
                              If you didn't request this, you can ignore this email or let us know.
                            </td>
                          </tr>
                          <tr>
                            <td style="font-family: 'Open Sans', sans-serif; font-size: 16px; text-align: center; padding: 10px 25px;">
                              Thanks! <br />Easy Kitchen Team.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                `
        });

        if (success) {
            console.log('Reset code sent to user:', email);
            return res.status(200).json({
                message: 'Password reset code has been sent to your email',
                email: email,
                token: token
            });
        } else {
            return res.status(500).json({
                error: 'Failed to send reset code. Please try again later.'
            });
        }
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({
            error: 'An error occurred while processing your request'
        });
    }
};

const verifyResetCode = async (req, res) => {
    const { resetCode, token } = req.body;

    // Validate required inputs
    if (!resetCode || !token) {
        return res.status(400).json({ error: 'Reset code and token are required' });
    }

    // Validate JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not configured');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        // Verify token and extract reset code
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Convert both to string for safe comparison
        if (String(decoded.resetCode) === String(resetCode)) {
            return res.status(200).json({
                message: 'Reset code verified successfully',
                verified: true
            });
        } else {
            return res.status(403).json({
                error: 'Invalid reset code',
                verified: false
            });
        }
    } catch (error) {
        console.error('Error verifying reset code:', error.message);
        return res.status(401).json({
            error: 'Invalid or expired token',
            verified: false
        });
    }
}

const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (typeof password !== 'string' || password.trim().length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    password: hashedPassword,
                },
            },
            { new: true }
        );

        console.log('Password reset successful for user:', email);
        return res.status(200).json({
            message: 'Password reset successful',
            email: email
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ error: 'An error occurred while resetting password' });
    }
}

function generateResetToken(resetCode) {
    // Ensure JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(
        { resetCode },
        process.env.JWT_SECRET,
        {
            expiresIn: "240h", // 1 hour - more secure than 100000000ms
        }
    );
}

async function sendEmail(mailOptions) {
    try {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
            console.error('Gmail credentials are not configured in environment variables');
            return false;
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
            tls: {
                rejectUnauthorized: false
            }
        });

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error.message);
        console.error('Full error:', error);
        return false;
    }
}


module.exports = { register,login,logout,loginWithGoogle,forgotPassword,verifyResetCode,resetPassword }
