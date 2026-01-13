import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Layout from "../components/Layout";
import { useLanguage } from "../components/LanguageContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Nickname() {
  const { t, language } = useLanguage();
  const navigation = useNavigation();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem('nickname');
      if (saved) setNickname(saved);
    };
    load();
  }, []);

  const save = async () => {
    const n = nickname.trim();
    if (!n) return;
    await AsyncStorage.setItem('nickname', n);
    navigation.navigate('Profile');
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>{t('chooseNickname') || (language === 'es' ? 'Elige tu apodo' : 'Choose your nickname')}</Text>
        <Text style={styles.subtitle}>{language === 'es' ? 'Este nombre se mostrará en la app' : 'This name will be shown in the app'}</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder={t('enterNickname') || (language === 'es' ? 'Ingresa tu apodo' : 'Enter your nickname')}
        />
        <TouchableOpacity style={styles.button} onPress={save} disabled={!nickname.trim()}>
          <Text style={styles.buttonText}>{t('save') || 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 12, color: '#6B7280', marginTop: 6 },
  input: { marginTop: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, backgroundColor: '#fff' },
  button: { marginTop: 16, backgroundColor: '#7C3AED', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' }
});