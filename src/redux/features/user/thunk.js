// thunks/fetchUserData.js
import { doc, getDoc } from "firebase/firestore";
import { fs } from "../../../Config/Config";
import { setUser } from "./slice";

export const fetchUserData = (uid) => async (dispatch) => {
  console.log(uid);
  const userDocRef = doc(fs, "users", uid);

  try {
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();

      // Remove the 'password' field from userData
      const { Password, ...userDataWithoutPassword } = userData;

      // Update the UID field with the provided 'uid'
      userDataWithoutPassword.UID = uid;

      dispatch(setUser(userDataWithoutPassword));
    }
  } catch (error) {
    console.error("Error fetching user data from Firestore:", error);
  }
};
