// uiThunks.js
import { updateUISettings } from "./uiSlice";
import { fs } from "../../../Config/Config";
import { doc, getDoc } from "firebase/firestore";

export const fetchUISettings = () => async (dispatch) => {
  try {
    const settingsRef = doc(fs, "admin", "settings");
    const docSnapshot = await getDoc(settingsRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      dispatch(updateUISettings(data));
    }
  } catch (error) {
    console.error("Error fetching UI settings:", error);
  }
};
