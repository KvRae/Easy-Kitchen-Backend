const mongoose = require('mongoose')

const schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
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
        type: String,
        required: true,
        unique: true,
        minlength: 8,
    },
    recettes: [{ type: schema.Types.ObjectId, ref: "Recette" }],
    comments:[{ type:schema.Types.ObjectId, ref:"Comment"}]

}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)