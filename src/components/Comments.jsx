import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

import { db } from "../config/firebase";
import "./styles/comments.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Comments(props) {

  const {currentUser} = useContext(AuthContext)

  const [commenetUser, setCommentUser] = useState([]);
  const userDetailsRef = collection(db, "userDetails");

const navigate = useNavigate()

  const [commentDate, setCommentDate] = useState(
    props.time?.toDate().toDateString()
  );

  const fetchUserDetails = async () => {
    const q = query(
      userDetailsRef,
      where("userId", "==", `${props.commentUser}`)
    );
    const data = await getDocs(q);
    let newArr = [];
    data.forEach((docs) => {
      newArr.push(docs.data());
    });
    setCommentUser(newArr[0]);
  };

  const handleCommentProfileClick =()=>{
    if(props.commenetUser === currentUser.userId ){
      navigate('/profile')
    }else{
      navigate(`/user/profile/${props.commentUser}`)
    }

  }

  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <div className="comment-container">
      <div className="comment-profile">
        <div className="profile-info">
          <img
          onClick={handleCommentProfileClick}
            src={commenetUser?.profilePic}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
            <div className="comment-text">{props.desc}</div>
        </div>
      </div>
      
    </div>
  );
}

export default Comments;
