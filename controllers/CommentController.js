const comment = require("../models/comment");
const recette = require("../models/recette");
const user = require("../models/user");


// get all comments
exports.getAll = async (req, res) => {
    res.send({ comments: await comment.find() })
}


//get comment by id
exports.getCommentbyid = (req, res, next) => {
    comment.findOne({ _id: req.params.id })
        .then(comment => res.status(200).json(comment))
        .catch(error => res.status(404).json({ message: "comment not found Check id" }));
}

// add comment
exports.add = async (req, res) => {

    const { text,recetteId ,userId,username} = req.body;

    const newComment = new comment()
    newComment.text = text
    newComment.recette = recetteId
    newComment.user = userId
    newComment.username= username
    newComment.save();
    await Promise.all([recette.updateOne({ _id: recetteId },
        {
        $push: { comments: newComment._id }
    }), user.updateOne({ _id: userId },
        {
        $push: { comments: newComment._id }
    })]);

    res.status(201).send({ message: "success", comment: newComment })
}

//update comment
exports.edit = (req, res, next) => {
    comment.updateOne({ _id: req.params.id}, { text: req.body.text ,
    })
        .then(() => res.json({ message: 'comment modified !' }))
        .catch(error => res.json({ message: "Check id" }));
}

//delete comment
exports.delete = (req, res, next) => {
    comment.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'comment deleted !' }))
        .catch(error => res.status(400).json({ message: "Check id" }));
}