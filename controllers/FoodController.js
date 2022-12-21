const food = require('../models/food');

// get all foods
exports.getAll = async (req, res) => {
    food.find()
        .then(food => res.status(200).json(food))
        .catch(error => res.status(400).json({ error }));
}