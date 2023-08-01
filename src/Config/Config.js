import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBIBy0YFSvjYHjlAECKN_Q5KomWBJrtMMQ",
  authDomain: "powerstore-ec3e9.firebaseapp.com",
  projectId: "powerstore-ec3e9",
  storageBucket: "powerstore-ec3e9.appspot.com",
  messagingSenderId: "148557068845",
  appId: "1:148557068845:web:75b8b289b68327d02d16a4",
  measurementId: "G-68GZXZF4KC"
};

// Initialize Firebase app with your Firebase config
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const fs = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { firebaseApp, auth, fs, storage };