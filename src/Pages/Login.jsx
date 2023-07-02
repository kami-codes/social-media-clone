import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./styles/login.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const Login = () => {

  const { user, setUser } = useContext(AuthContext);
  const [errMsg, setErrMsg] = useState("");

  const [loading, setLoading] = useState(false)

  const schema = yup.object().shape({
    email: yup.string().email("invalid email").required("email is required"),
    password: yup
    .string()
    .required("password is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();

  const handleFormSubmit =(data)=>{

    handleLogin(data)
  }

  const handleLogin = async (detail) => {
    try {
      setLoading(true)
      const data = await signInWithEmailAndPassword(auth, detail.email, detail.password);
      setUser(auth.currentUser);
      setLoading(false)
   
    } catch (error) {
      setErrMsg(error.message);
      setLoading(false)
    }
  };
  useEffect(() => {
    if (auth.currentUser) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="login-container">
      <div className="login-window">
        <h1>Login </h1>
        <form onSubmit={(handleSubmit(handleFormSubmit))}  className="login-form">
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

         {loading ? <span class="loader"></span> :  <button type="submit"  className="login-button">
            Submit
          </button> }
        </form>

        
            <div className="login-errors">
            {errors.email && <p>{errors.email?.message}</p>}
            {errors.password && <p>{errors.email?.password}</p>}
        {errMsg !== "" &&
          (errMsg.includes("user-not-found") ? (
            <p className="text-danger">No user with this email</p>
            ) : (
              <p className="text-danger">email and password dont match</p>
              ))}
              </div>

              <p className="register-direct">
          Don't have an Account?
          <Link to={"/register"}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
