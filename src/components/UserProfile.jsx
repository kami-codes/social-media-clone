import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import Post from "./Post";
import { AuthContext } from "../context/AuthContext";
import "./styles/userProfile.css"

function UserProfile() {
  const { id } = useParams();
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const [userPosts, setUserPosts] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [followers, setFollowers] = useState([]);
  const [isFollow, setIsFollow] = useState(
    followers.includes(`${currentUser?.userId}`)
  );

  const postRef = collection(db, "Posts");
  const userRef = collection(db, "userDetails");

  const fetchUserDetails = async () => {
    const q = query(userRef, where("userId", "==", `${id}`));
    const data = await getDocs(q);
    let newArr = [];
    let followers = [];
    data.forEach((docs) => {
      setUserDetails({ ...docs.data(), id: docs.id });
      const a = docs.data().followers;
      setFollowers(a);
      const b = a.includes(`${currentUser.userId}`);
      setIsFollow(b);
    });
  };

  const fetchUsersPosts = async () => {
    const q = query(
      postRef,
      where("PostBy", "==", `${id}`),
      orderBy("time", "desc")
    );
    const data = await getDocs(q);
    let newArr = [];
    data.forEach((docs) => {
      newArr.push(docs.data());
    });
    setUserPosts(newArr);
  };

  const updatingFollowers = async () => {
    const documentRef = doc(db, "userDetails", userDetails.id);

    if (userDetails.followers.includes(`${currentUser.userId}`)) {
    } else {
      setIsFollow(true);
      const newArr = [...followers, `${currentUser.userId}`];
      setFollowers(newArr);
      const a = {...userDetails, followers: newArr}
      setUserDetails(a)
     const data = await updateDoc(documentRef, {
        followers: newArr,
      });

    }
  };

  const updatingFollowing = async () => {
    const documentRef = doc(db, "userDetails", currentUser.id);
    if (currentUser.following.includes(`${id}`)) {
    } else {
      const following1 = currentUser.following;
      const newArr = [...following1, id]
      const a = {...currentUser, following: newArr }
      setCurrentUser(a)
     const data = await updateDoc(documentRef, {
        following: newArr,
      });

    }
  };

  const followChecking = () => {
    if (followers.includes(`${currentUser.userId}`)) {
      setIsFollow(true);
    } else {
      setIsFollow(false);
    }
  };

  const handleUnfollow = async () => {
    if (currentUser.following.includes(`${id}`)) {
      const followingRef = doc(db, "userDetails", currentUser.id);
      const newArr = currentUser.following;
      const newArr1 = newArr.filter((e) => {
        return e !== id;
      });

      const a = {...currentUser, following: newArr1}
      setCurrentUser(a)
      const data = await updateDoc(followingRef, {
        following: newArr1,
      });

    }

    if (userDetails.followers.includes(`${currentUser.userId}`)) {
      const followerRef = doc(db, "userDetails", userDetails.id);
      const newFollower = followers.filter((e) => {
        return e !== currentUser.userId;
      });
      const a = {...userDetails, followers: newFollower}
      setUserDetails(a)
      const data1 = await updateDoc(followerRef, {
        followers: newFollower,
      });

      setIsFollow(false);
      setFollowers(newFollower);
    }

    
  };

  const handleFollow = () => {
    updatingFollowers();
    updatingFollowing();
  };

  useEffect(() => {
    if(currentUser !== null){
      fetchUserDetails();
      fetchUsersPosts();
      followChecking();
    }
  }, [currentUser]);

  return (
    <div className="userProfile-container">
      {userDetails && (
        <div className="userProfile-info">
          <img
          className="userProfile-Image"
            src={userDetails.profilePic}
      
          />
          <h1 className="userProfile-username"> {userDetails.displayName} </h1>
          <div className="userProfile-information">
            <div className="followers">
          <span>{followers.length}</span>
          <p>Followers</p>
            </div>
            <div className="followers">
          <span>{userDetails?.following?.length}</span>
          <p>Following</p>
            </div>
          </div>
          <div className="follow-buttons">
          {isFollow ? (
            <button className="to-follow-button unfollow" onClick={handleUnfollow}> unfollow</button>
          ) : (
            <button className="to-follow-button" onClick={handleFollow}>follow</button>
          )}
          <button className="to-message-button">message</button>
          </div>
        </div>
      )}

      {userPosts.map((element, id) => {
        return (
          <Post
            photo={element.Postphoto}
            key={element.id}
            caption={element.PostCaption}
            postBy={element.PostBy}
            likes={element.Likes}
            postId={element.id}
            time={element.time}
          />
        );
      })}
    </div>
  );
}

export default UserProfile;
