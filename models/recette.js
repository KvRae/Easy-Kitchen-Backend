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
        required: true

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
          ref: "User" },
    username:{
        type:String,
        required:true
    },
          
          strIngredient1: {
              type: String,
          },
          strIngredient2: {
              type: String,
          },
          strIngredient3: {
              type: String,
          },
          strIngredient4: {
              type: String,
          },
          strIngredient5: {
              type: String,
          },
          strIngredient6: {
              type: String,
          },
          strIngredient7: {
              type: String,
          },
          strIngredient8: {
              type: String,
          },
          strIngredient9: {
          type: String},
          strIngredient10: {
              type: String,
          },
          strIngredient11: {
              type: String,
          },
          strIngredient12: {
              type: String,
          },
          strIngredient13: {
              type: String,
          },
          strIngredient14: {
              type: String,
          },
          strIngredient15: {
              type: String,
          },
          strIngredient16: {
              type: String,
          },
          strIngredient17: {
              type: String,
          },
          strIngredient18: {
              type: String,
          },
          strIngredient19: {
              type: String,
          },
          strIngredient20: {
              type: String,
          },
          strMeasure1: {
              type: String,
          },
          strMeasure2: {
              type: String,
          }
          ,
          strMeasure3: {
              type: String,
          }
          ,
          strMeasure4: {
              type: String,
          }
          ,
          strMeasure5: {
              type: String,
          }
          ,
          strMeasure6: {
              type: String,
          }
          ,
          strMeasure7: {
              type: String,
          }
          ,
          strMeasure8: {
              type: String,
          },
          strMeasure9: {
              type: String,
          }
          ,
          strMeasure10: {
              type: String,
          }
          ,
          strMeasure11: {
              type: String,
          }
          ,
          strMeasure12: {
              type: String,
          }
          ,
          strMeasure13: {
              type: String,
          }
          ,
          strMeasure14: {
              type: String,
          },
          strMeasure15: {
              type: String,
          },
          strMeasure16: {
              type: String,
          }
          ,
          strMeasure17: {
              type: String,
      
          }
          ,
          strMeasure18: {
              type: String,
          }
          ,
          strMeasure19: {
              type: String,
          }
          ,
          strMeasure20: {
              type: String,
          }

}, {timestamps: true})

module.exports = mongoose.model('Recette', recetteSchema)