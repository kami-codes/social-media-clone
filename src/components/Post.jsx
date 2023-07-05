import React, { useEffect, useState } from "react";
import "./styles/post.css";
import LargePost from "./LargePost";
import SmallPost from "./SmallPost";

function Post(props) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 700);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isSmallScreen ? (
        <SmallPost
          photo={props.photo}
          caption={props.caption}
          postBy={props.postBy}
          likes={props.likes}
          postId={props.postId}
          time={props.time}
        />
      ) : (
        <LargePost
          photo={props.photo}
          caption={props.caption}
          postBy={props.postBy}
          likes={props.likes}
          postId={props.postId}
          time={props.time}
        />
      )}
    </>
  );
}

export default Post;
