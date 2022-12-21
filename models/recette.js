const mongoose = require('mongoose')
const schema = mongoose.Schema;

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
    },
    likes:{type:Number,default: 0},

    dislikes:{type:Number,default:0},

    usersLiked:[{type:schema.Types.ObjectId,ref:"User"}],

    usersDisliked:[{type:schema.Types.ObjectId,ref:"User"}],

    comments: [{
        type: schema.Types.ObjectId,
         ref: "Comment" }],
    user: {
         type: schema.Types.ObjectId,
          ref: "User" }
}, {timestamps: true})

module.exports = mongoose.model('Recette', recetteSchema)