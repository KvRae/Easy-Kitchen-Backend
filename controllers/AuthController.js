const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);


const register = async (req, res) => {
    const { username, email, password } = req.body;

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

    try {
        // Check if username or email already exists in the database
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this username or email' });
        }

        // Hash the password
        const hashedPass = await bcrypt.hash(password, 10);

        // Create the new user (phone is optional, not auto-generated)
        const user = new User({
            username,
            email,
            password: hashedPass
        });

        // Save the user to the database
        const newUser = await user.save();

        // Don't send sensitive data like the hashed password
        return res.status(201).json({
            message: 'Account created successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
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
    res.status(200).json({ message: 'User logged out' });

}

const loginWithGoogle = async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(404).json({ message: 'idToken is missing' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (payload) {
            return res.status(200).json({ message: 'Authentication successful', user: payload });
        } else {
            return res.status(500).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Error verifying idToken:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Validate email input
    if (!email) {
        return res.status(400).send({message: "Email is required"});
    }

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).send({message: "User does not exist"});
        }


        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        const token = generateResetToken(randomNumber);

        const success = await sendEmail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Easy kitchen - Password Reset Code",
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
                              Please use the verification code below on the easy kitchen app:
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
            console.log("Reset token generated for user:", user.email);
            return res.status(200).send({
                message: "Reset email has been sent to: " + user.email,
                token: token
            });
        } else {
            return res.status(500).send({
                message: "Email could not be sent"
            });
        }
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        return res.status(500).send({
            message: "An error occurred while processing your request",
            error: error.message
        });
    }
};

const verifyResetCode = async (req, res) => {
    const {resetCode, token} = req.body;

    if (!resetCode || !token) {
        return res.status(400).send({message: "Reset code and token are required"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Convert both to string for comparison to avoid type mismatch
        if (String(decoded.resetCode) === String(resetCode)) {
            return res.status(200).send({message: "Success"});
        } else {
            return res.status(403).send({message: "Invalid reset code"});
        }
    } catch (error) {
        return res.status(500).send({message: "Invalid or expired token", error: error.message});
    }
}

const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).send({message: "Email and password are required"});
    }

    // Validate password strength
    if (typeof password !== 'string' || password.trim().length < 6) {
        return res.status(400).send({message: "Password must be at least 6 characters long"});
    }

    try {
        // Check if user exists
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }

        // Update password
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            {email},
            {
                $set: {
                    password: hashedPassword,
                },
            }
        );

        res.status(200).send({message: "Password reset successful"});
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send({message: "Error resetting password", error: error.message});
    }
}

function generateResetToken(resetCode) {
    return jwt.sign(
        {resetCode},
        process.env.JWT_SECRET,
        {
            expiresIn: "1h", // 1 hour - more secure than 100000000ms
        }
    )
}

async function sendEmail(mailOptions) {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        await transporter.verify();
        console.log("Server is ready to take our messages");

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return true;
    } catch (error) {
        console.log("Email error:", error);
        return false;
    }
}


module.exports = { register,login,logout,loginWithGoogle,forgotPassword,verifyResetCode,resetPassword }
