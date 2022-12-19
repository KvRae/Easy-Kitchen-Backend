const mongoose = require('mongoose')

const ingredientsSchema = new mongoose.Schema({
    strIngredient: {
        type: String,
        required: true,
        unique: true
    },
    strDescription: {
        type: String,
        required: true,
    }
}, {timestamps: true})

module.exports = mongoose.model('ingredients', ingredientsSchema)