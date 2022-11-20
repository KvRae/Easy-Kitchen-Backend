const recette = require("../models/recette");


// get all recettes
exports.getAll = async (req, res) => {
    res.send({ recettes: await recette.find() })
}

// add recette
exports.add = async (req, res) => {

    const { name,description ,image,isBio,duration,person,difficulty} = req.body;

    const newRecette = new recette()
    newRecette.name = name
    newRecette.description = description
    newRecette.image = image
    newRecette.isBio = isBio
    newRecette.duration = duration
    newRecette.person = person
    newRecette.difficulty = difficulty
    newRecette.save();

    res.status(201).send({ message: "success", recette: newRecette })
}

//update user
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

//delete user
exports.delete = (req, res, next) => {
    recette.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'recette deleted !' }))
        .catch(error => res.status(400).json({ message: "Check id" }));
}