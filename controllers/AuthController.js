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
            phone: req.body.phone
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
                        token: jwt.sign({ userId: user._id },
                            'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                        )

                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));


};

const logout = (req, res, next) => {
    res.status(200).json({ message: 'User logged out' });

}

const registerGoogle = (req, res, next) => {

}

exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({email: req.body.email}).select("-password");

    if (user) {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);

        // Token creation
        const token = await generateResetToken(randomNumber)

        const success = await sendEmail({
            from: process.env.GMAIL_USER,
            to: req.body.email,
            subject: "Password reset - Kitebi",
            html:
                "<h3>You have requested to reset your password</h3><p>Your reset code is : <b style='color : #22b7f8'>" +
                randomNumber +
                "</b></p>",
        }).catch((error) => {
            console.log(error)
            return res.status(500).send({
                message: "Error : email could not be sent"
            })
        });

        if (success) {
            return res.status(200).send({
                message: "Reset email has been sent to : " + user.email, token
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

exports.verifyResetCode = async (req, res) => {
    const {typedResetCode} = req.body;

    let openToken
    try {
        openToken = jwt.verify(req.body.token, process.env.JWT_SECRET, {}, {});
    } catch (e) {
        console.log(e)
        return res.status(500).send({message: "Error, could not decrypt token"});
    }

    if (String(openToken.resetCode) === typedResetCode) {
        res.status(200).send({message: "Success"});
    } else {
        res.status(403).send({message: "Incorrect reset code"});
    }
}

exports.resetPassword = async (req, res) => {
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


// UTILITIES FUNCTIONS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function generateUserToken(user) {
    return jwt.sign(
        {user}, process.env.JWT_SECRET, {
            expiresIn: "100000000", // in Milliseconds (3600000 = 1 hour)
        }, {}
    )
}

function generateResetToken(resetCode) {
    return jwt.sign(
        {resetCode},
        process.env.JWT_SECRET, {
            expiresIn: "100000000", // in Milliseconds (3600000 = 1 hour)
        }, {}
    )
}

async function doSendConfirmationEmail(email, token, protocol) {
    let port = process.env.PORT || 5000

    await sendEmail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Confirm your email",
        html:
            "<h3>Please confirm your email using this </h3><a href='" +
            protocol + "://" + os.hostname() + ":" + port + "/auth/confirmation/" + token +
            "'>Link</a>",
    })
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


module.exports = { register,login}