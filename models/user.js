const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        minlength: 8,
    },
})

module.exports = mongoose.model('User', userSchema)