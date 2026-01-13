import React from "react";
import { View, Text, TouchableOpacity, Platform, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from "./LanguageContext";

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸', colors: ["#F5F3FF", "#EDE9FE"] },
  { code: 'en', name: 'English', flag: '🇺🇸', colors: ["#E0EAFF", "#EEF2FF"] },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => { Animated.timing(anim, { toValue: open ? 1 : 0, duration: 160, useNativeDriver: true }).start(); }, [open]);

  const current = languages.find(l => l.code === language) || languages[0];

  return (
    <View style={{ position: 'relative' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name="globe-outline" size={16} color="#6B7280" />
        <LinearGradient colors={current.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 12 }}>
          <TouchableOpacity onPress={() => setOpen(!open)} activeOpacity={0.9} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 12 }}>
            <Text style={{ fontSize: 14 }}>{current.flag}</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#4C1D95' }}>{current.name}</Text>
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={14} color="#7C3AED" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0,1], outputRange: [-6,0] }) }] }}>
        {open && (
          <View style={{ marginTop: 8, flexDirection: 'row', gap: 8 }}>
            {languages.map((lang) => (
              <TouchableOpacity key={lang.code} onPress={() => { setLanguage(lang.code); setOpen(false); }} activeOpacity={0.85} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: '#FFFFFF' }}>
                <Text style={{ fontSize: 14 }}>{lang.flag}</Text>
                <Text style={{ fontSize: 12, color: '#374151' }}>{lang.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
