const mongoose = require('mongoose');
const Ingredient = require('../models/ingredient');

// get all ingredients
exports.getAll = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();

        if (!ingredients || ingredients.length === 0) {
            return res.status(404).json({ message: 'No ingredients found' });
        }

        return res.status(200).json({
            message: 'Ingredients retrieved successfully',
            count: ingredients.length,
            data: ingredients
        });
    } catch (error) {
        console.error('Error fetching all ingredients:', error);
        res.status(500).json({ error: 'An error occurred while retrieving ingredients' });
    }
}

// add ingredient
exports.add = async (req, res) => {
    const { strIngredient, strDescription } = req.body;

    // Validate required fields
    if (!strIngredient || !strDescription) {
        return res.status(400).json({
            error: 'Both strIngredient and strDescription are required'
        });
    }

    // Validate field types
    if (typeof strIngredient !== 'string' || strIngredient.trim().length === 0) {
        return res.status(400).json({
            error: 'strIngredient must be a non-empty string'
        });
    }

    if (typeof strDescription !== 'string' || strDescription.trim().length === 0) {
        return res.status(400).json({
            error: 'strDescription must be a non-empty string'
        });
    }

    try {
        // Check if ingredient already exists
        const existingIngredient = await Ingredient.findOne({ strIngredient });
        if (existingIngredient) {
            return res.status(409).json({
                error: 'Ingredient with this name already exists'
            });
        }

        // Create new ingredient
        const newIngredient = new Ingredient({
            strIngredient: strIngredient.trim(),
            strDescription: strDescription.trim()
        });

        const savedIngredient = await newIngredient.save();

        return res.status(201).json({
            message: 'Ingredient created successfully',
            data: savedIngredient
        });
    } catch (error) {
        console.error('Error adding ingredient:', error);
        res.status(500).json({ error: 'An error occurred while creating the ingredient' });
    }
}

// update ingredient
exports.edit = async (req, res) => {
    const { _id, strIngredient, strDescription } = req.body;

    // Validate required fields
    if (!_id || !strIngredient || !strDescription) {
        return res.status(400).json({
            error: '_id, strIngredient, and strDescription are required'
        });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ error: 'Invalid ingredient ID format' });
    }

    // Validate field types
    if (typeof strIngredient !== 'string' || strIngredient.trim().length === 0) {
        return res.status(400).json({
            error: 'strIngredient must be a non-empty string'
        });
    }

    if (typeof strDescription !== 'string' || strDescription.trim().length === 0) {
        return res.status(400).json({
            error: 'strDescription must be a non-empty string'
        });
    }

    try {
        // Check if another ingredient has the same name
        const existingIngredient = await Ingredient.findOne({
            strIngredient,
            _id: { $ne: _id }
        });
        if (existingIngredient) {
            return res.status(409).json({
                error: 'Another ingredient with this name already exists'
            });
        }

        // Update ingredient
        const updatedIngredient = await Ingredient.findOneAndUpdate(
            { _id },
            {
                $set: {
                    strIngredient: strIngredient.trim(),
                    strDescription: strDescription.trim()
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedIngredient) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }

        return res.status(200).json({
            message: 'Ingredient updated successfully',
            data: updatedIngredient
        });
    } catch (error) {
        console.error('Error updating ingredient:', error);
        res.status(500).json({ error: 'An error occurred while updating the ingredient' });
    }
}

// delete ingredient by id
exports.delete = async (req, res) => {
    const { id } = req.body;

    // Validate required field
    if (!id) {
        return res.status(400).json({ error: 'Ingredient ID is required' });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ingredient ID format' });
    }

    try {
        const deletedIngredient = await Ingredient.findByIdAndDelete(id);

        if (!deletedIngredient) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }

        return res.status(200).json({
            message: 'Ingredient deleted successfully',
            data: deletedIngredient
        });
    } catch (error) {
        console.error('Error deleting ingredient:', error);
        res.status(500).json({ error: 'An error occurred while deleting the ingredient' });
    }
}

// delete all ingredients
exports.deleteAll = async (req, res) => {
    try {
        const result = await Ingredient.deleteMany({});

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No ingredients found to delete' });
        }

        return res.status(200).json({
            message: 'All ingredients deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error deleting all ingredients:', error);
        res.status(500).json({ error: 'An error occurred while deleting ingredients' });
    }
}