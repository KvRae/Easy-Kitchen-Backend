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
        required: false,
        unique: true,
        minlength: 8,
    },
    image:{
        type:String,
        default:'http://localhost:3000/api/users/image/avatar/avatar.jpg'
    },
    recettes: [{ type: schema.Types.ObjectId, ref: "Recette" }],
    comments:[{ type:schema.Types.ObjectId, ref:"Comment"}]

}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)