const mongoose = require('mongoose')

const ingredientsSchema = new mongoose.Schema({

    idIngredient: {
        type: String,
        required: true
    },
    strIngredient: {
        type: String,
        required: true,
        unique: true
    },
    strDescription: {
        type: String,
        required: true,
        unique: true
    },
    strType: {
        type: String
    }
}, {timestamps: true})

module.exports = mongoose.model('ingredients', ingredientsSchema)