import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

import "./styles/userMessage.css"
import SendIcon from '@mui/icons-material/Send';

function UserMessage() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const memberArr = [`${id}`, `${currentUser?.userId}`];
  const twistedMemberArr = [`${currentUser?.userId}`, `${id}`];

  const [messageText, setMessageText] = useState("");

  const [roomId, setRoomId] = useState(null);
  const [roomDocsId, setRoomDocsId] = useState("")

  const [messages, setMessages] = useState([]);

  const [userDetails, setUserDetails] = useState({})

  const rcntMsgRef = collection(db, "RecentMessages");
  const userRef = collection(db, "userDetails");


  const fetchUserDetails = async () => {
    const q = query(userRef, where("userId", "==", `${id}`));
    const data = await getDocs(q);
    let newArr = [];
    data.forEach((docs) => {
      setUserDetails(docs.data());
    });
  };

  const checkMessageRoom = async () => {
    const q = query(
      rcntMsgRef,
      where("members", "in", [memberArr, twistedMemberArr])
    );

    const data = await getDocs(q);

    if (data.empty === true) {
      makeRoomId();
    } else {
      data.forEach((docs) => {
        setRoomDocsId(docs.id)
        setRoomId(docs.data().RoomId);
      });

    }
  };

  const makeRoomId = async () => {
    const a = uuidv4();
    const data = await addDoc(rcntMsgRef, {
      members: [`${currentUser.userId}`, `${id}`],
      recentMsg: "",
      RoomId: a,
    });
    setRoomId(a);
    setRoomDocsId(data.id)
  };

  const handleMsgSend = async (e) => {
    e.preventDefault();
    const msgRef = collection(db, "Messages");
    const roomIdRef = doc(db, "RecentMessages", `${roomDocsId}`)
    
    const data1 = await updateDoc(roomIdRef, {
      recentMsg: messageText
    })
    
    const data = await addDoc(msgRef, {
      RoomId: roomId,
      text: messageText,
      msgBy: currentUser.userId,
      time: serverTimestamp(),
    });
    setMessageText("");
  };

  const ref = useRef(null)

  const autoScrool =(e)=>{
    e.scrollTop = e.scrollHeight;
  }

  useEffect(()=>{
    ref.current.scrollTop = ref.current.scrollHeight;
  
  }, [messages])

  useEffect(() => {

    const unsub = ()=>{
      if(currentUser !== null){
        checkMessageRoom()
        fetchUserDetails()
      }
    }

   unsub() ;
  }, [currentUser]);

  useEffect(() => {
    const roomRef = collection(db, "Messages");
    const q = query(
      roomRef,
      where("RoomId", "==", `${roomId}`),
      orderBy("time")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let newArr = [];
      snapshot.forEach((docs) => {
        newArr.push(docs.data());
      });
      setMessages(newArr);
    });
    return () => unsubscribe();
  }, [roomId]);




  return (
    <div className="user-message-container">
      <div className="user-messages" ref={ref} onLoad={(e)=>{autoScrool(e.target)}}>
        {messages.map((e, index) => {
          return (
            <div key={index} className={`user-message-unit ${e.msgBy !== id ? `personal` : `other-person`}` }>
             <div className= {`user-message-profille-info`}>
              <img className="user-message-profile" src={e.msgBy !== id ? `${currentUser.profilePic}` : `${userDetails.profilePic}`} style={{width: '30px', height: '30px', objectFit: 'cover', borderRadius: '50%'}} />
             </div>
              <p className="user-message-text"> {e.text} </p>
            </div>
          );
        })}
      </div>
      <form 
      className="user-message-form"
      onSubmit={handleMsgSend}>
        <input
        placeholder="type a message here..."
          type="text"
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
          }}
        />
        <button disabled={messageText.length === 0} className="user-message-send-button" type="submit"> <SendIcon /> </button>
      </form>
    </div>
  );
}

export default UserMessage;
