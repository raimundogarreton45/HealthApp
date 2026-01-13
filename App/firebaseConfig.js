import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyCAfE1hQk4dRrCZ2SdpNWMDVi3J6h93rWo",
  authDomain: "healthapp-de953.firebaseapp.com",
  projectId: "healthapp-de953",
  storageBucket: "healthapp-de953.firebasestorage.app",
  messagingSenderId: "472993717126",
  appId: "1:472993717126:web:738e365482708887ce6a07"
};

const app = initializeApp(firebaseConfig);

let auth;
try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (e) {
  console.warn("Firebase Auth Initialization Error:", e);
  // Fallback if initialization fails (e.g. already initialized)
  auth = getAuth(app);
}

export { auth };
