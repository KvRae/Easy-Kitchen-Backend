const Recette = require("../models/recette");
const mongoose = require('mongoose');
const User = require("../models/user");
const path = require('path');
const fs = require('fs');


// get all recettes
exports.getAll = async (req, res) => {
    try {
        const recettes = await Recette.find().populate("comments").populate("usersLiked").populate("usersDisliked");

        if (!recettes || recettes.length === 0) {
            return res.status(404).json({ message: 'No recettes found' });
        }

        return res.status(200).json({
            message: 'Recettes retrieved successfully',
            count: recettes.length,
            data: recettes
        });
    } catch (error) {
        console.error('Error fetching all recettes:', error);
        res.status(500).json({ error: 'An error occurred while retrieving recettes' });
    }
}

// get all bio recettes
exports.getAllBio = async (req, res) => {
    try {
        const recettes = await Recette.find({ isBio: true }).populate("comments").populate("usersLiked").populate("usersDisliked");

        if (!recettes || recettes.length === 0) {
            return res.status(404).json({ message: 'No bio recettes found' });
        }

        return res.status(200).json({
            message: 'Bio recettes retrieved successfully',
            count: recettes.length,
            data: recettes
        });
    } catch (error) {
        console.error('Error fetching bio recettes:', error);
        res.status(500).json({ error: 'An error occurred while retrieving bio recettes' });
    }
}

// get recette by id
exports.getRecettebyid = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid recette ID format' });
        }

        const recette = await Recette.findOne({ _id: id }).populate("comments").populate("usersLiked").populate("usersDisliked");

        if (!recette) {
            return res.status(404).json({ error: 'Recette not found' });
        }

        return res.status(200).json({
            message: 'Recette retrieved successfully',
            data: recette
        });
    } catch (error) {
        console.error('Error fetching recette by ID:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the recette' });
    }
}

// get all comments by recette
exports.getCommentsByRecette = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid recette ID format' });
        }

        const recette = await Recette.findOne({ _id: id }).populate("comments");

        if (!recette) {
            return res.status(404).json({ error: 'Recette not found' });
        }

        if (!recette.comments || recette.comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this recette' });
        }

        return res.status(200).json({
            message: 'Comments retrieved successfully',
            count: recette.comments.length,
            data: recette.comments
        });
    } catch (error) {
        console.error('Error fetching comments by recette:', error);
        res.status(500).json({ error: 'An error occurred while retrieving comments' });
    }
}

// get all recettes by user
exports.getRecettesByUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const userObj = await User.findOne({ _id: id }).populate("recettes");

        if (!userObj) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!userObj.recettes || userObj.recettes.length === 0) {
            return res.status(404).json({ message: 'No recettes found for this user' });
        }

        return res.status(200).json({
            message: 'User recettes retrieved successfully',
            count: userObj.recettes.length,
            data: userObj.recettes
        });
    } catch (error) {
        console.error('Error fetching recettes by user:', error);
        res.status(500).json({ error: 'An error occurred while retrieving user recettes' });
    }
}

// like recette
exports.likeRecette = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        // Validate inputs
        if (!id || !userId) {
            return res.status(400).json({ error: 'Recette ID and User ID are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid recette ID format' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const recetteObj = await Recette.findOne({ _id: id });

        if (!recetteObj) {
            return res.status(404).json({ error: 'Recette not found' });
        }

        const userLiked = recetteObj.usersLiked.includes(userId);
        const userDisliked = recetteObj.usersDisliked.includes(userId);

        if (userLiked) {
            // User already liked - remove like
            await Recette.updateOne(
                { _id: id },
                {
                    $inc: { likes: -1 },
                    $pull: { usersLiked: userId }
                }
            );

            return res.status(200).json({
                message: 'Like removed',
                action: 'like_removed'
            });
        } else {
            // User hasn't liked - add like
            if (userDisliked) {
                // If user previously disliked, remove dislike
                await Recette.updateOne(
                    { _id: id },
                    {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: userId }
                    }
                );
            }

            // Add like
            await Recette.updateOne(
                { _id: id },
                {
                    $inc: { likes: 1 },
                    $push: { usersLiked: userId }
                }
            );

            return res.status(200).json({
                message: userDisliked ? 'Recette liked and dislike removed' : 'Recette liked',
                action: userDisliked ? 'dislike_removed_like_added' : 'like_added'
            });
        }
    } catch (error) {
        console.error('Error liking recette:', error);
        res.status(500).json({ error: 'An error occurred while liking the recette' });
    }
}

