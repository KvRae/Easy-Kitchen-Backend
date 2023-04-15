const User = require('../models/user');
const bcrypt = require('bcryptjs')

//get user by id
exports.getUserbyid = (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ message: "user not found Check id" }));
}

//get all user
exports.getAllUser = (req, res) => {
    User.find()
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json({ error }));
}

//update user
exports.updateUser = (req, res) => {
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    const user = new User({
        _id: req.params.id,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone
    });
    User.updateOne({ _id: req.params.id }, user)
        .then(() => res.status(200).json({ message: 'User updated successfully !' }))
        .catch(error => res.status(400).json({ message: "Check id" })); })
}

//delete user
exports.deleteUser = (req, res) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'User deleted !' }))
        .catch(error => res.status(400).json({ message: "Check id" }));
}

//change password
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId  = req.params.id;
    if (!userId) {
        return res.status(401).json({ error: 'User not found' });
    }

    const user = await User.findById(userId);

    await bcrypt.compare(oldPassword, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'wrong password' });
            }
            bcrypt.hash(newPassword, 10, function (err, hashedPass) {
                if (err) {
                    res.json({
                        error: err
                    })
                }
                user.password = hashedPass;
                user.save()
                    .then(user => {
                        res.json({
                            message: 'Password updated successfully'
                        })
                    })
                    .catch(error => {
                        res.json({
                            message: 'An error occurred'
                        })
                    })
            })
        })
}


