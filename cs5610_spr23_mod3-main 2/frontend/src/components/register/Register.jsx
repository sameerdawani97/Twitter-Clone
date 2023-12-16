import { Container } from "react-bootstrap";
import axios from "axios";
import React, { useRef, useContext, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import { AppContext } from "../../App";
import './Register.css';


const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Register() {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();
    const {
        username, 
        setUsername, 
        validName, 
        setValidName, 
        userFocus, 
        setUserFocus, 
        password, 
        setPassword, 
        validPwd, 
        setValidPwd, 
        pwdFocus, 
        setPwdFocus, 
        errMsg, 
        setErrMsg, 
        success, 
        setSuccess
    } = useContext(AppContext);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(username);
        setValidName(result);
    },[username]);

    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPwd(result);
    },[password]);

    useEffect(() => {
        setErrMsg('');
    }, [password, username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post('/api/users/register', {username: username, password: password})
            setSuccess(true);
            
            setUsername('');
            setPassword('');
           
            navigate('/');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 401) {
                    setErrMsg('Error: username already exists!');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <div className="custom-wrapper register-page">
            <Container>
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive"> {errMsg} </p>
                    <h1> Create Account </h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username: 
                            <span className={validName ? "valid": "hide"}>
                                <FontAwesomeIcon icon={faCheck}/>
                            </span>
                            <span className={validName || !username ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes}/>
                            </span>
                        </label>
                        <input 
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="uidnote"
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && username && !validName ? "instructions": "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters. <br/>
                            Must begin with a letter <br/>
                            Letters, numbers, underscore, hyphen allowed only.
                        </p>

                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !password ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                        
                        
                        <button disabled={!validName || !validPwd ? true : false}>Sign In/Register</button>
                    </form>
                   
                </section>
            </Container>
        </div>
    );
}

export default Register;