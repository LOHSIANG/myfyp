import React, { useState } from "react";
import { database } from "../../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./RegisterAndLogin.css";
import "../../index.css"

function RegisterAndLogin() {
  const [login, setLogin] = useState(false);
  const history = useNavigate();

  const handleSubmit = (e, type) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (type === "signup") {
      createUserWithEmailAndPassword(database, email, password)
        .then((data) => {
          console.log(data, "authData");
          history("/home");
        })
        .catch((err) => {
          alert(err.code);
          setLogin(true);
        });
    } else {
      signInWithEmailAndPassword(database, email, password)
        .then((data) => {
          console.log(data, "authData");
          history("/home");
        })
        .catch((err) => {
          alert(err.code);
        });
    }
  }

  const handleReset = () => {
    history("/reset");
  }

  return (
    <div className="form-container">
      <div className="form-header-container">
        <div className="form-header">
          <div className={`form-tab ${login ? "active-tab" : ""}`} onClick={() => setLogin(true)}>
            SignIn
          </div>
        </div>
        <div className="form-header">
          <div className={`form-tab ${!login ? "active-tab" : ""}`} onClick={() => setLogin(false)}>
            SignUp
          </div>
        </div>
      </div>
      <h1 className="form-title">{login ? "Sign In" : "Sign Up"}</h1>
      <form onSubmit={(e) => handleSubmit(e, login ? "signin" : "signup")}>
        <input className="form-input" name="email" placeholder="Email" />
        <input className="form-input" name="password" type="password" placeholder="Password" />
        <p className="forgot-password" onClick={handleReset}>Forgot Password?</p>
        <button className="form-button">{login ? "Sign In" : "Sign Up"}</button>
      </form>
    </div>
  );
}

export default RegisterAndLogin;
