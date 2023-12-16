import axios from 'axios';
import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../../App';
import { Container } from 'react-bootstrap';
import './Login.css';

//Login component is used for user to login by providing username and password
function Login() {
    const errRef = useRef();
    const navigate = useNavigate();
    const {
        username, 
        setUsername, 
        password, 
        setPassword, 
        errMsg, 
        setErrMsg, 
        setSuccess,
    } = useContext(AppContext);

    useEffect(() => {
        setErrMsg('');
    }, [password, username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username.trim() == "" || password.trim() == "") {
            setErrMsg("Empty username or password!");
            return;
        }
        try {
            const response = await axios.post('/api/users/login', {username: username, password: password})
            setSuccess(true);
            setUsername('');
            setPassword('');
            navigate('/');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 403) {
                setErrMsg('Error: Invalid password!');
            } else if(err.response?.status === 401){
                setErrMsg('Error: username does not exists!');
            }else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <div className="custom-wrapper login-page">
            <Container>
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive"> {errMsg} </p>
                    <h1> Login </h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username"> Username</label>
                        <input 
                        type="text"
                        id="username"
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                   
                </section>
            </Container>
        </div>
    );
}

export default Login;