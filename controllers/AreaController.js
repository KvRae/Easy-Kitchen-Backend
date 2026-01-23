const mongoose = require('mongoose');
const Area = require('../models/area');

// get all areas
exports.getAll = async (req, res) => {
    try {
        const areas = await Area.find();

        if (!areas || areas.length === 0) {
            return res.status(404).json({ message: 'No areas found' });
        }

        return res.status(200).json({
            message: 'Areas retrieved successfully',
            count: areas.length,
            data: areas
        });
    } catch (error) {
        console.error('Error fetching all areas:', error);
        res.status(500).json({ error: 'An error occurred while retrieving areas' });
    }
}

// get area by id
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid area ID format' });
        }

        const area = await Area.findById(id);

        if (!area) {
            return res.status(404).json({ error: 'Area not found' });
        }

        return res.status(200).json({
            message: 'Area retrieved successfully',
            data: area
        });
    } catch (error) {
        console.error('Error fetching area by ID:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the area' });
    }
}