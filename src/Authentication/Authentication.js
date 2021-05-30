import React from "react";
import { Link } from "react-router-dom";

function Authentication() {
  return (
    <div className="auth">
      <Link to="/signin">
        <div className="auth-signin-btn">Sign In</div>
      </Link>
      <Link to="/signup">
        <div className="auth-signup-btn">Sign Up</div>
      </Link>
    </div>
  );
}

export default Authentication;
