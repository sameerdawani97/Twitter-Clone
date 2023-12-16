import React, { useContext, useState } from "react"
import { MoreHoriz } from "@mui/icons-material";
import { AppContext } from "../../../../App";
import { useNavigate } from "react-router";
import Dropdown from 'react-bootstrap/Dropdown';
import EditPost from "../../../editpost/EditPost";
import './Post.css'

// post component is used for each post status showing username, text content, and posted on time
function Post({id, username, content, timestamp, onDeletePost}) {
    
    const { activeUsername } = useContext(AppContext);
    const navigate = useNavigate();
    const [showEditPost, setShowEditPost] = useState(false);
    
    function handleUserProfile() {
        navigate('/profile/'+username);
    }

    const handleEditPost = () => {
        setShowEditPost(true);
    }

    const hideEditPost = () => {
        setShowEditPost(false);
    }
    return (
    <div className="post-outer-container" key={id}>
        {
        showEditPost ? 
        <EditPost postId={id} onCancel={hideEditPost}/> : 
            
        <div className="post-content-container" key={id}>
            <div className="post-header">
                <div className="post-title" onClick={handleUserProfile}>
                    <h5 className="post-owner-name">@{username}</h5>
                </div>
                {activeUsername === username && 
                    <Dropdown autoClose="inside">
                    <Dropdown.Toggle className="more-toggle-btn" id="dropdown-basic">
                        <MoreHoriz className="post-more-options"/>
                    </Dropdown.Toggle>
            
                    <Dropdown.Menu>
                    <Dropdown.Item as="button" onClick={handleEditPost}>
                        Edit post
                    </Dropdown.Item>
                    <Dropdown.Item as="button" onClick={async () => {
                       await onDeletePost(id)
                    }}>
                        Delete
                    </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                }
            </div>
            <div className="post-caption" onClick={handleUserProfile}>
                {content}
            </div>
            <span className="post-time">Posted on: {timestamp}</span>
        </div>
        }
    </div>
    );
}

export default Post;