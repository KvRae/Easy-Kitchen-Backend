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
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ error: "user with this email does not exist" });
        }

        const token = jwt.sign({ _id: user._id }, RESET_PWD_KEY, {
            expiresIn: "30m",
        });

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.GOOGLE_ACCOUNT_EMAIL, // generated ethereal user
                pass: process.env.GOOGLE_ACCOUNT_PASSWORD, // generated ethereal password
            },
            tls: { rejectUnauthorized: false },
        });

        let info = await transporter.sendMail({
            from: "'EasyKitchen'",
            to: email,
            subject: "Account Activation link",
            text: "Account Activation link",
            html: ``,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        console.log("email has been sent");

        await user.updateOne({ resetLink: token });

        return res.status(200).json({
            message: "Email has been sent, kindly activate your account",
            token,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
//Reset Password
exports.resetPassword = async (req, res) => {
    const { resetLink, newPass } = req.body;
    if (resetLink && typeof resetLink === "string") {
        jwt.verify(resetLink, process.env.RESET_PWD_KEY, function (err, decodedData) {
            if (err) {
                return res.status(401).json({ err: "Incorrect token/expired" });
            }
            User.findOne({ resetLink }, async (err, user) => {
                if (err || !user) {
                    return res
                        .status(400)
                        .json({ error: "User with this token does not exist" });
                }

                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(newPass, salt);
                user.password = hash;
                user.resetLink = "";

                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({ error: "reset password error" });
                    } else {
                        return res.status(200).json({
                            message: "Your password has been changed",
                        });
                    }
                });
            });
        });
    } else {
        return res.status(401).json({ error: "Invalid or missing reset link" });
    }
};

module.exports = { register,login}