import '../global.css';

import React, { useEffect, useState, useCallback } from 'react';
import { View, Image } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { PaperProvider, MD3DarkTheme, MD3LightTheme, Text } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import useAuthStore from '../store/useAuthStore';

SplashScreen.preventAutoHideAsync();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#7C3AED',
    primaryContainer: '#EDE9FE',
    secondary: '#6D28D9',
    secondaryContainer: '#DDD6FE',
    surface: '#FFFFFF',
    background: '#F5F5F5',
  },
};

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const { isLoggedIn } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      setShowSplash(false);
      await SplashScreen.hideAsync();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showSplash) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments, showSplash]);

  if (showSplash) {
    return (
      <PaperProvider theme={theme}>
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#7C3AED' }}>
          <Image
            source={require('../assets/logo.png')}
            style={{ width: 150, height: 150, marginBottom: 24 }}
            resizeMode="contain"
          />
          <Text variant="headlineLarge" style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
            DataSocial
          </Text>
          <Text variant="bodyLarge" style={{ color: '#E0D4FF', marginTop: 8 }}>
            Conecta con tus intereses
          </Text>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Slot />
    </PaperProvider>
  );
}
