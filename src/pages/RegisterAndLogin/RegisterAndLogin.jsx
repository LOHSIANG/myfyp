import React, { useState } from "react";
import { database, db } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./RegisterAndLogin.css";
import "../../index.css";

function RegisterAndLogin({ onLogin }) {
  const [login, setLogin] = useState(false);
  const history = useNavigate();

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      if (type === "signup") {
        const userCredential = await createUserWithEmailAndPassword(database, email, password);
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);

        await setDoc(userDocRef, { role: "user" }, { merge: true });
        console.log("User role stored in Firestore");
        history("/home");
      } else {
        const userCredential = await signInWithEmailAndPassword(database, email, password);
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const userRole = docSnapshot.data().role;
          console.log("userRole:", userRole);

          if (userRole === "admin") {
            history("/home");
          } else {
            history("/cart");
          }
        onLogin({ role: userRole });
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert(error.code);
    }
  }

  const handleReset = () => {
    history("/reset");
  };

  return (
    <div className="form-container">
      <Icon className="logo-icon" icon="ion:home-sharp"/>
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
        <p className="forgot-password" onClick={handleReset}>
          Forgot Password?
        </p>
        <button className="form-button">{login ? "Sign In" : "Sign Up"}</button>
      </form>
    </div>
  );
}

export default RegisterAndLogin;
