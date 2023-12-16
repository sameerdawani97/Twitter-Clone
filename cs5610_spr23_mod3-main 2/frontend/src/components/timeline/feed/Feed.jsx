import React, { useContext } from "react"
import NewTweet from "./tweet/NewTweet";
import { Container } from "react-bootstrap";
import Post from "./post/Post";
import { AppContext } from "../../../App";
import axios from "axios";
import './Feed.css'

// Feed component is showing all the posts on timeline
function Feed() {
    const {activeUsername, postDB, setPostDB} = useContext(AppContext);
   
    const handleDeletePost = async (idToDelete) => {
        const deletePostResponse = await axios.post('/api/posts/delete/'+idToDelete);
        if(deletePostResponse.status === 200) {
            const updatedPosts = postDB.posts.filter(post => post._id !== idToDelete);
            setPostDB({posts: updatedPosts});
        }
    }

    return (
        <Container className="timeline-container">
            <div className="feed">
                <div className="new-tweet-container">
                    { activeUsername != null && <NewTweet />}
                </div>
                {
                    postDB.posts.length == 0 && <div className="no-post-text">No posts to show</div>
                }
                <div className="all-post-container">
                    
                { 
                postDB.posts.map((post) => {
                    return <Post key={post._id} id={post._id} username={post.username} content={post.content} timestamp={post.timestamp} onDeletePost={handleDeletePost}/>
                })}
                
                </div>
            </div>
        </Container>
    );
}

export default Feed;