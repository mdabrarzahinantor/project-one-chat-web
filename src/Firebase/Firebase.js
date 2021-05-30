import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD3j-WWegonTS976RrxatTLA4FpEAeMBis",
  authDomain: "react-chat-app-2887b.firebaseapp.com",
  projectId: "react-chat-app-2887b",
  storageBucket: "react-chat-app-2887b.appspot.com",
  messagingSenderId: "749254481544",
  appId: "1:749254481544:web:3a72d9d153163c597c713d",
  measurementId: "G-T8WF3WNRR0",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
export const storage = firebaseApp.storage();

const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
