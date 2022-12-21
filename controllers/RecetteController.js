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

    const { name,description ,image,isBio,duration,person,difficulty,userId} = req.body;

    const newRecette = new recette()
    newRecette.name = name
    newRecette.description = description
    newRecette.image = image
    newRecette.isBio = isBio
    newRecette.duration = duration
    newRecette.person = person
    newRecette.difficulty = difficulty
    newRecette.user= userId
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