// dislike recette
exports.dislikeRecette = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        // Validate inputs
        if (!id || !userId) {
            return res.status(400).json({ error: 'Recette ID and User ID are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid recette ID format' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const recetteObj = await Recette.findOne({ _id: id });

        if (!recetteObj) {
            return res.status(404).json({ error: 'Recette not found' });
        }

        const userLiked = recetteObj.usersLiked.includes(userId);
        const userDisliked = recetteObj.usersDisliked.includes(userId);

        if (userDisliked) {
            // User already disliked - remove dislike
            await Recette.updateOne(
                { _id: id },
                {
                    $inc: { dislikes: -1 },
                    $pull: { usersDisliked: userId }
                }
            );

            return res.status(200).json({
                message: 'Dislike removed',
                action: 'dislike_removed'
            });
        } else {
            // User hasn't disliked - add dislike
            if (userLiked) {
                // If user previously liked, remove like
                await Recette.updateOne(
                    { _id: id },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: userId }
                    }
                );
            }

            // Add dislike
            await Recette.updateOne(
                { _id: id },
                {
                    $inc: { dislikes: 1 },
                    $push: { usersDisliked: userId }
                }
            );

            return res.status(200).json({
                message: userLiked ? 'Recette disliked and like removed' : 'Recette disliked',
                action: userLiked ? 'like_removed_dislike_added' : 'dislike_added'
            });
        }
    } catch (error) {
        console.error('Error disliking recette:', error);
        res.status(500).json({ error: 'An error occurred while disliking the recette' });
    }
}

// add recette
exports.add = async (req, res) => {
    try {
        const {
            name, description, image, isBio, duration, person, difficulty, userId,
            strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5,
            strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10,
            strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15,
            strIngredient16, strIngredient17, strIngredient18, strIngredient19, strIngredient20,
            strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5,
            strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10,
            strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15,
            strMeasure16, strMeasure17, strMeasure18, strMeasure19, strMeasure20
        } = req.body;

        // Validate required fields
        if (!name || !description || !userId || !difficulty) {
            return res.status(400).json({
                error: 'Required fields missing: name, description, userId, difficulty'
            });
        }

        // Validate difficulty enum
        if (!['Facile', 'Moyenne', 'Difficile'].includes(difficulty)) {
            return res.status(400).json({
                error: 'Difficulty must be one of: Facile, Moyenne, Difficile'
            });
        }

        // Validate user exists
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create new recette
        const newRecette = new Recette({
            name: name.trim(),
            description: description.trim(),
            image: image || "http://localhost:3000/api/recettes/image/recipe/recipe.png",
            isBio: isBio || false,
            duration: duration || 0,
            person: person || 1,
            difficulty,
            userId,
            strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5,
            strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10,
            strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15,
            strIngredient16, strIngredient17, strIngredient18, strIngredient19, strIngredient20,
            strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5,
            strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10,
            strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15,
            strMeasure16, strMeasure17, strMeasure18, strMeasure19, strMeasure20
        });

        const savedRecette = await newRecette.save();

        // Add recette to user's recettes
        await User.updateOne(
            { _id: userId },
            { $push: { recettes: savedRecette._id } }
        );

        return res.status(201).json({
            message: 'Recette created successfully',
            data: savedRecette
        });
    } catch (error) {
        console.error('Error adding recette:', error);
        res.status(500).json({ error: 'An error occurred while creating the recette' });
    }
}

