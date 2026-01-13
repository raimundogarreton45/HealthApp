import React from 'react';
import { StatusBar, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './components/LanguageContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Exercises from './pages/Exercises';
import Consultations from './pages/Consultations';
import Playlists from './pages/Playlists';
import Profile from './pages/Profile';
import Nickname from './pages/Nickname';
import Login from './pages/Login';
import SetupProfile from './pages/SetupProfile';

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SetupProfile" component={SetupProfile} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Exercises" component={Exercises} />
      <Stack.Screen name="Consultations" component={Consultations} />
      <Stack.Screen name="Playlists" component={Playlists} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Nickname" component={Nickname} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
              <StatusBar barStyle="dark-content" />
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </View>
          </LanguageProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
