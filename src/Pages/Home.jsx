import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import {  db } from "../config/firebase";

import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import Post from "../components/Post";
import "./styles/Home.css"

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false)

  const postRef = collection(db, "Posts");

  const fetchPosts = async () => {
    if (currentUser !== null && currentUser?.following) {
      let followingArr = [...currentUser.following, `${currentUser.userId}`];
      const q = query(
        postRef,
        where("PostBy", "in", followingArr),
        orderBy("time", "desc")
      );
      const data = await onSnapshot(q, (snapshot)=>{
        setLoading(true)
        let newArr = []
        snapshot.forEach((docs) => {
          let postObj = { ...docs.data(), id: docs.id };
          newArr.push(postObj);
        });
        setPosts(newArr);
        setLoading(false)
      });

    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser]);



  return (
    <div className="home-container">
      {loading &&  <span class="loader"></span>}
     
     {posts.length === 0 && <div className="empty-post-alert"> Looks like you are not following anyone. Follow someone to see their posts in this tab. </div>}

      {posts?.map((element, id) => {
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
  );
};

export default Home;
