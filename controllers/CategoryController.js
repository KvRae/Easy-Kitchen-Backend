const category = require('../models/category');

// get all categories
exports.getAll = async (req, res) => {
    category.find()
        .then(category => res.status(200).json(category))
        .catch(error => res.status(400).json({ error }));
}