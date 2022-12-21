const mongoose = require('mongoose')
const schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,

    },
    date: {
        type: Date,
        default: Date.now,
    },
    recette: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recette'
     },
    user: { 
        type: schema.Types.ObjectId,
        ref: "User" }
}, {timestamps: true})

module.exports = mongoose.model('Comment', commentSchema)