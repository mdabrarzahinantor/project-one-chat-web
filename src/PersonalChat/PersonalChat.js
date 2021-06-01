import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import db from "../Firebase/Firebase";
import "./PersonalChat.css";
function PersonalChat({ header, url, id, uid }) {
  return (
    <Link to={`/personal/${uid}`}>
      <div className="personal-chat-profile">
        <div
          style={{
            backgroundImage: `url(${url})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className="personal-chat-profile-pic"
        ></div>
        <div className="personal-chat-profile-container">
          <div className="personal-chat-profile-container-header">{header}</div>
        </div>
      </div>{" "}
    </Link>
  );
}

export default PersonalChat;