// update recette
exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, description, image, isBio, duration, person, difficulty,
            strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5,
            strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10,
            strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15,
            strIngredient16, strIngredient17, strIngredient18, strIngredient19, strIngredient20,
            strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5,
            strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10,
            strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15,
            strMeasure16, strMeasure17, strMeasure18, strMeasure19, strMeasure20
        } = req.body;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid recette ID format' });
        }

        // Validate difficulty if provided
        if (difficulty && !['Facile', 'Moyenne', 'Difficile'].includes(difficulty)) {
            return res.status(400).json({
                error: 'Difficulty must be one of: Facile, Moyenne, Difficile'
            });
        }

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (description) updateData.description = description.trim();
        if (image) updateData.image = image;
        if (isBio !== undefined) updateData.isBio = isBio;
        if (duration !== undefined) updateData.duration = duration;
        if (person !== undefined) updateData.person = person;
        if (difficulty) updateData.difficulty = difficulty;

        // Add ingredient and measure fields if provided
        if (strIngredient1) updateData.strIngredient1 = strIngredient1;
        if (strIngredient2) updateData.strIngredient2 = strIngredient2;
        if (strIngredient3) updateData.strIngredient3 = strIngredient3;
        if (strIngredient4) updateData.strIngredient4 = strIngredient4;
        if (strIngredient5) updateData.strIngredient5 = strIngredient5;
        if (strIngredient6) updateData.strIngredient6 = strIngredient6;
        if (strIngredient7) updateData.strIngredient7 = strIngredient7;
        if (strIngredient8) updateData.strIngredient8 = strIngredient8;
        if (strIngredient9) updateData.strIngredient9 = strIngredient9;
        if (strIngredient10) updateData.strIngredient10 = strIngredient10;
        if (strIngredient11) updateData.strIngredient11 = strIngredient11;
        if (strIngredient12) updateData.strIngredient12 = strIngredient12;
        if (strIngredient13) updateData.strIngredient13 = strIngredient13;
        if (strIngredient14) updateData.strIngredient14 = strIngredient14;
        if (strIngredient15) updateData.strIngredient15 = strIngredient15;
        if (strIngredient16) updateData.strIngredient16 = strIngredient16;
        if (strIngredient17) updateData.strIngredient17 = strIngredient17;
        if (strIngredient18) updateData.strIngredient18 = strIngredient18;
        if (strIngredient19) updateData.strIngredient19 = strIngredient19;
        if (strIngredient20) updateData.strIngredient20 = strIngredient20;
        if (strMeasure1) updateData.strMeasure1 = strMeasure1;
        if (strMeasure2) updateData.strMeasure2 = strMeasure2;
        if (strMeasure3) updateData.strMeasure3 = strMeasure3;
        if (strMeasure4) updateData.strMeasure4 = strMeasure4;
        if (strMeasure5) updateData.strMeasure5 = strMeasure5;
        if (strMeasure6) updateData.strMeasure6 = strMeasure6;
        if (strMeasure7) updateData.strMeasure7 = strMeasure7;
        if (strMeasure8) updateData.strMeasure8 = strMeasure8;
        if (strMeasure9) updateData.strMeasure9 = strMeasure9;
        if (strMeasure10) updateData.strMeasure10 = strMeasure10;
        if (strMeasure11) updateData.strMeasure11 = strMeasure11;
        if (strMeasure12) updateData.strMeasure12 = strMeasure12;
        if (strMeasure13) updateData.strMeasure13 = strMeasure13;
        if (strMeasure14) updateData.strMeasure14 = strMeasure14;
        if (strMeasure15) updateData.strMeasure15 = strMeasure15;
        if (strMeasure16) updateData.strMeasure16 = strMeasure16;
        if (strMeasure17) updateData.strMeasure17 = strMeasure17;
        if (strMeasure18) updateData.strMeasure18 = strMeasure18;
        if (strMeasure19) updateData.strMeasure19 = strMeasure19;
        if (strMeasure20) updateData.strMeasure20 = strMeasure20;

        const updatedRecette = await Recette.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedRecette) {
            return res.status(404).json({ error: 'Recette not found' });
        }

        return res.status(200).json({
            message: 'Recette updated successfully',
            data: updatedRecette
        });
    } catch (error) {
        console.error('Error updating recette:', error);
        res.status(500).json({ error: 'An error occurred while updating the recette' });
    }
}

// delete recette
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid recette ID format' });
        }

        const deletedRecette = await Recette.findByIdAndDelete(id);

        if (!deletedRecette) {
            return res.status(404).json({ error: 'Recette not found' });
        }

        // Remove recette from user's recettes
        if (deletedRecette.userId) {
            await User.updateOne(
                { _id: deletedRecette.userId },
                { $pull: { recettes: id } }
            );
        }

        return res.status(200).json({
            message: 'Recette deleted successfully',
            data: deletedRecette
        });
    } catch (error) {
        console.error('Error deleting recette:', error);
        res.status(500).json({ error: 'An error occurred while deleting the recette' });
    }
}

// upload image
exports.uploadImage = async (req, res) => {
    try {
        const { recetteId } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(recetteId)) {
            return res.status(400).json({ error: 'Invalid recette ID format' });
        }

        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: 'File not found or file path missing' });
        }

        const fileUrl = path.basename(req.file.path);
        const fullFileUrl = `http://localhost:3000/api/recettes/image/${recetteId}/${fileUrl}`;

        const updatedRecette = await Recette.findByIdAndUpdate(
            recetteId,
            { image: fullFileUrl },
            { new: true }
        );

        if (!updatedRecette) {
            return res.status(404).json({ error: 'Recette not found' });
        }

        return res.status(200).json({
            message: 'Image uploaded successfully',
            url: fullFileUrl,
            data: updatedRecette
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'An error occurred while uploading the image' });
    }
}

// get image
exports.getImage = async (req, res) => {
    try {
        const { recetteId, imageName } = req.params;

        // Validate inputs
        if (!recetteId || !imageName) {
            return res.status(400).json({ error: 'Recette ID and image name are required' });
        }

        // Security: Prevent directory traversal attacks
        if (imageName.includes('..') || imageName.includes('/')) {
            return res.status(400).json({ error: 'Invalid image name' });
        }

        // Use environment variable for upload directory or configure it
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        const filePath = path.join(uploadDir, recetteId, imageName);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Image not found' });
        }

        return res.sendFile(filePath);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'An error occurred while fetching the image' });
    }
}








