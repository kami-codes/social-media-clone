import React, { useContext, useEffect, useState } from "react";
import AddPost from "./AddPost";
import { LayoutContext } from "../context/LayoutContext";
import { AuthContext } from "../context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import "./styles/modal.css"
import ClearIcon from '@mui/icons-material/Clear';

const Modal = () => {
  const {
    addPostOpen,
    followersOpen,
    setFollowersOpen,
    followingOpen,
    setFollowingOpen,
  } = useContext(LayoutContext);

  const [followersProfile, setFollowersProfile] = useState([])
  const [followingProfile, setFollowingProfile] = useState([])


  const {currentUser} = useContext(AuthContext)

  const fetchFollowersInfo = async()=>{
    const q = query(collection(db, "userDetails"), where("userId", "in", currentUser.followers))
    const data =await getDocs(q)
    let newArr = []
    data.forEach((docs)=>{
        newArr.push(docs.data())
    })
    setFollowersProfile(newArr)
  }
  const fetchFollowingInfo = async()=>{
    const q = query(collection(db, "userDetails"), where("userId", "in", currentUser.following))
    const data =await getDocs(q)
    let newArr = []
    data.forEach((docs)=>{
        newArr.push(docs.data())
    })
    setFollowingProfile(newArr)
  }

  useEffect(()=>{
    if(currentUser !== null && currentUser.followers.length !== 0){
        fetchFollowersInfo()
    }
    if(currentUser !== null && currentUser.following.length !== 0){
        fetchFollowingInfo()
    }
  }, [currentUser])

  return (
    <>
      {addPostOpen && <AddPost />}
      {followersOpen && <div className="followers-container">
        <div className="followers-window"> 
        <button onClick={()=>{setFollowersOpen(false)}} className="window-close"> <ClearIcon /> </button>
        <p>Followers</p>
        {followersProfile.length === 0 ? <div className="followers-empty"> Looks like nobody is following you. </div> : <div className="following-users-container"> {followersProfile.map((e)=>{
            return (
                <div className="following-profile" key={e.userId}>
                    <img src={e.profilePic} alt="" />
                    <p>{e.displayName}</p>
                </div>
            )
        })}  </div>}
          </div>
         </div>}
      {followingOpen && <div className="followers-container">
        <div className="followers-window"> 
        <button onClick={()=>{setFollowingOpen(false)}} className="window-close"> <ClearIcon /> </button>
        <p>Following</p>
        {followingProfile.length === 0 ? <div className="followers-empty"> Looks like nobody is following you. </div> : <div className="following-users-container"> {followingProfile.map((e)=>{
            return (
                <div className="following-profile" key={e.userId}>
                    <img src={e.profilePic} alt="" />
                    <p>{e.displayName}</p>
                </div>
            )
        })}  </div>}
          </div>
         </div>}
      
    </>
  );
};

export default Modal;
