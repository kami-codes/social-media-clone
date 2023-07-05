import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./styles/navbar.css";
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ExploreIcon from "@mui/icons-material/Explore";

import { auth } from "../config/firebase";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { LayoutContext } from "../context/LayoutContext";

const Navbar = () => {

  const location = useLocation()

  const [profilePhotoUrl, setProfilePhotoUrl] = useState("")
  const {addPostOpen, setAddPostOpen} = useContext(LayoutContext)
  

  const handleAddClick =()=>{
    setAddPostOpen(!addPostOpen)
  }

  useEffect(()=>{
    if(auth.currentUser !== null){
      setProfilePhotoUrl(auth.currentUser.photoURL)
    }
  }, [auth.currentUser])

  return (
    <div className="navbar-container">
      <Link to="/">
        {location.pathname === "/" ? <HomeIcon  style={{fontSize: '30px'}}/> : <HomeOutlinedIcon style={{fontSize: '30px'}}  /> }  
        <p className="navbar-icon-text">Home</p>
      </Link>
      <Link to="/explore">
         
      {location.pathname === "/explore" ? <ExploreIcon  style={{fontSize: '30px'}}/> : <ExploreOutlinedIcon style={{fontSize: '30px'}}  /> } 
      <p className="navbar-icon-text">Explore</p>
      </Link>
       <Link>
        <AddBoxOutlinedIcon onClick={handleAddClick} style={{fontSize: '30px'}}/> 
        <p className="navbar-icon-text">Add post</p>
       </Link>
      
      <Link to="/messages">
         
      {location.pathname.includes("/messages") ? <ChatBubbleIcon  style={{fontSize: '30px'}}/> : <ChatBubbleOutlineOutlinedIcon style={{fontSize: '30px'}}  /> } 
      <p className="navbar-icon-text">Messages</p>
      </Link>
      <Link to="/profile">
         
         {auth.currentUser !== null ? <img
          className={`navbar-profile-photo ${location.pathname === "/profile" ? "outline-profile" : ""}`}
          src={profilePhotoUrl}
          alt=""
        /> : <AccountCircleIcon style={{fontSize: "30px"}} /> }
        <p className="navbar-icon-text">Profile</p>
      </Link>
    </div>
  );
};

export default Navbar;
