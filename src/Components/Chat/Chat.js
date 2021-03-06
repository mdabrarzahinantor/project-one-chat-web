import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import db from "../../Firebase/Firebase";
import { useStateValue } from "../../Global/StateProvider";
import "./Chat.css";
import Linkify from "react-linkify";

function Chat({
  status,
  name,
  time,
  msg,
  url,
  id,
  reactHeart,
  uid,
  hasImage,
  imageUrl,
  hasChatID,
}) {
  const [react, setReact] = useState(reactHeart);
  const { roomId } = useParams();
  const [{ user }, dispatch] = useStateValue();
  const [replacedMsg, setReplacedMsg] = useState("");
  const [imageBool, setImageBool] = useState(hasImage ? "" : "none");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    var n = msg.search("script");
    console.log(n);

    if (n == 1) {
      setReplacedMsg(
        "<h1>!Dont Be Over Smart!</h1><br/><b>Using Script Is Prohibited</b>"
      );
    } else {
      setReplacedMsg(msg);
    }

    scrollToBottom();
  }, []);

  return (
    <div
      ref={messagesEndRef}
      className={`${uid === user.uid ? "receiver" : "sender"} chat`}
    >
      <div className="chat-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              background: `url(${url})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className="chat-header-pic"
          ></div>
          <div className="chat-header-name">{name}</div>
        </div>
        <div className="chat-header-time">
          {new Date(time?.toDate()).toUTCString() === "Invalid Date"
            ? " "
            : new Date(time?.toDate()).toUTCString()}
        </div>

        <div
          onClick={(e) => {
            if (uid === user.uid) {
              db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .doc(id)
                .update({
                  message: "<b>This message has been deleted.</b>",
                })
                .then(setReplacedMsg("<b>This message has been deleted.</b>"));
            }
          }}
          className={`chat-del ${user.uid === uid ? "" : "display-del"} ${
            hasChatID ? "display-del" : ""
          }`}
        >
          <i class="fas fa-trash    "></i>
        </div>
      </div>
      <div style={{ display: imageBool }} className="chat-image">
        <img alt="" src={imageUrl}></img>
      </div>
      <div style={{ overflow: "hidden" }} className="message">
        <Linkify>{replacedMsg}</Linkify>
      </div>
      <Link to={`/rooms/${roomId}/${id}`}>
        <div
          onClick={() => {
            if (user.uid === "zYOQ7uajkqWyI9FonJVGwS1UTfu2") {
              setReact(!react);
            } else {
              setReact(react);
            }

            if (roomId && id) {
              db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .doc(id)
                .update({ isReacted: !react });
            }
          }}
          title="Only Admin Can React :)"
          className={
            user.uid === "zYOQ7uajkqWyI9FonJVGwS1UTfu2"
              ? `chat-reactor ${react ? "active" : ""}`
              : `chat-reactor ${react ? "active1" : ""}`
          }
        >
          <i className="fas fa-heart"></i>
        </div>
      </Link>
    </div>
  );
}

export default Chat;
