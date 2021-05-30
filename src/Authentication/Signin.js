import React, { useState } from "react";
import { auth } from "../Firebase/Firebase";
import { actionTypes } from "../Global/Reducer";
import { useStateValue } from "../Global/StateProvider";
import "./Authentication.css";
function SignIn() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [{}, dispatch] = useStateValue(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    auth
      .signInWithEmailAndPassword(email, pass)
      .then((result) => {
        dispatch({ type: actionTypes.SET_USER, user: result.user });
        setLoading(false);
        setPass("");
        setEmail("");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="sign-up">
      {loading ? (
        <div className="mysignin-loader">
          <i className="fas fa-circle-notch    "></i>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="sign-up-email"
            required="true"
          ></input>
          <input
            onChange={(e) => setPass(e.target.value)}
            required="true"
            placeholder="Password"
            type="password"
            className="sign-up-password"
          ></input>
          <button className="sign-up-button">Sign In</button>
        </form>
      )}
    </div>
  );
}

export default SignIn;
