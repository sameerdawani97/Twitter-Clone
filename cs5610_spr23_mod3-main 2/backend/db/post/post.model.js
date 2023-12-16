const mongoose = require("mongoose")

const PostSchema = require('./post.schema').PostSchema;

const PostModel = mongoose.model("PostModel", PostSchema);
// function to create a new post.
function createPost(post) {
    return PostModel.create(post);
}

// function to get all posts from DB.
function returnAllPosts(){
    return PostModel.find().exec();
}

// function to find all posts by username.
function findPostByUsername(username) {
    return PostModel.find({username: username}).exec();
}

//function to delete post by post id.
function deletePost(postId) {
    return PostModel.deleteOne({_id: postId}).exec();
}

// function to find post by id.
function findPostById(postId) {
    return PostModel.findById(postId).exec();
}

// function to update post by post id.
function updatePostById(postId, post) {
    return PostModel.updateOne({"_id": new mongoose.Types.ObjectId(postId)}, { $set: { "content": post.content, "timestamp": Date.now() }});
}

module.exports = {
    createPost,
    returnAllPosts,
    findPostByUsername,
    deletePost,
    findPostById,
    updatePostById
}