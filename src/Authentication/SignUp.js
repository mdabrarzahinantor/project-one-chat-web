import React, { useEffect, useState } from "react";
import db, { auth, storage } from "../Firebase/Firebase";
import { actionTypes } from "../Global/Reducer";
import { useStateValue } from "../Global/StateProvider";
import "./Authentication.css";
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const [{ user }, dispatch] = useStateValue();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (url) {
      auth.createUserWithEmailAndPassword(email, password).then((result) => {
        result.user
          .updateProfile({ displayName: username, photoURL: url })
          .then(() => {
            db.collection("users").doc(result.user.uid).set({
              userEmail: result.user.email,
              userPhotoURL: result.user.photoURL,
              userDisplayName: result.user.displayName,
            });
            dispatch({ type: actionTypes.SET_USER, user: result.user });
            console.log(result.user);
            setLoading(false);
            setPassword("");
            setEmail("");
            setUsername("");
            setUrl("");
          })
          .catch((error) => alert(error.message));
      });
    } else {
      alert("Choose A Profile Picture");
    }
  };

  return (
    <div className="sign-up">
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => {
            dispatch({
              type: actionTypes.SET_IMAGE,
              image: e.target.files[0],
            });
            setLoading(true);
            const uploadTask = storage
              .ref(`user-images/${e.target.files[0].name}`)
              .put(e.target.files[0]);

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
                // complete function ...
                storage
                  .ref("user-images")
                  .child(e.target.files[0].name)
                  .getDownloadURL()
                  .then((url) => {
                    setUrl(url);
                    setLoading(false);
                  });
              }
            );
          }}
          required={true}
          className="sign-up-file"
          type="file"
          name="myImage"
          accept="image/png, image/gif, image/jpeg,image/jpg"
          id="sign-up-file"
        ></input>
        <label htmlFor="sign-up-file">Choose Profile Pic</label>

        {loading ? (
          <div className="profile-pic-laoder">
            <i className="fas fa-circle-notch    "></i>
          </div>
        ) : (
          <>
            <input
              required={true}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              type="text"
              className="sign-up-username"
              value={username}
            ></input>
            <input
              required={true}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="sign-up-email"
              value={email}
            ></input>
            <input
              required={true}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="sign-up-password"
              value={password}
            ></input>
            <button type="submit" className="sign-up-button">
              Sign Up
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default SignUp;
