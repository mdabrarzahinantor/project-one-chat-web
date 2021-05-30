import { useEffect, useState } from "react";
import "./App.css";
import ChatBox from "./Components/ChatBox/ChatBox";
import Sidebar from "./Components/Sidebar/Sidebar";
import { useStateValue } from "./Global/StateProvider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ChatBoxAlt from "./Components/ChatBox/ChatBoxAlt";
import SignUp from "./Authentication/SignUp";

import Authentication from "./Authentication/Authentication";
import { auth } from "./Firebase/Firebase";
import { actionTypes } from "./Global/Reducer";
import SignIn from "./Authentication/Signin";

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged((user) =>
      dispatch({ type: actionTypes.SET_USER, user: user })
    );
  }, []);

  return (
    <div className="App">
      {user ? (
        <>
          <Router>
            <Sidebar />
            <Switch>
              <Route
                exact
                path="/rooms/:roomId/:msgId"
                component={ChatBox}
              ></Route>
              <Route exact path="/rooms/:roomId/" component={ChatBox}></Route>
              <Route exact path="/" component={ChatBoxAlt}></Route>
            </Switch>
          </Router>
        </>
      ) : (
        <>
          {/* <SigninWithGoogle /> */}
          <Router>
            <Authentication />
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
          </Router>
        </>
      )}
    </div>
  );
}

export default App;
