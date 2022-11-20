const ingredient = require("../models/ingredient");


// get all ingredients
exports.getAll = async (req, res) => {
    res.send({ ingredients: await ingredient.find() })
}

// add ingredient
exports.add = async (req, res) => {

    const { name, image} = req.body;

    const newIngredient = new ingredient()
    newIngredient.name = name
    newIngredient.image = image
    newIngredient.save();

    res.status(201).send({ message: "success", ingredient: newIngredient })
}

// update ingredient
exports.edit = async (req, res) => {
    const { _id, name} = req.body

    let ingredient= await ingredient.findOneAndUpdate(
        { _id: _id },
        {
            $set: {
                name: name
            }
        }
    )
    res.status(201).send({ message: "success", ingredient: ingredient })
}

// delete ingredient by id
exports.delete = async (req, res) => {

    ingredient.findByIdAndRemove(req.body.id)

        .then(() => {
            res.json({
                message: "success"
            })
        })
}

// delete all ingredient
exports.deleteAll = async (req, res) => {
    ingredient.remove({}, function (err, ingredient) {
        if (err) { return handleError(res, err) }
        return res.status(204).send({ message: "no ingredients found" })
    })
}