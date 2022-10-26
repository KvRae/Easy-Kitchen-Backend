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
                    message : "user Added Successfully"
                })
            })
            .catch(err => {
                res.json({
                    message: 'An error occured!'
                })
            })
    })

}

const login =(req,res, next)=>{
    var username = req.body.username
    var password = req.body.password

    User.findOne({$or: [{email:username},{phone:username}]})
        .then(user => {
            if(user){
                bcrypt.compare(password,user.password, function (err,result){
                    if (err){
                        res.json({
                           error: err
                        })
                    }
                    if (result){
                        let token = jwt.sign({name: user.username},'verySecretValue',{expiresIn:'1h'})
                        res.json({
                            message: 'Login Successfull',
                            token
                        })
                    }else {
                        res.json({
                            message: 'Password does not match!'
                        })
                    }
                })
            }else {
                message: 'No user Found!'
            }
        })
}

module.exports = { register,login}