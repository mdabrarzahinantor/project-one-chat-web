import { useStateValue } from "../../Global/StateProvider";
import React, { useEffect, useRef, useState } from "react";
import db, { storage } from "../../Firebase/Firebase";
import Chat from "../Chat/Chat";
import "./ChatBox.css";
import firebase from "firebase";
import { useParams } from "react-router-dom";

function ChatBox({ match }) {
  const [message, setMessage] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [url, setUrl] = useState("");
  const { roomId } = useParams();
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [done, setDone] = useState(true);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        ?.doc(roomId)
        ?.onSnapshot((snapshot) => {
          setRoomName(snapshot?.data()?.name);
          setUrl(snapshot?.data()?.url);
        });
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, [roomId]);

  // Send Message
  //
  //
  // +++++++

  useEffect(() => {
    setLoading(messages ? false : true);
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .add({
        message: message,
        name: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        url: user.photoURL,
        isReacted: false,
        uid: user.uid,
        hasImage: imageUrl ? true : false,
        imageUrl: imageUrl,
      })
      .then(setImageUrl(""));

    setMessage("");

    document.querySelector(".chat-box").scrollIntoView();
  };

  useEffect(() => {
    console.log(done, progress);
  }, [done, progress]);

  return (
    <div className="chat-box">
      <div className="chat-box-header">
        <div
          style={{
            backgroundImage: `url(${url})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className="chat-box-header-image"
        ></div>
        <div className="chat-box-header-title">{roomName}</div>
      </div>
      {/* Main--------------
      -----------------------
      ---------------------
      ------------------------ */}
      <div className="chat-box-main">
        {loading ? (
          <div className="chat-box-loader">
            <i class="fas fa-circle-notch    "></i>
          </div>
        ) : (
          messages.map((msg) => (
            <div>
              <Chat
                msg={msg.data.message}
                name={msg.data.name}
                time={msg.data.timestamp}
                url={msg.data.url}
                key={msg.id}
                id={msg.id}
                reactHeart={msg.data.isReacted}
                uid={msg.data.uid}
                hasImage={msg.data.imageUrl ? true : false}
                imageUrl={msg.data.imageUrl}
              />
            </div>
          ))
        )}
      </div>
      {/* Main----------------
      -------------------
      ----------------------- */}
      <form className="chat-box-footer">
        <div className="chat-box-footer-left">
          <input
            onChange={(e) => {
              const image = e.target.files[0];
              if (image) {
                setDone(false);
                console.log(image.name);
                const uploadTask = storage
                  .ref(`chat-images/${image.name}`)
                  .put(image);

                uploadTask.on(
                  "state_changed",
                  (snapshot) => {
                    // progress function
                    const progress = Math.round(
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                  },
                  (error) => {
                    // Error function
                    console.log(error);
                    alert(error.message);
                  },
                  () => {
                    storage
                      .ref("chat-images")
                      .child(image.name)
                      .getDownloadURL()
                      .then((url) => {
                        setImageUrl(url);
                        setProgress(0);
                        setDone(true);
                      });
                  }
                );
              }
            }}
            type="file"
            id="file"
          ></input>
          <label htmlFor="file">
            <i className="fas fa-image    "></i>
          </label>
        </div>
        <div className="chat-box-footer-middle">
          {!done ? (
            <div className="file-loader">
              <div className="bx">
                <span style={{ width: `${progress}%` }}></span>
              </div>
            </div>
          ) : (
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
            ></input>
          )}
        </div>
        <div className="chat-box-footer-right">
          <button
            onClick={
              message
                ? sendMessage
                : (e) => {
                    e.preventDefault();
                    alert("Unable To Send Empty Message XD");
                  }
            }
          >
            <i className="fas fa-paper-plane    "></i>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatBox;
