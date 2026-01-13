import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';

import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const useProxyNative = Platform.OS !== 'web';
  const redirectUri = makeRedirectUri({ useProxy: useProxyNative });

  useEffect(() => {
    console.log('Redirect URI:', redirectUri);
  }, [redirectUri]);

  const expoClientId = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || '472993717126-a0bk0gj139ousphr9rf1p6s5gt2mnhm1.apps.googleusercontent.com';
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || expoClientId;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || expoClientId;
  const webClientIdEnv = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '472993717126-a0bk0gj139ousphr9rf1p6s5gt2mnhm1.apps.googleusercontent.com';
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: webClientIdEnv,
    expoClientId: expoClientId,
    iosClientId: iosClientId,
    androidClientId: androidClientId,
    scopes: ['profile', 'email'],
    responseType: 'id_token',
    redirectUri,
  });

  // 🔄 Persistencia de sesión
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        (async () => {
          const setupDone = await AsyncStorage.getItem('profile-setup-complete');
          if (setupDone) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{
                name: 'SetupProfile',
                params: {
                  uid: user.uid,
                  email: user.email,
                  name: user.displayName,
                  photoUrl: user.photoURL
                }
              }],
            });
          }
          setCheckingAuth(false);
        })();
        return;
      }
      setCheckingAuth(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (response?.type === 'error') {
      Alert.alert('Google auth error', response?.error || 'invalid_request');
      return;
    }
    if (response?.type !== 'success') return;
    const idToken = response?.params?.id_token || response?.authentication?.idToken;
    if (!idToken) {
      Alert.alert('Error', 'Google no devolvió id_token');
      return;
    }
    const credential = GoogleAuthProvider.credential(idToken);
    signInWithCredential(auth, credential).catch(err => Alert.alert('Firebase error', err.message));
  }, [response]);
 
 

  // ✉️ Email/Password
  const handleEmailAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: fullName });
      }
    } catch (e) {
      Alert.alert('Auth error', e.message);
    }
  };

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MindfulSpace</Text>

      {!isLogin && (
        <TextInput
          placeholder="Nombre completo"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleEmailAuth} style={styles.button}>
        <Text style={styles.buttonText}>
          {isLogin ? 'Iniciar sesión' : 'Registrarse'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => promptAsync({ useProxy: useProxyNative })}
        style={[styles.googleButton, !request && { opacity: 0.5 }]}
        disabled={!request}
      >
        <Ionicons name="logo-google" size={20} />
        <Text>Continuar con Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switch}>
          {isLogin ? 'Crear cuenta' : 'Ya tengo cuenta'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: { borderBottomWidth: 1, marginBottom: 16, padding: 8 },
  button: { backgroundColor: '#7C3AED', padding: 14, borderRadius: 12 },
  buttonText: { color: 'white', textAlign: 'center' },
  googleButton: {
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },
  switch: { marginTop: 16, textAlign: 'center', color: '#7C3AED' },
});
