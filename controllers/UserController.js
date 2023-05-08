const User = require('../models/user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path');

//get user by id
exports.getUserbyid = (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ message: "user not found Check id" }));
}

//get all user
exports.getAllUser = (req, res) => {
    User.find()
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json({ error }));
}

//update user
exports.updateUser = (req, res) => {
/*
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    const user = new User({
        _id: req.params.id,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone
    });

    User.findOneAndUpdate({ _id: req.params.id }, user, { new: true , select: 'username email phone'})
    .then(updatedUser => {
      if (updatedUser) {
        res.status(200).json({
          message: 'User updated successfully!',
          token: jwt.sign({
            userId: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone,
            image:updatedUser.image,
            recettes: updatedUser.recettes,
            comments: updatedUser.comments
          }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' })
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(error => {
      res.status(400).json({ message: error.message });
    });
    
    })*/
      User.findByIdAndUpdate(req.params.id, {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
      }, { new: true })
      .then(updatedUser => {
        if (updatedUser) {
          return res.status(200).json({
            message: 'User updated successfully!',
            token: jwt.sign({
              userId: updatedUser._id,
              username: updatedUser.username,
              email: updatedUser.email,
              phone: updatedUser.phone,
              image: updatedUser.image,
              recettes: updatedUser.recettes,
              comments: updatedUser.comments,
            }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }),
          });
        } else {
          return res.status(404).json({ message: 'User not found' });
        }
      })
      .catch(error => {
        return res.status(400).json({ message: error.message });
      });
    };
    

//delete user
exports.deleteUser = (req, res) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'User deleted !' }))
        .catch(error => res.status(400).json({ message: "Check id" }));
}

//change password
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId  = req.params.id;
    if (!userId) {
        return res.status(401).json({ error: 'User not found' });
    }

    const user = await User.findById(userId);

    await bcrypt.compare(oldPassword, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'wrong password' });
            }
            bcrypt.hash(newPassword, 10, function (err, hashedPass) {
                if (err) {
                    res.json({
                        error: err
                    })
                }
                user.password = hashedPass;
                user.save()
                    .then(user => {
                        res.json({
                            message: 'Password updated successfully'
                        })
                    })
                    .catch(error => {
                        res.json({
                            message: 'An error occurred'
                        })
                    })
            })
        })
}

exports.uploadImage = async (req, res) => {
    const { userId } = req.params;
  
    if (req.file && req.file.path) {
      const fileUrl = path.basename(req.file.path);
      console.log("image path",fileUrl)

      const fullFileUrl = `http://localhost:3000/api/users/image/${userId}/${fileUrl}`
      const updatedUser = await User.findByIdAndUpdate(userId, {
        image: fullFileUrl
      });
  
      return res.json({
        status: "ok",
        success: true,
        url: fullFileUrl,
        message:'Image has been uploaded successfully',
        user: updatedUser,
        token: jwt.sign({
          userId: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          phone: updatedUser.phone,
          image:fullFileUrl,
          recettes: updatedUser.recettes,
          comments: updatedUser.comments
        }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' })
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "File not found"
      });
    }
  };
  
  exports.getImage = async (req, res) => {
    const {userId,imageName } = req.params;

    res.sendFile(`/Users/imac-1/Desktop/khabthani/backend/Rest-Api-ME-N/uploads/${userId}/${imageName}`);
  };
  


  