const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const register = (req,res,next) => {
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

const login = (req, res, next) => {
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

module.exports = { register,login}