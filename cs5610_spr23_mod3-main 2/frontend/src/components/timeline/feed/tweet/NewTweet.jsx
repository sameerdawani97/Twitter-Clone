import axios from "axios";
import React, { useContext, useState } from "react"
import { AppContext } from "../../../../App";
import './NewTweet.css'

//NewTweet component is used to create a new tweet 
function NewTweet() {
    const [tweetInput, setTweetInput] = useState('');
    const {setErrMsg, postDB, setPostDB} = useContext(AppContext);
    const submitTweet = async (e) => {
        e.preventDefault();
        if(tweetInput.trim() === "") {
            return;
        }
        try {
            const newPostResponse = await axios.post('/api/posts', {content: tweetInput});
            
            const newPost = newPostResponse?.data;
            
            const sortedPosts = [...postDB.posts, newPost].sort((a, b) => {
                const timestampA = Date.parse(a.timestamp);
                const timestampB = Date.parse(b.timestamp);
                return timestampB - timestampA; //desc order
              });
            setPostDB({posts: sortedPosts});
            
            setTweetInput('');
        }
        catch(err) {
            if (!err?.response) {
                setErrMsg('Unable to save tweet');
            }
            else if(err?.response.status === 409) {
                setErrMsg('Username not found!');
            }
            else if(err?.response.status === 403) {
                setErrMsg('content is missing!');
            }
            else {
                setErrMsg('Saving tweet failed!')
            }
        }
    }

    return (
        <div className="new-tweet">
            <form onSubmit={submitTweet} className="new-tweet-form">
                <div className="new-tweet-form-field">   
                    <div className="new-tweet-form-input">
                        <input 
                        type="text" 
                        placeholder="Write a new tweet..." 
                        name="tweetInputHolder"
                        value={tweetInput}
                        onChange={(e) => setTweetInput(e.target.value)}/>
                    </div>
                    
                    <div className="new-tweet-form-input">
                        <button className="new-tweet-btn secondary-btn">Tweet</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default NewTweet;