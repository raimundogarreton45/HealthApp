import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Image } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Layout from "../components/Layout";
import { useLanguage } from "../components/LanguageContext";
import { storage } from "../api/storage";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export default function Profile() {
  const { t, language } = useLanguage();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('client');
  const [expertForm, setExpertForm] = useState({
    name: '',
    bio: '',
    photo_url: '',
    degree: '',
    credentials: '',
    cv_url: ''
  });
  const [saving, setSaving] = useState(false);
  const [expertMode, setExpertMode] = useState('preview');

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  const load = async () => {
    try {
      const me = await storage.auth.getProfile();
      const storedRole = await AsyncStorage.getItem('user-role');
      setRole(storedRole || 'client');
      
      // If we have a firebase user
      const fbUser = auth.currentUser;
      const computedName = me.full_name || fbUser?.displayName || (fbUser?.email ? fbUser.email.split('@')[0] : 'Guest');
      setUser({ full_name: computedName, email: fbUser?.email || null, id: fbUser?.uid || null });

      // Load expert profile if logged in
      if (fbUser && fbUser.email) {
        const existingExperts = await storage.entity('Expert').list('-created_date');
        const myExpert = existingExperts.find(e => e.email === fbUser.email);
        if (myExpert) {
          setExpertForm({
            name: myExpert.name || '',
            bio: myExpert.bio || '',
            photo_url: myExpert.photo_url || '',
            degree: myExpert.degree || '',
            credentials: myExpert.credentials || '',
            cv_url: myExpert.cv_url || ''
          });
          await AsyncStorage.setItem('expert-id', String(myExpert.id));
          setExpertMode('preview');
        }
      }
    } catch (e) {
      setUser({ full_name: 'Guest' });
    }
  };

  const name = user?.full_name || 'Guest';
  const initial = (name || 'G').charAt(0).toUpperCase();

  const saveRole = async (nextRole) => {
    setRole(nextRole);
    await AsyncStorage.setItem('user-role', nextRole);
  };

  const handleLogout = async () => {
    await storage.auth.logout();
    await signOut(auth);
    setUser({ full_name: 'Guest' });
    navigation.navigate('Login');
  };

  const submitExpert = async () => {
    if (!user?.email) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Debes iniciar sesión para guardar perfil de experto' : 'You must login to save expert profile');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        name: expertForm.name.trim() || name,
        email: user.email,
        bio: expertForm.bio.trim(),
        photo_url: expertForm.photo_url.trim(),
        degree: expertForm.degree.trim(),
        credentials: expertForm.credentials.trim(),
        cv_url: expertForm.cv_url.trim()
      };
      const existingId = await AsyncStorage.getItem('expert-id');
      let result;
      if (existingId) {
        result = await storage.entity('Expert').update(existingId, payload);
      } else {
        result = await storage.entity('Expert').create(payload);
        if (result?.id) await AsyncStorage.setItem('expert-id', String(result.id));
      }
      await storage.auth.updateProfile({ full_name: payload.name });
      setUser((prev) => ({ ...(prev || {}), full_name: payload.name }));
      Alert.alert(language === 'es' ? 'Guardado' : 'Saved', language === 'es' ? 'Perfil de experto actualizado' : 'Expert profile updated');
    } catch (e) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'No se pudo guardar' : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile') || 'Profile'}</Text>
          <Text style={styles.subtitle}>{language === 'es' ? 'Gestiona tu cuenta y preferencias' : 'Manage your account and preferences'}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{name}</Text>
            {user?.email && <Text style={styles.email}>{user.email}</Text>}
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          {user?.email ? (
             <TouchableOpacity onPress={handleLogout} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#EF4444', backgroundColor: '#FEF2F2' }}>
               <Text style={{ fontWeight: '600', color: '#EF4444', fontSize: 14 }}>{language === 'es' ? 'Cerrar sesión' : 'Logout'}</Text>
             </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E9D5FF', backgroundColor: '#FFFFFF' }}>
                <Text style={{ fontWeight: '600', color: '#7C3AED', fontSize: 14 }}>{t('login')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#7C3AED' }}>
                <Text style={{ fontWeight: '700', color: '#FFFFFF', fontSize: 14 }}>{t('signUp')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <TouchableOpacity onPress={() => saveRole('client')} style={[styles.roleBtn, role === 'client' && styles.roleActive]}>
            <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>{t('clientProfile') || (language === 'es' ? 'Perfil de cliente' : 'Client Profile')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => saveRole('expert')} style={[styles.roleBtn, role === 'expert' && styles.roleActive]}>
            <Text style={[styles.roleText, role === 'expert' && styles.roleTextActive]}>{t('expertProfile') || (language === 'es' ? 'Perfil de experto' : 'Expert Profile')}</Text>
          </TouchableOpacity>
        </View>

        {role === 'client' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{language === 'es' ? 'Perfil' : 'Profile'}</Text>
            <Text style={{ color: '#6B7280' }}>{language === 'es' ? 'Tu información principal se muestra arriba.' : 'Your primary info is shown above.'}</Text>
          </View>
        )}

        {role === 'expert' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{language === 'es' ? 'Perfil profesional' : 'Professional profile'}</Text>
            {user?.email ? (
              <View style={{ gap: 12 }}>
                {expertMode === 'preview' ? (
                  <View style={{ gap: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      {expertForm.photo_url ? (
                        <Image source={{ uri: expertForm.photo_url }} style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#E5E7EB' }} />
                      ) : (
                        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 24, fontWeight: '700', color: '#7C3AED' }}>{(expertForm.name || user?.full_name || 'G').charAt(0).toUpperCase()}</Text>
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>{expertForm.name || user?.full_name || ''}</Text>
                        {!!expertForm.degree && <Text style={{ color: '#6B7280' }}>{expertForm.degree}</Text>}
                        {!!expertForm.credentials && <Text style={{ color: '#6B7280' }}>{expertForm.credentials}</Text>}
                      </View>
                    </View>
                    {!!expertForm.bio && (
                      <Text style={{ color: '#374151' }}>{expertForm.bio}</Text>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <TouchableOpacity onPress={() => setExpertMode('edit')} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}>
                        <Text style={{ fontWeight: '600', color: '#374151' }}>{language === 'es' ? 'Editar' : 'Edit'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={{ gap: 12 }}>
                    <TextInput style={styles.input} value={expertForm.name} onChangeText={(v) => setExpertForm({ ...expertForm, name: v })} placeholder={language === 'es' ? 'Nombre completo' : 'Full name'} />
                    <TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} multiline value={expertForm.bio} onChangeText={(v) => setExpertForm({ ...expertForm, bio: v })} placeholder={language === 'es' ? 'Biografía profesional' : 'Professional bio'} />
                    <TextInput style={styles.input} value={expertForm.photo_url} onChangeText={(v) => setExpertForm({ ...expertForm, photo_url: v })} placeholder={language === 'es' ? 'URL de foto' : 'Photo URL'} />
                    <TextInput style={styles.input} value={expertForm.degree} onChangeText={(v) => setExpertForm({ ...expertForm, degree: v })} placeholder={language === 'es' ? 'Título profesional' : 'Professional degree'} />
                    <TextInput style={styles.input} value={expertForm.credentials} onChangeText={(v) => setExpertForm({ ...expertForm, credentials: v })} placeholder={language === 'es' ? 'Credenciales' : 'Credentials'} />
                    <TextInput style={styles.input} value={expertForm.cv_url} onChangeText={(v) => setExpertForm({ ...expertForm, cv_url: v })} placeholder={language === 'es' ? 'URL de CV' : 'CV URL'} />
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity onPress={async () => { await submitExpert(); setExpertMode('preview'); }} style={{ flex: 1, backgroundColor: '#7C3AED', paddingVertical: 12, borderRadius: 10, alignItems: 'center', opacity: saving ? 0.7 : 1 }} disabled={saving}>
                        <Text style={{ color: '#fff', fontWeight: '600' }}>{saving ? (t('saving') || 'Saving...') : (t('save') || 'Save')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setExpertMode('preview')} style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}>
                        <Text style={{ fontWeight: '600', color: '#374151' }}>{language === 'es' ? 'Cancelar' : 'Cancel'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#6B7280', marginBottom: 12, textAlign: 'center' }}>
                  {language === 'es' ? 'Inicia sesión para crear tu perfil de experto' : 'Log in to create your expert profile'}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#7C3AED' }}>
                  <Text style={{ fontWeight: '600', color: '#FFFFFF' }}>{t('login')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#7C3AED' },
  name: { fontSize: 18, fontWeight: '600', color: '#111827' },
  email: { fontSize: 12, color: '#6B7280' },
  roleBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', alignItems: 'center' },
  roleActive: { borderColor: '#C7D2FE', backgroundColor: '#EEF2FF' },
  roleText: { fontWeight: '600', color: '#374151' },
  roleTextActive: { color: '#7C3AED' },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rowText: { flex: 1, marginLeft: 12, color: '#374151' },
  rowValue: { color: '#6B7280' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 14 },
});
