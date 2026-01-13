// pages/Home.js
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../components/LanguageContext";
import { storage } from "../api/storage";
import Layout from "../components/Layout";

const wellnessTips = [
  { en: "Hydrate like you mean it! Start your day with a glass of water 💧", es: "¡Hidrátate en serio! Empieza tu día con un vaso de agua 💧" },
  { en: "Get some sunshine today - your vitamin D and mood will thank you ☀️", es: "Toma un poco de sol hoy - tu vitamina D y tu estado de ánimo te lo agradecerán ☀️" },
  { en: "Add a colorful fruit to your day - make it sweet and healthy 🍓", es: "Añade una fruta colorida a tu día - hazlo dulce y saludable 🍓" },
  // ... agrega el resto de tus tips aquí
];

export default function Home() {
  const { t, language } = useLanguage();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [dailyTip, setDailyTip] = useState(null);

  useEffect(() => {
    loadUser();
    updateGreeting();
    setDailyWellnessTip();
  }, [language]);

 

  const loadUser = async () => {
    try {
      const currentUser = await storage.auth.getProfile();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(language === 'es' ? "Buenos días" : "Good morning");
    else if (hour < 18) setGreeting(language === 'es' ? "Buenas tardes" : "Good afternoon");
    else setGreeting(language === 'es' ? "Buenas noches" : "Good evening");
  };

  const setDailyWellnessTip = () => {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
      hash = hash & hash;
    }
    const tipIndex = Math.abs(hash) % wellnessTips.length;
    setDailyTip(wellnessTips[tipIndex][language] || wellnessTips[tipIndex].en);
  };

  const getFirstName = () => {
    if (!user?.full_name) return "";
    return user.full_name.split(" ")[0];
  };

  const greetingFontSize = width < 360 ? 18 : width < 480 ? 20 : width < 768 ? 22 : 28;

  const isWeb = Platform.OS === 'web';

  return (
    <Layout>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: 12, paddingTop: 16 }}>
          <LinearGradient colors={["#F5F3FF", "#EBF1FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 28, padding: 16 }}>
            <View style={{ alignItems: 'center', gap: 12 }}>
              <LinearGradient colors={["#F5F3FF", "#EBF1FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.badge}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#7C3AED' }}>
                    <Ionicons name="heart" size={16} color="#fff" />
                  </View>
                  <Text style={{ color: '#4C1D95', fontWeight: '600' }}>MindfulSpace</Text>
                </View>
              </LinearGradient>
              <Text style={[styles.greeting, { fontSize: greetingFontSize, textAlign: 'center' }]} numberOfLines={1}>{greeting}, {getFirstName()} 👋</Text>
              {dailyTip && (
                <View style={[styles.tipContainer, { maxWidth: 720 }]}> 
                  <View style={{ width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EDE9FE' }}>
                    <Ionicons name="sparkles" size={16} color="#7C3AED" />
                  </View>
                  <Text style={[styles.tipText, { textAlign: 'left' }]}>{dailyTip}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        <View style={{ paddingHorizontal: 12, marginTop: 12 }}>
          <View style={{ alignSelf: 'center', maxWidth: 720 }}>
            <Text style={{ textAlign: 'center', color: '#6B7280' }}>{t('welcomeSubtitle')}</Text>
          </View>
        </View>

 

        <View style={{ paddingHorizontal: 12, marginTop: 16, gap: 12, flexDirection: isWeb ? 'row' : 'column' }}>
          <TouchableOpacity onPress={() => navigation.navigate("Chat")} activeOpacity={0.85} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }} style={{ flex: 1, borderRadius: 20, borderWidth: 2, borderColor: '#111827' }}>
            <LinearGradient colors={["#F5F3FF", "#EBF1FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.cardGradient, { flex: 1 }]}> 
              <View style={{ alignItems: 'center', padding: 16 }}>
                <Ionicons name="chatbubble-ellipses" size={34} color="#7C3AED" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Exercises")} activeOpacity={0.85} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }} style={{ flex: 1, borderRadius: 20, borderWidth: 2, borderColor: '#111827' }}>
            <LinearGradient colors={["#E0EAFF", "#EEF2FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.cardGradient, { flex: 1 }]}> 
              <View style={{ alignItems: 'center', padding: 16 }}>
                <Ionicons name="fitness" size={34} color="#2563EB" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Consultations")} activeOpacity={0.85} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }} style={{ flex: 1, borderRadius: 20, borderWidth: 2, borderColor: '#111827' }}>
            <LinearGradient colors={["#DEF7EC", "#ECFDF5"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.cardGradient, { flex: 1 }]}> 
              <View style={{ alignItems: 'center', padding: 16 }}>
                <Ionicons name="calendar" size={34} color="#16A34A" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 12, marginTop: 24 }}>
          <View style={{ flexDirection: isWeb ? 'row' : 'column', gap: 16, alignItems: isWeb ? 'stretch' : 'flex-start' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Ionicons name="heart" size={24} color="#7C3AED" />
              <Text style={{ marginTop: 8, fontWeight: '700', color: '#7C3AED' }}>{t('safeConfidential')}</Text>
              <Text style={{ marginTop: 4, color: '#6B7280', textAlign: 'center' }}>{t('safeConfidentialDesc')}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <MaterialCommunityIcons name="brain" size={24} color="#2563EB" />
              <Text style={{ marginTop: 8, fontWeight: '700', color: '#2563EB' }}>{t('evidenceBased')}</Text>
              <Text style={{ marginTop: 4, color: '#6B7280', textAlign: 'center' }}>{t('evidenceBasedDesc')}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Ionicons name="shield-checkmark" size={24} color="#16A34A" />
              <Text style={{ marginTop: 8, fontWeight: '700', color: '#16A34A' }}>{t('alwaysAvailable')}</Text>
              <Text style={{ marginTop: 4, color: '#6B7280', textAlign: 'center' }}>{t('alwaysAvailableDesc')}</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 12, marginTop: 16 }}>
          <View style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', borderWidth: 1, borderRadius: 16, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="heart" size={20} color="#EF4444" />
              <Text style={{ fontWeight: '700', color: '#B91C1C' }}>{t('crisisSupport')}</Text>
            </View>
            <Text style={{ marginTop: 8, color: '#7F1D1D' }}>
              {language === 'es'
                ? "Si estás experimentando una emergencia de salud mental, por favor contacta servicios de emergencia o una línea de crisis inmediatamente. Línea de Crisis Nacional: 4141 (CL) | Emergencia: 123"
                : "If you're experiencing a mental health emergency, please contact emergency services or a crisis hotline immediately. National Crisis Hotline: 4141 (CL) | Emergency: 123"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  badge: { borderRadius: 16, paddingVertical: 6, paddingHorizontal: 10 },
  greeting: { fontWeight: '700', marginBottom: 8, paddingHorizontal: 12, color: '#7C3AED' },
  tipContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  tipText: { fontSize: 16, color: '#374151', flex: 1 },
  cardGradient: { borderRadius: 20, padding: 1 },
  card: { borderRadius: 18, padding: 16, gap: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EEF2FF' },
  iconBox: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cardTitleText: { fontSize: 18, fontWeight: '700', color: '#111827' },
  cardDesc: { fontSize: 14, color: '#6B7280' },
});
