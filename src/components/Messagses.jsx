import React, { useContext, useEffect, useState } from "react";
import Search from "./Search";
import { collection,  getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";
import RecentMsg from "./RecentMsg";

import "./styles/messages.css"

const Messagses = () => {
  const { currentUser } = useContext(AuthContext);

  const [recentChats, setRecentChats] = useState([]);

  const recentMessageRef = collection(db, "RecentMessages")

  const fetchRecentChats = async()=>{
    const q = query(recentMessageRef, where("members", "array-contains", `${currentUser.userId}`))
    console.log(currentUser.userId)
    const data =await getDocs(q)
    let newArr = []
    data.forEach((docs)=>{
      const  msg = docs.data().recentMsg
      const members = docs.data().members
      const otherPerson = members.filter((e)=>{
        return e !== currentUser.userId
      })
      const otherpersonId = otherPerson[0]
      newArr.push({recentMsg: msg, otherPerson: otherpersonId})
    })
    setRecentChats(newArr)

  }

  useEffect(() => {
    const unsub = () => {
      if(currentUser !== null){
        fetchRecentChats();
      }
    };
    unsub();
  },[currentUser]);

  return (
    <div className="message-container">
      <Search type={"messages"} />

{recentChats.length === 0 && <div className="empty-message-alert"> Start messaging someone to see their recent message here! </div>}

   <div className="recent-messages">
{recentChats.map((element)=>{
return ( <RecentMsg key={element.otherPerson} recentMsg={element.recentMsg} otherPerson={element.otherPerson}  /> )
})}
   </div>
    </div>
  );
};

export default Messagses;
