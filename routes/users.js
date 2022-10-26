var express = require('express');
var router = express.Router();
var User = require('../models/user');

//Getting all users
router.get('/',async (req, res) => {
    try{
        const users = await User.find()
        res.json(users)
    }catch (err) {
        res.status(500).json({message: err.message})
    }
})

//Creating user
router.post('/', (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
    })
    user.save()
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.json({message: err})
        })
})
//Updating user
router.patch('/:id',async (req, res) => {
    if (req.body.username != null) {
        res.user.username = req.body.username
    }
    if (req.body.email != null) {
        res.user.email = req.body.email
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})
//Deleting user
router.delete('/:id',async (req, res) => {
    try{
        await res.user.remove()
        res.json({message: "Deleted User"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


module.exports = router;
