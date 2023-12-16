const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')

const PostModel = require('../db/post/post.model');

// router to return all posts present in db.
router.get('/', async function(request, response) {
    console.log("sameer");
    try {
        const allPosts = await PostModel.returnAllPosts();
        return response.status(200).send(allPosts);
    }
    catch(err) {
        return response.status(409).send("Unable to fetch any post!");
    }
    
})

// this post api request saves a new post in DB
router.post('/', async function(request, response) {
    const newPost = request.body;
    let decryptedUsername;
    try {
        const username = request.cookies.username;
        decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD")
        
        if(!newPost.content) {
            return response.status(403).send("Missing tweet content")
        }
        if(!decryptedUsername) {
            return response.status(409).send('Unable to find username');
        }
        newPost.username = decryptedUsername;
       
        const newPostResponse = await PostModel.createPost(newPost);
        
        return response.status(200).send(newPostResponse);
    }
    catch(e) {
        return response.status(401).send("Error: Unable to save the post!");
    }
    
})

// this post api request used for deleting post in DB
router.post('/delete/:postId', async function(request, response) {
    const postId = request.params.postId;
    try {
        await PostModel.deletePost(postId);
        
        return response.status(200).send("Successfully deleted!");
    }
    catch(e) {
        return response.status(401).send("Error: Unable to delete the post!");
    }
    
})

// this get api request used for getting posts of a user from DB
router.get('/profile/:username', async function(request, response) {
    const username = request.params.username;
    try {
        const postsResponse = await PostModel.findPostByUsername(username);
        
        return response.status(200).send(postsResponse);
    }
    catch(e) {
        return response.status(401).send("Error: Unable to delete the post!");
    }
    
})

// this get api request used for getting post by id from DB
router.get('/find/:postId', async function(request, response) {
    const postId = request.params.postId;
    try {
        const postsResponse = await PostModel.findPostById(postId);
        
        return response.status(200).send(postsResponse);
    }
    catch(e) {
        return response.status(401).send("Error: Unable to find the post!");
    }
    
})

// this post api request used for updating post by id in DB
router.post('/edit/:postId', async function(request, response) {
    const postId = request.params.postId;
    const newPost = request.body;
    
    try {
        const newPostResponse = await PostModel.updatePostById(postId, newPost)
        
        return response.status(200).send(newPostResponse);
    }
    catch(e) {
        return response.status(409).send("Error: Unable to save the post!"+e);
    }
    
})

module.exports = router