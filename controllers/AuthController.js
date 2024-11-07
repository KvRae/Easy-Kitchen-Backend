const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");


const register = (req, res) => {
    const { username, email, password, phone } = req.body;

    // Validate required fields
    if (!username || !email || !password || !phone) {
        return res.status(400).json({ error: 'All fields are required (username, email, password, phone)' });
    }

    // Check if the password is a valid string and not undefined
    if (typeof password !== 'string' || password.trim() === '') {
        return res.status(400).json({ error: 'Password must be a valid string' });
    }

    // Check if username or email already exists in the database
    User.findOne({ $or: [{ username }, { email }] })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists with this username or email' });
            }

            // Hash the password
            bcrypt.hash(password, 10, (err, hashedPass) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({ error: 'Internal server error while hashing password' });
                }

                // Create the new user
                const user = new User({
                    username,
                    email,
                    password: hashedPass,
                    phone
                });

                // Save the user to the database
                user.save()
                    .then(newUser => {
                        // Don't send sensitive data like the hashed password
                        res.status(201).json({
                            message: 'Account created successfully',
                            user: {
                                username: newUser.username,
                                email: newUser.email,
                                phone: newUser.phone
                            }
                        });
                    })
                    .catch(err => {
                        console.error('Error saving user:', err);
                        res.status(500).json({ error: 'An error occurred while saving the user' });
                    });
            });
        })
        .catch(err => {
            console.error('Error checking for existing user:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
};



const login = (req, res) => {
    const { username, email, password } = req.body;

 
    const loginField = email ? { email } : { username };

    User.findOne(loginField)
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Incorrect username or email, or password' });
            }

            // Compare the password with the stored hash
            bcrypt.compare(password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Incorrect username or email, or password' });
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
                        process.env.JWT_SECRET || 'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    );

                    return res.status(200).json({
                        message: 'Login successful',
                        user: {
                            username: user.username,
                            email: user.email,
                            phone: user.phone,
                            image: user.image,
                        },
                        token: token
                    });
                })
                .catch(error => {
                    console.error('Error comparing password:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                });
        })
        .catch(error => {
            console.error('Error finding user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        });
};


const logout = (req, res) => {
    res.status(200).json({ message: 'User logged out' });

}

const loginWithGoogle = (req, res) => {

}

const forgotPassword = async (req, res) => {
    const user = await User.findOne({email: req.body.email})

    if (user) {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
 const token = generateResetToken(randomNumber);

        const success = await sendEmail({
            from: process.env.GMAIL_USER,
            to: req.body.email,
            subject: "Password reset - Code : " ,
            html:
                `<!DOCTYPE html>
                <html>
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
                        <img src="" width="125" style="display: block; padding: 25px;" />
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
        }).catch((error) => {
            console.log(error)
            return res.status(500).send({
                message: "Error : email could not be sent"
            })
        });

        if (success) {
            console.log(token)
            return res.status(200).send({
                message: "Reset email has been sent to : " + user.email+"with code" +randomNumber,
                token: token
            })
        } else {
            return res.status(500).send({
                message: "Email could not be sent"
            })
        }
    } else {
        return res.status(404).send({message: "User does not exist"});
    }
};

const verifyResetCode = async (req, res) => {
    const {resetCode, token} = req.body;

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.resetCode !== resetCode) {
            return res.status(200).send({message: "Success"});
        } else {
            return res.status(403).send({message: "Invalid reset code"});
        }
    } catch (error) {
        return res.status(500).send({error});
    }
}

const resetPassword = async (req, res) => {
    const {
        email,
        password,
    } = req.body;

    try {
        await User.findOneAndUpdate({email},
            {
                $set: {
                    password: await bcrypt.hash(password, 10),
                },
            }
        )
        res.status(200).send({message: "Success"});
    } catch (error) {
        res.status(500).send({error});
    }
}

function generateResetToken(resetCode) {
    return jwt.sign(
        {resetCode},
        process.env.JWT_SECRET, {
            expiresIn: "100000000", // in Milliseconds (3600000 = 1 hour)
        }, {}
    )
}

async function sendEmail(mailOptions) {
    let transporter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    await transporter.verify(function (error) {
        if (error) {
            console.log(error);
            console.log("Server not ready");
        } else {
            console.log("Server is ready to take our messages");
        }
    })

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log("Email sent: " + info.response);
            return true;
        }
    });

    return true
}


module.exports = { register,login,logout,loginWithGoogle,forgotPassword,verifyResetCode,resetPassword }
