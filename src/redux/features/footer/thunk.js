import { doc, getDoc, collection } from "firebase/firestore";
import { fs } from "../../../Config/Config";
import { setFooterData } from "./Slice";

export const fetchFooterData = () => async (dispatch) => {
  try {
    const contactInfoDocRef = doc(collection(fs, "FooterSettings"), "ContactInformation");
    const imagePhraseDocRef = doc(collection(fs, "FooterSettings"), "ImagePhrase");
    const socialMediaDocRef = doc(collection(fs, "FooterSettings"), "SocialMedia");

    const [contactInfoDocSnap, imagePhraseDocSnap, socialMediaDocSnap] = await Promise.all([
      getDoc(contactInfoDocRef),
      getDoc(imagePhraseDocRef),
      getDoc(socialMediaDocRef),
    ]);

    if (contactInfoDocSnap.exists() && imagePhraseDocSnap.exists() && socialMediaDocSnap.exists()) {
      const contactInfoData = contactInfoDocSnap.data();
      const imagePhraseData = imagePhraseDocSnap.data();
      const socialMediaData = socialMediaDocSnap.data();

      // Exclude image from the data (assuming image is in the 'image' field)
      const { image, ...footerData } = { ...contactInfoData, ...imagePhraseData, ...socialMediaData };

      // Dispatch the action to set the combined footer data (excluding image) in the Redux store
      dispatch(setFooterData(footerData));
    }
  } catch (error) {
    console.error("Error fetching footer data from Firestore:", error);
  }
};
