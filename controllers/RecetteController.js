const recette = require("../models/recette");
var mongoose = require('mongoose');
const user = require("../models/user");



// get all foods
exports.getAll = async (req, res) => {
    recette.find()
        .then(recette => res.status(200).json(recette))
        .catch(error => res.status(400).json({ error }));
}

//get recette by id
exports.getRecettebyid = (req, res, next) => {
    recette.findOne({ _id: req.params.id })
<<<<<<< HEAD
        .then((recette) => res.status(200).json(recette))
        .catch(error => res.status(404).json({ message: "recette not found Check id" }));
}

// get all comments by recette
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

    const { name,description ,image,isBio,duration,person,difficulty,userId,
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
        difficulty:req.body.difficulty
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


