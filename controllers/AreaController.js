const area = require('../models/area');

// get all areas
exports.getAll = async (req, res) => {
    area.find()
        .then(area => res.status(200).json(area))
        .catch(error => res.status(400).json({ error }));
}

// get area by id
exports.getById = async (req, res) => {
    area.findById(req.params.id)
        .then(area => res.status(200).json(area))
        .catch(error => res.status(400).json({ error }));
}