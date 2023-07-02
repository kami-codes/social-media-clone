import { getSelectionRange } from "@testing-library/user-event/dist/utils";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB8ntKpR58UUnd3CTgIywuiPPRzyQx5LRA",
  authDomain: "social-media-clone-3ce48.firebaseapp.com",
  projectId: "social-media-clone-3ce48",
  storageBucket: "social-media-clone-3ce48.appspot.com",
  messagingSenderId: "688692994909",
  appId: "1:688692994909:web:a55cc035ff1924d643beb4"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app);