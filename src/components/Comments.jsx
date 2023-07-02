import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { db } from "../config/firebase";
import "./styles/comments.css";

function Comments(props) {
  const [commenetUser, setCommentUser] = useState([]);
  const userDetailsRef = collection(db, "userDetails");

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

  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <div className="comment-container">
      <div className="comment-profile">
        <div className="profile-info">
          <img
            src={commenetUser?.profilePic}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <p className="profile-username-comment">{commenetUser?.displayName}</p>
        </div>
        <p className="comment-date"> {commentDate} </p>
      </div>
      <div className="comment-text">{props.desc}</div>
    </div>
  );
}

export default Comments;
