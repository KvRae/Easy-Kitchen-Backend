const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// get user by id
exports.getUserbyid = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const user = await User.findOne({ _id: id }).populate('recettes').populate('comments');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the user' });
    }
}

// get all users
exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find().populate('recettes').populate('comments');

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        return res.status(200).json({
            message: 'Users retrieved successfully',
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ error: 'An error occurred while retrieving users' });
    }
}

// update user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone } = req.body;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        // Validate at least one field is provided for update
        if (!username && !email && !phone) {
            return res.status(400).json({ error: 'At least one field (username, email, or phone) is required for update' });
        }

        // Validate email format if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Check if email already exists (and belongs to different user)
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(409).json({ error: 'Email already in use by another user' });
            }
        }

        // Validate username format if provided
        if (username && username.trim().length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters long' });
        }

        // Validate phone format if provided
        if (phone && phone.trim().length < 8) {
            return res.status(400).json({ error: 'Phone number must be at least 8 characters long' });
        }

        const updateData = {};
        if (username) updateData.username = username.trim();
        if (email) updateData.email = email.trim();
        if (phone) updateData.phone = phone.trim();

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('recettes').populate('comments');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Ensure JWT_SECRET is configured
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const token = jwt.sign({
            userId: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone,
            image: updatedUser.image,
            recettes: updatedUser.recettes,
            comments: updatedUser.comments
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({
            message: 'User updated successfully',
            data: updatedUser,
            token: token
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
}

// delete user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            message: 'User deleted successfully',
            data: deletedUser
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
}

// change password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { id } = req.params;

        // Validate inputs
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Old password and new password are required' });
        }

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        // Validate new password strength
        if (typeof newPassword !== 'string' || newPassword.trim().length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare old password with stored hash
        const validPassword = await bcrypt.compare(oldPassword, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Incorrect old password' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        console.log('Password changed successfully for user:', id);
        return res.status(200).json({
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'An error occurred while changing the password' });
    }
}

// upload user image
exports.uploadImage = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: 'File not found or file path missing' });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const fileUrl = path.basename(req.file.path);
        const fullFileUrl = `http://localhost:3000/api/users/image/${userId}/${fileUrl}`;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { image: fullFileUrl },
            { new: true }
        ).populate('recettes').populate('comments');

        // Ensure JWT_SECRET is configured
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const token = jwt.sign({
            userId: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone,
            image: fullFileUrl,
            recettes: updatedUser.recettes,
            comments: updatedUser.comments
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({
            message: 'Image uploaded successfully',
            url: fullFileUrl,
            data: updatedUser,
            token: token
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'An error occurred while uploading the image' });
    }
}

// get user image
exports.getImage = async (req, res) => {
    try {
        const { userId, imageName } = req.params;

        // Validate inputs
        if (!userId || !imageName) {
            return res.status(400).json({ error: 'User ID and image name are required' });
        }

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        // Security: Prevent directory traversal attacks
        if (imageName.includes('..') || imageName.includes('/')) {
            return res.status(400).json({ error: 'Invalid image name' });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Use environment variable for upload directory or default
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        const filePath = path.join(uploadDir, userId, imageName);

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



  