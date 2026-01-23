const Category = require('../models/category');

// get all categories
exports.getAll = async (req, res) => {
    try {
        const categories = await Category.find();

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }

        return res.status(200).json({
            message: 'Categories retrieved successfully',
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching all categories:', error);
        res.status(500).json({ error: 'An error occurred while retrieving categories' });
    }
}