import { Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold, useFonts } from '@expo-google-fonts/sora';
import { DarkTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect } from 'react';
import { initializeHistoryStore } from '@/services/history-store';
import { colors } from '@/theme';

void SplashScreen.preventAutoHideAsync();

const n0DarkTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, primary: colors.brand, background: colors.background, card: colors.background, text: colors.text, border: colors.separator, notification: colors.danger } };

export default function RootLayout() {
  const [loaded] = useFonts({ Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold });
  useEffect(() => { if (loaded) void SplashScreen.hideAsync(); }, [loaded]);
  if (!loaded) return null;
  return <SQLiteProvider databaseName="n0scam-local.db" onInit={initializeHistoryStore}><ThemeProvider value={n0DarkTheme}><Stack initialRouteName="welcome" screenOptions={{ contentStyle: { backgroundColor: colors.background }, headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text, headerShadowVisible: false, headerBackButtonDisplayMode: 'minimal', headerTitleStyle: { fontFamily: 'Sora_600SemiBold', fontSize: 18 } }}><Stack.Screen name="welcome" options={{ headerShown: false }} /><Stack.Screen name="(tabs)" options={{ headerShown: false }} /><Stack.Screen name="link-analysis" options={{ title: 'Link Analizi' }} /><Stack.Screen name="qr-scanner" options={{ headerShown: false }} /><Stack.Screen name="message-analysis" options={{ title: 'Mesaj / E-posta Kontrolü' }} /><Stack.Screen name="risk-result" options={{ title: 'Analiz Sonucu' }} /><Stack.Screen name="module/[id]" options={{ title: 'Koruma Modülü' }} /><Stack.Screen name="gmail-connection" options={{ title: 'Gmail Bağlantısı' }} /><Stack.Screen name="setting/[id]" options={{ title: 'Ayar' }} /><Stack.Screen name="privacy" options={{ title: 'Gizlilik' }} /><Stack.Screen name="pro" options={{ title: 'n0scam Pro' }} /></Stack></ThemeProvider></SQLiteProvider>;
}
