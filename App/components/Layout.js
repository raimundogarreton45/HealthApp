import React from 'react';
import { View, Text, TouchableOpacity, Platform, Alert, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from './LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import LanguageSelector from './LanguageSelector';

export default function Layout({ children }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = React.useState(Platform.OS !== 'web');
  const { width } = useWindowDimensions();

  const compact = width < 360;
  const veryCompact = width < 320;
  const padV = compact ? 4 : 6;
  const padH = compact ? 8 : 10;
  const radius = compact ? 12 : 16;
  const fontSize = veryCompact ? 11 : compact ? 12 : 14;

  const items = [
    { title: t('home'), name: 'Home', icon: 'home' },
    { title: t('aiCompanion'), name: 'Chat', icon: 'chatbubble-ellipses' },
    { title: t('exercises'), name: 'Exercises', icon: 'fitness' },
    { title: t('playlists'), name: 'Playlists', icon: 'musical-notes' },
    { title: t('consultations'), name: 'Consultations', icon: 'calendar' },
    { title: t('profile'), name: 'Profile', icon: 'person-circle' },
  ];

  const isMobile = Platform.OS !== 'web';

  return (
    <LinearGradient colors={["#F5F3FF", "#EDE9FE", "#FDF4FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>

      <LinearGradient colors={["#FFFFFF", "#F5F3FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderBottomWidth: 1, borderColor: '#E9D5FF', paddingHorizontal: 12, paddingVertical: compact ? 8 : 10, width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ minWidth: 40 }}>
              {isMobile && (
                <TouchableOpacity onPress={() => setCollapsed(!collapsed)} style={{ paddingHorizontal: 6, paddingVertical: 6 }}>
                  <Ionicons name={collapsed ? 'menu' : 'close'} size={18} color="#7C3AED" />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="heart" size={compact ? 18 : 22} color="#7C3AED" />
              <Text style={{ fontWeight: 'bold', fontSize: compact ? 16 : 18, color: '#4C1D95' }}>MindfulSpace</Text>
            </View>
            <View style={{ width: compact ? 60 : 80 }} />
          </View>
        </LinearGradient>

      <View style={{ flex: 1, flexDirection: 'row', position: 'relative' }}>
        <View style={{ position: isMobile ? 'absolute' : 'relative', left: isMobile ? 0 : undefined, top: isMobile ? 0 : undefined, bottom: isMobile ? 0 : undefined, zIndex: isMobile ? 50 : undefined, width: isMobile ? (collapsed ? 0 : 240) : (collapsed ? 64 : 240), borderRightWidth: isMobile ? (collapsed ? 0 : 1) : 1, borderColor: '#E9D5FF', backgroundColor: '#FFFFFFE6', height: '100%', alignSelf: 'stretch' }}>
          <View style={{ padding: 12, borderBottomWidth: collapsed ? 0 : 1, borderColor: '#E9D5FF', alignItems: collapsed ? 'center' : 'flex-start' }}>
            {!isMobile && (
              <TouchableOpacity onPress={() => setCollapsed(!collapsed)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: '#EDE9FE', borderRadius: 8, backgroundColor: '#FFFFFF' }}>
                <Ionicons name={collapsed ? 'chevron-forward' : 'chevron-back'} size={16} color="#7C3AED" />
                {!collapsed && <Text style={{ color: '#7C3AED', fontWeight: '600' }}>{t('home')}</Text>}
              </TouchableOpacity>
            )}
          </View>

          <View style={{ padding: 10, display: isMobile && collapsed ? 'none' : 'flex' }}>
            {items.map(item => {
              const active = route.name === item.name;
              return (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => { navigation.navigate(item.name); if (isMobile) setCollapsed(true); }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingVertical: 10,
                    paddingHorizontal: collapsed ? 0 : 12,
                    borderRadius: 12,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: active ? '#C7D2FE' : '#EDE9FE',
                    backgroundColor: '#FFFFFF',
                    justifyContent: collapsed ? 'center' : 'flex-start'
                  }}
                >
                  <Ionicons name={item.icon} size={18} color={active ? '#7C3AED' : '#374151'} />
                  {!collapsed && <Text style={{ fontWeight: '600', color: active ? '#7C3AED' : '#374151' }}>{item.title}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ marginTop: 'auto', padding: 12, borderTopWidth: collapsed ? 0 : 1, borderColor: '#E9D5FF', alignItems: collapsed ? 'center' : 'flex-start', display: isMobile && collapsed ? 'none' : 'flex' }}>
            <LanguageSelector />
          </View>
        </View>
        {isMobile && !collapsed && (
          <TouchableOpacity onPress={() => setCollapsed(true)} style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#00000033', zIndex: 40 }} />
        )}
        <View style={{ flex: 1, padding: isMobile ? 12 : 16 }}>{children}</View>
      </View>
    </LinearGradient>
  );
}
