import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import SidebarProfile from "../SidebarProfile/SidebarProfile";
import { useStateValue } from "../../Global/StateProvider";
import db, { auth, storage } from "../../Firebase/Firebase";
import { actionTypes } from "../../Global/Reducer";
function Sidebar() {
  const [showSidebarChatAdd, setShowSidebarChatAdd] = useState(false);
  const [{ user }, dispatch] = useStateValue();

  const [avatarUrl, setAvatarUrl] = useState(`url(${user.photoURL})`);
  const [width, setWidth] = useState(0);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [style, setStyle] = useState(
    user.uid === "zYOQ7uajkqWyI9FonJVGwS1UTfu2"
      ? { display: "flex" }
      : { display: "none" }
  );
  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setLoading(rooms ? false : true);
  }, [rooms]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const fileUpload = (e) => {
    e.preventDefault();

    const storageRef = storage.ref("sidebar-images/" + image.name);
    const task = storageRef.put(image);

    task.on(
      "state-changed",

      (snapshot) => {
        const percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setWidth(percentage);
      },

      (error) => {
        console.log(error);
      },

      () => {
        storage
          .ref("sidebar-images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("rooms").add({
              name: name,
              url: url,
            });

            setWidth(0);
            setName("");
            setShowSidebarChatAdd(false);
          });
      }
    );
  };

  return (
    <div className="sidebar">
      <form
        className={`sidebar-profile-admin-add ${
          showSidebarChatAdd ? "show" : "hide"
        }`}
      >
        <div className="spcl">
          <input
            onChange={handleChange}
            type="file"
            className="spaa-file-upload"
            id="spaa-file-upload"
          ></input>
          <label htmlFor="spaa-file-upload">
            <i class="fas fa-user-circle    "></i>
          </label>
        </div>
        <div className="spaa-name">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
          ></input>
          <button onClick={fileUpload} type="submit">
            <i class="fas fa-check-circle    "></i>{" "}
          </button>
        </div>
        <div className="uploader-bar">
          <span style={{ width: `${width}%` }}></span>
        </div>
      </form>
      <div
        style={{ display: style.display }}
        onClick={() => setShowSidebarChatAdd(!showSidebarChatAdd)}
        className="sidebar-add"
      >
        <i className="fas fa-plus    "></i>
      </div>
      <div className="sidebar-header">
        <div
          style={{
            background: avatarUrl,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundColor: "#fff",
          }}
          className="sidebar-avatar"
        ></div>
        <div className="sidebar-header-name">{user.displayName}</div>
        <button
          onClick={() => {
            auth
              .signOut()
              .then(dispatch({ type: actionTypes.DEL_USER, user: null }));
          }}
          className="logout"
        >
          Log Out
        </button>
      </div>
      <div className="sidebar-container">
        {loading ? (
          <div className="sidebar-loader">
            <i class="fas fa-circle-notch    "></i>
          </div>
        ) : (
          rooms.map((room) => {
            return (
              <SidebarProfile
                key={room.id}
                id={room.id}
                name={room.data.name}
                url={room.data.url}
                style={style}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Sidebar;
