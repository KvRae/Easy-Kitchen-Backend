const mongoose = require('mongoose')

const ingredientsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Ingredient', ingredientsSchema)