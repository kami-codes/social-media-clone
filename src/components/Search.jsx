import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import "./styles/search.css"

const Search = (props) => {
  const [search, setSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  const userRef = collection(db, "userDetails");

  const navigate = useNavigate();

  const handleSearchSubmit = async (element) => {
    element.preventDefault();
    setLoading(true);

    const q = query(userRef, where("displayName", ">=", `${search}`));
    const data = await getDocs(q);
    let newArr = [];
    data.forEach((doc) => {
      newArr.push(doc.data());
    });
    setSearchedUsers(newArr);
    setLoading(false);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setLoading(true);
    setSearch("");
    setSearchedUsers([]);
  };

  const handleSearchedProfileClick = (a) => {
    if (user.uid !== a) {
      navigate(`/${props.type}/${a}`);
    } else {
      navigate(`/profile`);
    }
  };

  useEffect(()=>{
    return () =>{
      setLoading(true)
    }
  }, [])

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input className="searchInput"
        placeholder="search a user"
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button className="search-button" type="submit"> <SearchIcon /> </button>
        <button className="search-cancel-button" onClick={handleReset}> <ClearIcon /> </button>
      </form>
        {!loading && 
      <div className="searched-user-container">
         { searchedUsers.map((e, id) => {
            return (
              <div
              key={id}
                className="search-user-info"
                onClick={() => {
                  handleSearchedProfileClick(e.userId);
                }}
              >
                <img
                  src={e.profilePic}
                />
                <p> {e.displayName} </p>
              </div>
            );
          })}
      </div>
          }
    </div>
  );
};

export default Search;
