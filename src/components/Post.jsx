import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";
import Comments from "./Comments";
import "./styles/post.css"
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";

function Post(props) {
  const { currentUser } = useContext(AuthContext);
  const [postByUser, setPostByUser] = useState({});
  const [isLiked, setIsLiked] = useState(
    props.likes.includes(`${currentUser?.userId}`)
  );

  const [captionCollapse, setCaptionCollapse] = useState(true)
  const [commentCollapse, setCommentCollapse] = useState(true)

  const [postTime, setPostTime] = useState(props.time?.toDate()?.toDateString())
  const [likes, setLikes] = useState(props.likes);
  const [commentsonPost, setComments] = useState([]);

  const [commentDesc, setCommentDesc] = useState("");

  const userDetailsRef = collection(db, "userDetails");

  const fetchUserDetails = async () => {
    const q = query(userDetailsRef, where("userId", "==", `${props.postBy}`));
    const data = await getDocs(q);
    let newArr = [];
    data.forEach((docs) => {
      newArr.push(docs.data());
    });
    setPostByUser(newArr[0]);
  };

  const navigate = useNavigate()

  const handleLike = async () => {
    console.log("handle like is called")
    const postRef = doc(db, "Posts", `${props.postId}`);
    console.log(props.postId)
    if (isLiked) {
      setIsLiked(false);
      let postLikes = likes.filter((e) => {
        return e !== currentUser.userId;
      });
      setLikes(postLikes);
      await updateDoc(postRef, {
        Likes: postLikes,
      });
    } else {
      setIsLiked(true);
    
      setLikes([...likes, `${currentUser.userId}`]);
      let postLikes = likes;
      postLikes.push(`${currentUser.userId}`);
      await updateDoc(postRef, {
        Likes: postLikes,
      });
    }
  };

  const commentRef = collection(db, "Comments");

  const fetchingComments = async () => {
    const q = query(commentRef, where("postId", "==", `${props.postId}`));
    const data = await getDocs(q);
    let newArr = [];
    data.forEach((docs) => {
      newArr.push(docs.data());
    });
    setComments(newArr);
  };

const handleNavigate =()=>{
  if(props.postBy === currentUser.userId){
    navigate('/profile')
  }else{
    navigate(`/user/profile/${props.postBy}`)
  }
}

  const handleComment = async () => {
    const data = addDoc(commentRef, {
      postId: props.postId,
      userId: currentUser.userId,
      description: commentDesc,
      time: serverTimestamp(),
    });
    fetchingComments();
    setCommentDesc("");
  };

  useEffect(() => {
    if(currentUser !== null){
      fetchingComments();
      fetchUserDetails();
    }
  }, []);

  return (
    <div className="post-container">
      <div className="post-profile-container">
      <div className="post-profile">
        <img
          src={postByUser.profilePic}
          alt=""
        />{" "}
        <p onClick={handleNavigate}>{postByUser.displayName}</p>
      </div>
    <p className="post-time"> {postTime} </p>
      </div>
      <img className="post-photo" src={props.photo} alt="" width={200} />
      <div className="post-details">

   
      <div className="engagement-buttons">
      <button className="post-like-button" onClick={handleLike}>{isLiked ? <FavoriteOutlinedIcon style={{fontSize: "1.5rem"}} /> : <FavoriteBorderOutlinedIcon style={{fontSize: "1.5rem"}} /> }</button>
      <button disabled={commentsonPost.length === 0} onClick={()=>{setCommentCollapse(!commentCollapse)}} className="post-like-button"> <CommentIcon style={{fontSize: "1.5rem"}}  /> </button> 
      </div>
      <p className="post-likes" > {likes.length} likes </p>
      {captionCollapse ?  <p className="post-caption"> {props.caption.slice(0,50)} </p> : <p> {props.caption} </p> }
      {
        props.caption.length > 50 && 
      <p className="post-caption-control" onClick={()=>{setCaptionCollapse(!captionCollapse)}}> {captionCollapse ? "view more" : "view less"} </p>
      }

</div>
     <div className="post-comment">
       <input
       placeholder="add comment"
        type="text"
        value={commentDesc}
        onChange={(e) => {
          setCommentDesc(e.target.value);
        }}
      />
      <button className="comment-send-button" disabled={commentDesc.length <= 3} onClick={handleComment}> <SendIcon /> </button>
     </div>

{commentCollapse === true && commentsonPost.length !== 0 && <Comments  commentUser={commentsonPost[0].userId} time={commentsonPost[0].time} desc={commentsonPost[0].description} />}

{commentCollapse === false && 
     commentsonPost?.map((e, id)=>{
      return (
        <Comments key={id}  commentUser={e.userId} time={e.time} desc={e.description} />
        )
      })}  

      


       
   
          {commentsonPost?.length > 1 && <p onClick={()=>{setCommentCollapse(!commentCollapse)}}> {commentCollapse ? "show all comments" : "show fewer comments"} </p>}
    </div>
  );
}

export default Post;
