import React, { useEffect, useState } from "react";
import { collection,  getDocs, query, orderBy } from "firebase/firestore";
import {  db } from "../config/firebase";
import Post from "./Post";
import Search from "./Search";
import "./styles/explore.css"

const Explore = () => {
  const [allPosts, setAllPosts] = useState([]);

  const postRef = collection(db, "Posts");

  const fetchPosts = async () => {
    const q = query(postRef, orderBy("time", "desc"));
    const data = await getDocs(q);
    let newArr = [];
    data.forEach((docs) => {
      let postObj = {...docs.data(), id: docs.id}
      newArr.push(postObj);
    });
    setAllPosts(newArr);
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div className="explore-container">
      <Search type={'user/profile'}/>
      {allPosts.map((element) => {
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
};

export default Explore;
