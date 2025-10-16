// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⬇️ paste your own config from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyBg15yJGvj8oNoLoQDC026_J5IMt_moP-k",
  authDomain: "bodima-react-native.firebaseapp.com",
  projectId: "bodima-react-native",
  storageBucket: "bodima-react-native.firebasestorage.app",
  messagingSenderId: "13000309105",
  appId: "1:13000309105:web:7ec0a1715e105f6a325ed0"
};

const app = initializeApp(firebaseConfig);

// Use RN persistence so the user stays logged in between app launches
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
