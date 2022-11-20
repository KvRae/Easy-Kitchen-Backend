const User = require('../models/user');



//get user by id
exports.getUserbyid = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ message: "user not found Check id" }));
}

//get all user
exports.getAllUser = (req, res, next) => {
    User.find()
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json({ error }));
}

//update user
exports.updateUser = (req, res, next) => {
    User.updateOne({ _id: req.params.id}, { nom: req.body.username , email: req.body.email, phone: req.body.phone })
        .then(() => res.json({ message: 'user modified !' }))
        .catch(error => res.json({ message: "Check id" }));
}

//delete user
exports.deleteUser = (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'User deleted !' }))
        .catch(error => res.status(400).json({ message: "Check id" }));
}