const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");


const register = (req,res) => {
    bcrypt.hash(req.body.password, 10,function (err,hashedPass){
        if (err){
            res.json({
                error: err
            })
        }

        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            phone: req.body.phone,
        })
        user.save()
            .then(user => {
                res.json({
                    user,
                    message : "Account created successfully"

                })
            })
            .catch(err => {
                res.json({
                    message: 'User already created with this credentials!'
                }) 
            })
    })

}

const login = (req, res) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'wrong username ', error });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    console.log(req.body.password + " " + user.password);
                    if (!valid) {
                        return res.status(401).json({ error: 'wrong password' });
                    }
                    res.status(200).json({
                        user: user,
                        token: jwt.sign({ userId: user._id,
                            username: user.username,
                            email: user.email,
                            phone: user.phone,
                            image:user.image,
                            recettes: user.recettes,
                            comments: user.comments
                         },
                            'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                        )

                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));


};

const logout = (req, res) => {
    res.status(200).json({ message: 'User logged out' });

}

const loginWithGoogle = (req, res) => {

}

const forgotPassword = async (req, res) => {
    const user = await User.findOne({email: req.body.email})

    if (user) {
 //       const randomNumber = Math.floor(100000 + Math.random() * 900000);
        const randomNumber = 91547
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
