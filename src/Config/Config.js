import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBIBy0YFSvjYHjlAECKN_Q5KomWBJrtMMQ",
  authDomain: "powerstore-ec3e9.firebaseapp.com",
  projectId: "powerstore-ec3e9",
  storageBucket: "powerstore-ec3e9.appspot.com",
  messagingSenderId: "148557068845",
  appId: "1:148557068845:web:75b8b289b68327d02d16a4",
  measurementId: "G-68GZXZF4KC"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export {auth,fs,storage}