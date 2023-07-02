import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import { AuthContextProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Messagses from "./components/Messagses";
import React from "react";
import Explore from "./components/Explore";
import Profile from "./components/Profile";
import UserProfile from "./components/UserProfile";
import UserMessage from "./components/UserMessage";
import './App.css'

import { LayoutContextProvider } from "./context/LayoutContext";
import Modal from "./components/Modal";


const Layout = ({ children }) => {
  return (
    <div style={{width: "100vw", height: "100vh"}}>
      <Navbar />
      <div className="outlet-container" style={{width: "100vw"}}>
        {/* <AddPost /> */}
        <Modal />
      <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthContextProvider>
        <LayoutContextProvider>

        
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index path="" element={<Home />} />
                <Route path="messages" element={<Messagses />} />
                <Route path="explore" element={<Explore />} />
                <Route path="profile" element={<Profile />} />
                <Route path="user/profile/:id" element={<UserProfile />} />
                <Route path="messages/:id" element={<UserMessage />} />
                
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
            </LayoutContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
