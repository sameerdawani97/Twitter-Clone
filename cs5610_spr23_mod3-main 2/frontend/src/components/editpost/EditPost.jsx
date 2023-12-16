import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CancelOutlined, DoneOutline } from "@mui/icons-material";
import { AppContext } from '../../App';
import './EditPost.css'

function EditPost({postId, onCancel}) {
    const [tweetInput, setTweetInput] = useState("");
    const {setErrMsg, postDB, setPostDB} = useContext(AppContext);

    useEffect(()=> {
      async function getPostDetails() {
        const postResponse = await axios.get('/api/posts/find/'+postId);
        setTweetInput(postResponse?.data.content)
      }
      getPostDetails()
    },[]);

    const saveChanges = async () => {
      if(tweetInput.trim() === "") return;
      try{
        const postResponse = await axios.post('/api/posts/edit/'+postId, {content: tweetInput});
        
        if(postResponse.data.acknowledged) {
          const modifiedPostResponse = await axios.get('/api/posts/find/'+postId);
        
          const updatedPosts = postDB.posts.map((post) => {
            if(post._id === postId) {
              return modifiedPostResponse.data;
            }
            return post;
          });
          
          const descSortedPosts = updatedPosts.sort((a, b) => {
            const timestampA = Date.parse(a.timestamp);
            const timestampB = Date.parse(b.timestamp);
            return timestampB - timestampA;
          })
          setPostDB({posts: descSortedPosts});
          onCancel();
        }

      }
      catch(err) {
        if (!err?.response) {
          setErrMsg('Unable to save changes in post');
        }
        else if(err?.response.status === 409) {
            setErrMsg('Something went wrong will saving post!');
        }
        else {
            setErrMsg('Saving post changes failed!')
        }
      }
    } 

    return (
        <div className='edit-post'>
          <form className="edit-post-form">
                <div className="edit-post-form-field">   
                    <div className="edit-post-form-input">
                        <input 
                        type="text" 
                        placeholder="enter the post content..." 
                        name="tweetInputHolder"
                        value={tweetInput}
                        onChange={(e) => setTweetInput(e.target.value)}/>
                    </div>
                    
                    <div className="edit-post-form-btn">
                        <DoneOutline className="save-changes-icon edit-profile-icon-btn" onClick={saveChanges}/> 
                        <CancelOutlined className="edit-profile-icon-btn" onClick={onCancel}/>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditPost;