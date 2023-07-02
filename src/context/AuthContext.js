import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [userNames, setUserName] = useState([]);
  const [currentUser, setCurrentUser] = useState(null)

  const userRef = collection(db, "userDetails")

  const fetchUserDetails = async () => {
    const q = query(userRef, where("displayName", "==", `${auth.currentUser.displayName}`));
    const data = await getDocs(q);
    const newArr = []
    data.forEach((docs) => {
      newArr.push({...docs.data(), id: docs.id});
    });
    setCurrentUser(newArr[0])
  };
  

  useEffect(() => {
 

    const unsub = onAuthStateChanged(auth, async(user) => {
      if (user) {
        fetchUserDetails()
         setUser(user);
        navigate("/");
      } else {
        navigate("/register");
      }
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, userNames, setUserName, currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
