const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    strCategory: {
        type: String,
        required: true,
        unique: true
    },
    strCategoryThumb: {
        type: String,
        required: true,
        unique: true
    },
    strCategoryDescription: {
        type: String
    }
}, {timestamps: true})

module.exports = mongoose.model('categories', categorySchema)