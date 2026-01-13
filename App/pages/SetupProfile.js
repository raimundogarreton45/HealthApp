import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../components/LanguageContext';
import { storage } from '../api/storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SetupProfile({ route }) {
  const navigation = useNavigation();
  const { language } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('client'); 
  const [loading, setLoading] = useState(false);
  
  // Get data from Google Login if available
  const { email, name, photoUrl } = route.params || {};

  useEffect(() => {
    if (name) {
        setFullName(name);
    } else {
        // Fallback to async storage if not passed via params
        AsyncStorage.getItem('nickname').then(n => {
            if (n) setFullName(n);
        });
    }
  }, [name]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', language === 'es' ? 'Por favor ingresa tu nombre' : 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const profileData = {
          full_name: fullName,
          nickname: nickname || fullName.split(' ')[0],
          bio: bio,
          role: role === 'both' ? 'expert' : role // Map 'both' to 'expert' for backend compatibility
      };

      // Save profile locally
      await storage.auth.updateProfile(profileData);
      await AsyncStorage.setItem('profile-setup-complete', '1');

      navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
      });
    } catch (e) {
      console.error('SetupProfile Error:', e);
      Alert.alert('Error', 'Could not save profile: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{language === 'es' ? 'Completa tu Perfil' : 'Complete Profile'}</Text>
          <Text style={styles.subtitle}>{language === 'es' ? 'Cuéntanos un poco más sobre ti' : 'Tell us a bit more about yourself'}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>{language === 'es' ? 'Nombre completo' : 'Full name'}</Text>
          <View style={styles.inputGroup}>
            <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={language === 'es' ? 'Tu nombre completo legal' : 'Your full legal name'}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.label}>{language === 'es' ? 'Nombre para mostrar (opcional)' : 'Display name (optional)'}</Text>
          <View style={styles.inputGroup}>
            <Ionicons name="pricetag-outline" size={20} color="#6B7280" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={language === 'es' ? 'Nombre que se mostrará en la app' : 'Name shown in the app'}
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.label}>{language === 'es' ? 'Biografía profesional (opcional)' : 'Professional bio (optional)'}</Text>
          <View style={styles.inputGroup}>
            <Ionicons name="information-circle-outline" size={20} color="#6B7280" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={language === 'es' ? 'Resumen breve sobre ti' : 'Short summary about you'}
              value={bio}
              onChangeText={setBio}
              multiline
            />
          </View>

          <Text style={styles.label}>{language === 'es' ? 'Quiero ser...' : 'I want to be...'}</Text>
          
          <TouchableOpacity 
            style={[styles.roleOption, role === 'client' && styles.roleSelected]} 
            onPress={() => setRole('client')}
          >
            <Ionicons name="person" size={24} color={role === 'client' ? '#7C3AED' : '#6B7280'} />
            <View style={{ marginLeft: 12 }}>
                <Text style={[styles.roleTitle, role === 'client' && styles.roleTitleSelected]}>
                    {language === 'es' ? 'Paciente (Normal)' : 'Normal User (Patient)'}
                </Text>
                <Text style={styles.roleDesc}>
                    {language === 'es' ? 'Busco ayuda y contenido de bienestar' : 'I am looking for help and wellness content'}
                </Text>
            </View>
            {role === 'client' && <Ionicons name="checkmark-circle" size={24} color="#7C3AED" style={{ marginLeft: 'auto' }} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.roleOption, role === 'expert' && styles.roleSelected]} 
            onPress={() => setRole('expert')}
          >
            <Ionicons name="medkit" size={24} color={role === 'expert' ? '#7C3AED' : '#6B7280'} />
            <View style={{ marginLeft: 12 }}>
                <Text style={[styles.roleTitle, role === 'expert' && styles.roleTitleSelected]}>
                    {language === 'es' ? 'Experto' : 'Expert (Provider)'}
                </Text>
                <Text style={styles.roleDesc}>
                    {language === 'es' ? 'Soy profesional de salud mental' : 'I am a mental health professional'}
                </Text>
            </View>
            {role === 'expert' && <Ionicons name="checkmark-circle" size={24} color="#7C3AED" style={{ marginLeft: 'auto' }} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.roleOption, role === 'both' && styles.roleSelected]} 
            onPress={() => setRole('both')}
          >
            <Ionicons name="people" size={24} color={role === 'both' ? '#7C3AED' : '#6B7280'} />
            <View style={{ marginLeft: 12 }}>
                <Text style={[styles.roleTitle, role === 'both' && styles.roleTitleSelected]}>
                    {language === 'es' ? 'Ambos' : 'Both'}
                </Text>
                <Text style={styles.roleDesc}>
                    {language === 'es' ? 'Paciente y Experto' : 'Patient & Expert'}
                </Text>
            </View>
            {role === 'both' && <Ionicons name="checkmark-circle" size={24} color="#7C3AED" style={{ marginLeft: 'auto' }} />}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSave} style={styles.button} disabled={loading}>
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={styles.buttonText}>{language === 'es' ? 'Continuar' : 'Continue'}</Text>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center' },
  content: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
  form: { backgroundColor: 'white', padding: 24, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 16 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12 },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#111827' },
  button: { backgroundColor: '#7C3AED', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  roleOption: { 
      flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginBottom: 12 
  },
  roleSelected: { borderColor: '#7C3AED', backgroundColor: '#F5F3FF' },
  roleTitle: { fontSize: 16, fontWeight: '600', color: '#374151' },
  roleTitleSelected: { color: '#7C3AED' },
  roleDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 }
});
