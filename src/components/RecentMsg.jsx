import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import "./styles/recentMessage.css"

function RecentMsg({ recentMsg, otherPerson }) {
  const userDetailsRef = collection(db, "userDetails");

  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    const q = query(userDetailsRef, where("userId", "==", `${otherPerson}`));
    const data = await getDocs(q);
    let newArr = [];
    data.forEach((docs) => {
      newArr.push(docs.data());
    });
    setProfile(newArr[0]);
  };
  const handleRecentMessageClick = () => {
    navigate(`/messages/${otherPerson}`);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div
      onClick={handleRecentMessageClick}
      className="recent-message-container"
    >
      <img className="recent-message-image" src={profile.profilePic} />
      <div className="recent-message-info">
        <p className="recent-message-username"> {profile.displayName} </p>
        <p className="recent-message-chat">{recentMsg}</p>
      </div>
    </div>
  );
}

export default RecentMsg;
