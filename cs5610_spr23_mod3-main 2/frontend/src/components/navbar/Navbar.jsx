import React, { useContext, useEffect } from "react";
import axios from "axios";
import Nav  from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import { Container, NavDropdown, Button } from "react-bootstrap";
import { AppContext } from "../../App";
import './Navbar.css';
import { useNavigate } from "react-router";

function NavigationBar() {
    const { activeUsername, setActiveUsername, success, setSuccess} = useContext(AppContext)
    const navigate = useNavigate();
    useEffect(() => {
        async function checkIfUserIsLoggedIn() {
            const response = await axios.get('/api/users/isLoggedIn')
            setActiveUsername(response.data.username);
        }
        checkIfUserIsLoggedIn()
    }, [success, activeUsername]);

    async function handleLogout() {
        await axios.post('/api/users/logOut')
        setActiveUsername(null)
        setSuccess(false);
        navigate('/');
    }

    return (
        <Navbar collapseOnSelect fixed="top" expand="lg" className="app-navbar">
        <Container>
            <Navbar.Brand as={Link} to={"/"}>
                 Home
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav>
                    { 
                    activeUsername == null ? 
                    <>
                    <Nav.Link as={Link} to={"/login"}>
                        <button className="navbar-btn primary-btn">Login</button>
                    </Nav.Link>
                    <Nav.Link as={Link} to={"/register"}>
                        <button className="navbar-btn secondary-btn">Sign up</button>
                    </Nav.Link></> 
                    : 
                    <NavDropdown title={activeUsername} id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to={"/profile/"+activeUsername}>My profile</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item>
                            <Button variant="outline-danger" onClick={handleLogout}>Log out</Button>
                        </NavDropdown.Item>
                    </NavDropdown>
                    }
                    
                </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default NavigationBar;