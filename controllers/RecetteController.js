const recette = require("../models/recette");
var mongoose = require('mongoose');
const user = require("../models/user");



// get all foods
exports.getAll = async (req, res) => {
    recette.find()
        .then(recette => res.status(200).json(recette))
        .catch(error => res.status(400).json({ error }));
}
// get all bio recettes
exports.getAllBio = async (req, res) => {
    recette.find({isBio:true})
        .then(recette => res.status(200).json(recette))
        .catch(error => res.status(400).json({ error }));
}

//get recette by id
exports.getRecettebyid = (req, res, next) => {
    recette.findOne({ _id: req.params.id })
        .then((recette) => res.status(200).json(recette))
        .catch(error => res.status(404).json({ message: "recette not found Check id" }));
}

// TODO: get all comments by recette
exports.getAllByRecette = async (req, res,next) => {
    recette.findOne({ _id: req.params.id }).populate("comments")
    .then(recette => res.status(200).json(recette.comments))
    .catch(error => res.status(404).json({ message: "comment not found Check id" }));

}

// get all recettes by user
exports.getAllByUser = async (req, res,next) => {
    user.findOne({ _id: req.params.id }).populate("recettes")
    .then(user => res.status(200).json(user.recettes))
    .catch(error => res.status(404).json({ message: "user not found Check id" }));

}
// get all recette by user
exports.getAllByRecette = async (req, res,next) => {
    recette.findOne({ _id: req.params.id }).populate("comments")
    .then(recette => res.status(200).json(recette.comments))
    .catch(error => res.status(404).json({ message: "comment not found Check id" }));

}
//like recette
exports.likeRecette = (req, res, next) => {
    recette.findOne({ _id: req.params.id })
    .then((obj) =>{
        //LIKE
        if (!obj.usersLiked.includes(req.body.id) ){
            if(obj.usersDisliked.includes(req.body.id)){
                recette.updateOne({_id: req.params.id },
                    {
                    $inc:{dislikes:-1},
                   $pull:{usersDisliked:req.body.id},

                }).then(()=>{

                    recette.updateOne({_id: req.params.id },
                        {
                        $inc :{likes:1},
                        $push:{usersLiked:req.body.id} 
                    }).then(()=>res.status(201).json({message:"Recette like +1 dislike -1"})).catch(error=>res.status(404).json({error}));
                }).catch(error=>res.status(404).json({error}));;
                

                
            }else
            if(!obj.usersDisliked.includes(req.body.id)){
                recette.updateOne({_id: req.params.id },{
                    $inc :{likes:1},
                    $push:{usersLiked:req.body.id}
                }).then(()=>res.status(201).json({message:"Recette like +1"})).catch(error=>res.status(404).json({error}));
            }

             

        }
        if (obj.usersLiked.includes(req.body.id) ){

            recette.updateOne({_id: req.params.id },{
               $inc :{likes:-1},
               $pull:{usersLiked:req.body.id}
           }).then(()=>res.status(201).json({message:"Recette like -1"})).catch(error=>res.status(404).json({error}));
       }

       
    })
    .catch(error => res.status(404).json({ error }));
}

//dislike recette
exports.dislikeRecette = async (req, res, next) => {
    recette.findOne({ _id: req.params.id })
    .then((obj) =>{
//DISLIKE
if (!obj.usersDisliked.includes(req.body.id) ){
    if (obj.usersLiked.includes(req.body.id)){
        recette.updateOne({_id: req.params.id },{
            $inc:{likes:-1},
            $pull:{usersLiked:req.body.id},


        }).then(
        ()=>{
            recette.updateOne({_id: req.params.id },{

                $inc :{dislikes:1},
                $push:{usersDisliked:req.body.id}
    
            }).then(()=>res.status(201).json({message:"Recette dislike +1 like -1"})).catch(error=>res.status(404).json({error}));
        }
        ).catch(error=>res.status(404).json({error}));
    
        
    
    }else
    if(!obj.usersLiked.includes(req.body.id)){
        recette.updateOne({_id: req.params.id },{
            $inc :{dislikes:1},
            $push:{usersDisliked:req.body.id}
        }).then(()=>res.status(201).json({message:"Recette dislike +1"})).catch(error=>res.status(404).json({error}));
    
    
    }

}
     if (obj.usersDisliked.includes(req.body.id) ){
    recette.updateOne({_id: req.params.id },{
       $inc :{dislikes:-1},
       $pull:{usersDisliked: req.body.id}
   }).then(()=>res.status(201).json({message:"Recette dislike -1"})).catch(error=>res.status(404).json({error}));
}

       
    })
    .catch(error => res.status(404).json({ error }));
}







                

