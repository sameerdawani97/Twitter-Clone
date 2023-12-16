import axios from 'axios';
import React, { useState, useMemo, createContext, useEffect } from 'react';
import Timeline from './components/timeline/Timeline';
import Register from './components/register/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './components/login/Login';
import UserProfile from './components/userprofile/UserProfile';
import NavigationBar from './components/navbar/Navbar';
export const AppContext = createContext();

function App() {
  const [username, setUsername] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [password, setPassword] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeUsername, setActiveUsername] = useState(null)
  const [postDB, setPostDB] = useState({posts: []})

  useEffect(() => {
    async function getAllPosts() {
      let allPosts = [];
      const response = await axios.get('/api/posts');
      
      allPosts = response?.data;
      const descSortedPosts = allPosts.sort((a, b) => {
        const timestampA = Date.parse(a.timestamp);
        const timestampB = Date.parse(b.timestamp);
        return timestampB - timestampA;
      })
      setPostDB({posts: descSortedPosts});
      
    }
    getAllPosts();
  }, []);

  const twitterAppProviderValue = useMemo(() => ({
    username, setUsername,
    validName, setValidName, 
    userFocus, setUserFocus,
    password, setPassword,
    validPwd, setValidPwd,
    pwdFocus, setPwdFocus,
    errMsg, setErrMsg,
    success, setSuccess,
    activeUsername, setActiveUsername,
    postDB, setPostDB,
  }));

  return (
    <div className='App'>
      <AppContext.Provider value={ twitterAppProviderValue }>
        
        <BrowserRouter>
          <Routes>
              <Route path="/" element={ <><NavigationBar /><Timeline /></>} />
              <Route path="/login" element={<><NavigationBar /><Login /></>} />
              <Route path="/register" element={<><NavigationBar /><Register /></>} />
              <Route path="/profile/:username" element={ <><NavigationBar /><UserProfile /></>} />
          </Routes>
      </BrowserRouter>
    </AppContext.Provider>
    </div>
  );
}

export default App
