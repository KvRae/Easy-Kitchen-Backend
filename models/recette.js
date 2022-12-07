const mongoose = require('mongoose')

const recetteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        unique:true
    },
    isBio: {
        type: Boolean,
        required: true
    },
    duration:{
        type:Number,
        required:true
    },
    person:{
        type:Number,
        required:true
    },
    difficulty:{
        type:String,
        enum :['Facile','Moyenne','Difficile'],
    }
}, {timestamps: true})

module.exports = mongoose.model('Recette', recetteSchema)