// add recette
exports.add = async (req, res) => {

    const { name,description ,image,isBio,duration,person,difficulty,userId,username,
        strIngredient1,strIngredient2,strIngredient3,strIngredient4,strIngredient5,
        strIngredient6,strIngredient7,strIngredient8,strIngredient9,strIngredient10,
        strIngredient11,strIngredient12,strIngredient13,strIngredient14,strIngredient15,
        strIngredient16,strIngredient17,strIngredient18,strIngredient19,strIngredient20,
        strMeasure1,strMeasure2,strMeasure3,strMeasure4,strMeasure5,strMeasure6,strMeasure7,
        strMeasure8,strMeasure9,strMeasure10,strMeasure11,strMeasure12,strMeasure13,strMeasure14,
        strMeasure15,strMeasure16,strMeasure17,strMeasure18,strMeasure19,strMeasure20} = req.body;

    const newRecette = new recette()
    newRecette.name = name
    newRecette.description = description
    newRecette.image = image
    newRecette.isBio = isBio
    newRecette.duration = duration
    newRecette.person = person
    newRecette.difficulty = difficulty
    newRecette.user= userId
    newRecette.username=username
    newRecette.strIngredient1=strIngredient1,
    newRecette.strIngredient2=strIngredient2,
    newRecette.strIngredient3=strIngredient3,
    newRecette.strIngredient4=strIngredient4,
    newRecette.strIngredient5=strIngredient5,
    newRecette.strIngredient6=strIngredient6,
    newRecette.strIngredient7=strIngredient7,
    newRecette.strIngredient8=strIngredient8,
    newRecette.strIngredient9=strIngredient9,
    newRecette.strIngredient10=strIngredient10,
    newRecette.strIngredient11=strIngredient11,
    newRecette.strIngredient12=strIngredient12,
    newRecette.strIngredient13=strIngredient13,
    newRecette.strIngredient14=strIngredient14,
    newRecette.strIngredient15=strIngredient15,
    newRecette.strIngredient16=strIngredient16,
    newRecette.strIngredient17=strIngredient17,
    newRecette.strIngredient18=strIngredient18,
    newRecette.strIngredient19=strIngredient19,
    newRecette.strIngredient20=strIngredient20,
    newRecette.strIngredient20=strIngredient20,
    newRecette.strMeasure1=strMeasure1,
    newRecette.strMeasure2=strMeasure2,
    newRecette.strMeasure3=strMeasure3,
    newRecette.strMeasure4=strMeasure4,
    newRecette.strMeasure5=strMeasure5,
    newRecette.strMeasure6=strMeasure6,
    newRecette.strMeasure7=strMeasure7,
    newRecette.strMeasure8=strMeasure8,
    newRecette.strMeasure9=strMeasure9,
    newRecette.strMeasure10=strMeasure10,
    newRecette.strMeasure11=strMeasure11,
    newRecette.strMeasure12=strMeasure12,
    newRecette.strMeasure13=strMeasure13,
    newRecette.strMeasure14=strMeasure14,
    newRecette.strMeasure15=strMeasure15,
    newRecette.strMeasure16=strMeasure16,
    newRecette.strMeasure17=strMeasure17,
    newRecette.strMeasure18=strMeasure18,
    newRecette.strMeasure19=strMeasure19,
    newRecette.strMeasure20=strMeasure20,



    
    newRecette.save();

    await user.updateOne({ _id: userId },
        {
        $push: { recettes: newRecette._id },
    })
    
    res.status(201).send({ message: "success", recette: newRecette })

}

//update recette
exports.edit = (req, res, next) => {
    recette.updateOne({ _id: req.params.id}, { name: req.body.name ,
        description: req.body.description,
        image: req.body.image,
        isBio:req.body.isBio,
        duration:req.body.duration,
        person:req.body.person,
        difficulty:req.body.difficulty,    
        strIngredient1:req.body.strIngredient1,
        strIngredient2:req.body.strIngredient2,
        strIngredient3:req.body.strIngredient3,
        strIngredient4:req.body.strIngredient4,
        strIngredient5:req.body.strIngredient5,
        strIngredient6:req.body.strIngredient6,
        strIngredient7:req.body.strIngredient7,
        strIngredient8:req.body.strIngredient8,
        strIngredient9:req.body.strIngredient9,
        strIngredient10:req.body.strIngredient10,
        strIngredient11:req.body.strIngredient11,
        strIngredient12:req.body.strIngredient12,
        strIngredient13:req.body.strIngredient13,
        strIngredient14:req.body.strIngredient14,
        strIngredient15:req.body.strIngredient15,
        strIngredient16:req.body.strIngredient16,
        strIngredient17:req.body.strIngredient17,
        strIngredient18:req.body.strIngredient18,
        strIngredient19:req.body.strIngredient19,
        strIngredient20:req.body.strIngredient20,
        strIngredient20:req.body.strIngredient20,
        strMeasure1:req.body.strMeasure1,
        strMeasure2:req.body.strMeasure2,
        strMeasure3:req.body.strMeasure3,
        strMeasure4:req.body.strMeasure4,
        strMeasure5:req.body.strMeasure5,
        strMeasure6:req.body.strMeasure6,
        strMeasure7:req.body.strMeasure7,
        strMeasure8:req.body.strMeasure8,
        strMeasure9:req.body.strMeasure9,
        strMeasure10:req.body.strMeasure10,
        strMeasure11:req.body.strMeasure11,
        strMeasure12:req.body.strMeasure12,
        strMeasure13:req.body.strMeasure13,
        strMeasure14:req.body.strMeasure14,
        strMeasure15:req.body.strMeasure15,
        strMeasure16:req.body.strMeasure16,
        strMeasure17:req.body.strMeasure17,
        strMeasure18:req.body.strMeasure18,
        strMeasure19:req.body.strMeasure19,
        strMeasure20:req.body.strMeasure20
    })
        .then(() => res.json({ message: 'recette modified !' }))
        .catch(error => res.json({ message: "Check id" }));
}

//delete recette
exports.delete = (req, res, next) => {
    recette.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'recette deleted !' }))
        .catch(error => res.status(400).json({ message: "Check id" }));
}
