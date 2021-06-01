import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import db from "../../Firebase/Firebase";
import { useStateValue } from "../../Global/StateProvider";
import "./SidebarProfiles.css";

const SidebarProfile = ({ id, url, name, style }) => {
  const [messages, setMessages] = useState([]);
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();

  const handleDelete = (id) => {
    db.collection("rooms")
      .doc(id)
      .delete()
      .then(() => {
        history.push("/");
      })
      .catch((error) => alert(error?.message));
  };

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [id]);

  return (
    <Link to={`/rooms/${id}`}>
      <div className="sidebar-profile">
        <div
          style={{
            background: `url(${url})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className="sidebar-profile-pic"
        ></div>
        <div className="sidebar-profile-container">
          <div className="sidebar-profile-container-header">{name}</div>
          {id === "7FE1ZkPJHcQsByXSY51n" ? (
            ""
          ) : (
            <div style={{ display: "flex" }}>
              {messages[0]?.name === user.displayName
                ? "You"
                : messages[0]?.name}
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
                className="sidebar-profile-container-msg"
              >
                {}
              </div>
            </div>
          )}
          <div
            style={{ display: style.display }}
            onClick={() => handleDelete(id)}
            className="more"
          >
            <i class="fas fa-trash    "></i>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SidebarProfile;
