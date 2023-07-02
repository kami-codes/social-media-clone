import React, { useContext, useEffect, useState } from "react";
import { auth, db, storage } from "../config/firebase";

import {
  collection,
  addDoc,

  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import { LayoutContext } from "../context/LayoutContext";
import "./styles/addPost.css";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ClearIcon from '@mui/icons-material/Clear';

const AddPost = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false)
  const { addPostOpen, setAddPostOpen } = useContext(LayoutContext);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPostImage(file);

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  function autoExpand(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  const handleCancelAddPost =()=>{
    setAddPostOpen(false)
    setSelectedImage(null)
    setCaption("")
  }

  const postRef = collection(db, "Posts");

  const handleAddPost = () => {
    try {
      setLoading(true)
      const storageRef = ref(storage, uuidv4());
      const uploadTask = uploadBytesResumable(storageRef, postImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       
          switch (snapshot.state) {
            case "paused":
             
              break;
            case "running":
           
              break;
          }
        },
        (error) => {
       
          setLoading(false)
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
   

            const data = await addDoc(postRef, {
              Postphoto: downloadURL,
              PostBy: auth.currentUser.uid,
              PostCaption: caption,
              Likes: [],
              time: serverTimestamp(),
            });
            setLoading(false)
            setSelectedImage(null)
            setCaption("")
            setAddPostOpen(false)
          });
        }
      );
    } catch (error) {}
  };

  return (
    <>
      {addPostOpen && (
        <div className="add-post-container">
          <div className="add-post-window">
          <button className="cancel-add-post" onClick={handleCancelAddPost}> <ClearIcon style={{fontSize: "2rem"}} /> </button>
            <h1 className="add-post-heading">Add a Post</h1>
            <div className="add-post-body">
              <div className="add-post-left">
                <div>
                  {selectedImage === null ? (
                    <>
                      <label htmlFor="profileImage" className="add-post-photo-label">
                      <AddPhotoAlternateIcon style={{fontSize: '2rem'}} />
                        <p> add a photo </p>  </label>
                      <input
                        onChange={handleImageChange}
                        type="file"
                        id="profileImage"
                        style={{ display: "none" }}
                      />
                    </>
                  ) : (
                    <div className="add-post-photo">
                      <img src={selectedImage} alt="" style={{ width: "100%" }} />
                      <button className="add-post-photo-cancel"
                        onClick={() => {
                          setSelectedImage(null);
                        }}
                      >
                        <ClearIcon /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="add-post-right">
                <textarea
                  onInput={(e) => {
                    autoExpand(e.target);
                  }}
                  className="add-post-textarea"
                  type="text"
                  value={caption}
                  onChange={(e) => {
                    setCaption(e.target.value);
                  }}
                  placeholder="Write caption here"
                />
              {
                loading === false ?
                <button
                disabled ={selectedImage === null && caption === ""}
                  onClick={handleAddPost}
                  type="button"
                  className="add-post-button"
                >
                  Post
                </button> : <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

              }
              </div>
            </div>

            
          </div>
        </div>
      )}
    </>
  );
};

export default AddPost;
