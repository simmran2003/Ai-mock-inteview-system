import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyDFJgH3AO6Cxil43_5Z3EtrYA39FQaA8_Y",
    authDomain: "ai-interview-system-2a8f5.firebaseapp.com",
    projectId: "ai-interview-system-2a8f5",
    storageBucket: "ai-interview-system-2a8f5.firebasestorage.app",
    messagingSenderId: "337779588534",
    appId: "1:337779588534:web:02528f6bb2390b74535517"
  };

const app = initializeApp(firebaseConfig)

export const storage = getStorage(app);