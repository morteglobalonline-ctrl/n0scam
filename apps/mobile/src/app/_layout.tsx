import { Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold, useFonts } from '@expo-google-fonts/sora';
import { DarkTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { colors } from '@/theme';

void SplashScreen.preventAutoHideAsync();

const n0DarkTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, primary: colors.brand, background: colors.background, card: colors.background, text: colors.text, border: colors.separator, notification: colors.danger } };

export default function RootLayout() {
  const [loaded] = useFonts({ Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold });
  useEffect(() => { if (loaded) void SplashScreen.hideAsync(); }, [loaded]);
  if (!loaded) return null;
  return <ThemeProvider value={n0DarkTheme}><Stack screenOptions={{ contentStyle: { backgroundColor: colors.background }, headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text, headerShadowVisible: false, headerBackButtonDisplayMode: 'minimal', headerTitleStyle: { fontFamily: 'Sora_600SemiBold', fontSize: 14 } }}><Stack.Screen name="(tabs)" options={{ headerShown: false }} /><Stack.Screen name="link-analysis" options={{ title: 'Link Analiz Et' }} /><Stack.Screen name="qr-scanner" options={{ title: 'QR Kod Tara', headerTransparent: true }} /><Stack.Screen name="message-analysis" options={{ title: 'Mesaj / E-posta Kontrol Et' }} /><Stack.Screen name="risk-result" options={{ title: 'Detaylı Sonuç' }} /><Stack.Screen name="module/[id]" options={{ title: 'Koruma Modülü' }} /><Stack.Screen name="setting/[id]" options={{ title: 'Ayar' }} /><Stack.Screen name="privacy" options={{ title: 'Gizlilik' }} /><Stack.Screen name="pro" options={{ title: 'n0scam Pro' }} /></Stack></ThemeProvider>;
}
