import React, { useContext, useEffect, useState } from "react";
import { auth, db, storage } from "../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "./styles/register.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const Register = () => {
  const navigate = useNavigate();

  const { setUser, userNames, setUserName } = useContext(AuthContext);

  const [userNameError, setUserNameError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false)

  const userRef = collection(db, "userDetails");
  const userNameRef = collection(db, "userNames");

  const onSubmit = (data) => {
    handleRegister(data);
  };

  const schema = yup.object().shape({
    displayName: yup
      .string()
      .required("user-name is required")
      .min(3, "user-name at least 3 characters"),
    email: yup.string().email("invalid email").required("email is required"),
    password: yup
      .string()
      .min(4, "password must be at least 4 characters long")
      .max(20)
      .required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const fetchUserNames = async () => {
    const data = await getDocs(userNameRef);
    let newArr = [];
    data.forEach((doc) => {
      const a = doc.data();
      newArr.push(a.displayName);
    });
    setUserName(newArr);
  };

  const checkusername = (name) => {
    setUserNameError(userNames.includes(name));

  };

  const checkImgError = () => {
    if (selectedImage === null) {
      setImageError("please add a profile pic");
    }
  };

  const handleRegister = async (data1) => {
    checkusername(data1.displayName);
    checkImgError();
 
    if (
      userNames.includes(data1.displayName) === false &&
      selectedImage !== null
    ) {
      try {
        setLoading(true)
        const storageRef = ref(storage, uuidv4());
        const uploadTask = uploadBytesResumable(storageRef, profileImage);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
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
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
           
                setProfileImageUrl(downloadURL);
                try {
                  const data = await createUserWithEmailAndPassword(
                    auth,
                    data1.email,
                    data1.password
                  );
                  setUser(auth.currentUser);
                  const details = await updateProfile(auth.currentUser, {
                    displayName: data1.displayName,
                    photoURL: downloadURL,
                  });
                  
                  navigate("/");
                  await addDoc(userRef, {
                    displayName: auth.currentUser.displayName,
                    email: auth.currentUser.email,
                    userId: auth.currentUser.uid,
                    profilePic: downloadURL,
                    followers: [],
                    following: [],
                  });
                  await addDoc(userNameRef, {
                    displayName: auth.currentUser.displayName,
                    userId: auth.currentUser.uid,
                  });
                  setLoading(false)
                } catch (error) {
                setLoading(false)
                  setErrMsg(error.message);
                }
              }
            );
          }
        );
      } catch (error) {setLoading(false)}
    }
  };

  useEffect(() => {
    fetchUserNames();
    if (auth.currentUser) {
      navigate("/");
    }
  }, []);

  return (
    <div className="register-container">
      <div className="registerWindow">
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="left">
            {selectedImage === null ? (
              <div className="profilePhoto">
                <label htmlFor="profileImage">
                  <AccountCircleIcon
                    style={{ fontSize: "5rem", margin: "auto" }}
                    className="add-profile-photo"
                  />
                  <p> add profile photo</p>
                </label>
                <input
                  onChange={handleImageChange}
                  type="file"
                  id="profileImage"
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <div className="profilePhoto">
                <img
                  src={selectedImage}
                  alt=""
                  style={{
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <button
                  className="cancel-image"
                  onClick={() => {
                    setSelectedImage(null);
                  }}
                >
                  X
                </button>
              </div>
            )}
          </div>
          <div className="right">
            <h1 className="register-indicator">Register</h1>
            <input
              placeholder="user-name"
              type="text"
              className="form-control"
              id="text"
              {...register("displayName")}
            />

            <input
              placeholder="email address"
              type="email"
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              {...register("email")}
            />

            <input
              placeholder="password"
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              {...register("password")}
            />

            
            {loading ? <span class="loader"></span> : <button type="submit" className="register-button">Register</button>}
            
          </div>
        </form>

        <div className="register-errors">
          {errors.email && <p>{errors.email?.message} </p>}
          {errors.password && <p>{errors.password?.message} </p>}
          {errors.displayName && <p>{errors.displayName?.message} </p>}
          {userNameError && (
            <p className="text-danger">
              username already exists please try anoter one
            </p>
          )}
          {imageError && (
            <p className="text-danger">upload a profile image to register</p>
          )}
          {errMsg !== "" && (
            <p className="text-danger">
              Invalid Email or Account with this email already exists. Please
              try another email
            </p>
          )}
        </div>

        <p className="login-direct">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
