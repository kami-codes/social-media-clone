import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Post from "./Post";
import "./styles/profile.css";
import { LayoutContext } from "../context/LayoutContext";
import LogoutIcon from '@mui/icons-material/Logout';

const Profile = () => {
  const { user, currentUser } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);

const {setFollowersOpen,setFollowingOpen} = useContext(LayoutContext)

  const handleLogOut = () => {
    signOut(auth);
  };

  const postRef = collection(db, "Posts");

  const fetchUsersPosts = async () => {
    const q = query(postRef, where("PostBy", "==", `${user.uid}`));
    const data = await getDocs(q);
    let newArr = [];
    data.forEach((docs) => {
      newArr.push({...docs.data(), id:docs.id});
    });
    setUserPosts(newArr);
   
  };

  const handleFollowersClick = () => {
    setFollowersOpen(true);
  };

  const handleFollowingClick = () => {
    setFollowingOpen(true);
  };

  useEffect(() => {
    if(currentUser !== null){
      fetchUsersPosts();
    }
  }, [currentUser]);

  return (
    <>
    
    
    <div className="profile-container">
      <button onClick={handleLogOut} className="logout-button"> <LogoutIcon /> <p>Log-out</p> </button>
      <div className="profile-info">
        <img className="profile-image" src={user.photoURL} />
        <h1 className="profile-username">{user.displayName}</h1>
        <div className="followers-info">
          <div className="followers" onClick={handleFollowersClick}>
            <p className="followers-bold"> {currentUser?.followers.length} </p>
            <p>Followers</p>
          </div>
          <div className="following" onClick={handleFollowingClick}>
            <p className="followers-bold"> {currentUser?.following.length} </p>
            <p className="following-para">Following</p>
          </div>
        </div>
      </div>

{userPosts.length === 0 && <div className="empty-post-alert"> Add your first post by clicking on the "+" icon. </div>}

      {userPosts.map((element, id) => {
        return (
          <Post
            photo={element.Postphoto}
            key={id}
            caption={element.PostCaption}
            postBy={element.PostBy}
            likes={element.Likes}
            postId={element.id}
            time={element.time}
          />
        );
      })}
    </div>
  </>
  );
};

export default Profile;
