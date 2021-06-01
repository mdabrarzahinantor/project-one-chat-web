import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import db from "../Firebase/Firebase";
import { useStateValue } from "../Global/StateProvider";
import "./PersonalChat.css";
function PersonalChat({ header, url, id, uid }) {
  const [messages, setMessages] = useState([]);
  const { chatID } = useParams();
  const [{ user }, dispatch] = useStateValue();
  useEffect(() => {
    const str = [id, user.uid];
    const ID = str.sort().join("");
    if (id) {
      db.collection("personal-collections")
        .doc(ID)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
    console.log(messages);
  }, [id]);

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
          <div style={{ display: "flex" }}>
            {messages[0]?.name === user.displayName ? "You" : messages[0]?.name}
            -
            <div
              style={{ display: "flex" }}
              dangerouslySetInnerHTML={{
                __html: messages
                  ? messages[0]?.message.length > 16
                    ? messages[0]?.message?.substr(0, 17) + "..."
                    : messages[0]?.message
                  : "",
              }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PersonalChat;
