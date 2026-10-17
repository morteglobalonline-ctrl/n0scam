import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { GroupedRow } from '@/components/grouped-row';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import NotificationSettingsScreen from '@/screens/notification-settings-screen';
import { colors, radius } from '@/theme';

const details = {
  account: { title: 'Hesap', icon: 'person.crop.circle.fill' as const, description: 'Bu prototip yerel bir geliştirme profili kullanıyor.', rows: [['Profil durumu', 'Yerel'], ['Oturum', 'Bağlı değil']] },
  notifications: { title: 'Bildirimler', icon: 'bell.fill' as const, description: 'Canlı bildirim altyapısı bağlandığında uyarı tercihlerin burada yönetilecek.', rows: [['Risk uyarıları', 'Yakında'], ['Koruma özeti', 'Yakında']] },
  language: { title: 'Dil', icon: 'globe' as const, description: 'İlk iOS sürümünün arayüz dili Türkçedir.', rows: [['Uygulama dili', 'Türkçe']] },
  appearance: { title: 'Görünüm', icon: 'moon.fill' as const, description: 'Marka kimliğine uygun koyu tema varsayılan görünüm olarak kullanılır.', rows: [['Tema', 'Koyu']] },
  support: { title: 'Destek', icon: 'questionmark.circle.fill' as const, description: 'Destek kanalı yayın öncesinde bağlanacak.', rows: [['Destek durumu', 'Hazırlanıyor']] },
  about: { title: 'Hakkında', icon: 'info.circle.fill' as const, description: 'n0scam, şüpheli içerikleri açmadan önce analitik işaretleri görünür kılar.', rows: [['Sürüm', '1.0.0'], ['Platform', 'iOS']] },
} as const;

export default function SettingDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  if (id === 'notifications') return <NotificationSettingsScreen />;
  const detail = details[id && id in details ? id as keyof typeof details : 'about'];
  return <Screen>
    <View style={{ alignItems: 'center', gap: 7, paddingTop: 12 }}><View style={{ width: 54, height: 54, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name={detail.icon} size={25} /></View><N0Text variant="title">{detail.title}</N0Text><N0Text variant="small" style={{ textAlign: 'center', maxWidth: 310 }}>{detail.description}</N0Text></View>
    <Surface style={{ padding: 0 }}>{detail.rows.map(([title, value], index) => <GroupedRow key={title} icon="checkmark.circle.fill" title={title} last={index === detail.rows.length - 1} trailing={<StatusPill tone={value === 'Yakında' || value === 'Hazırlanıyor' ? 'neutral' : 'brand'} label={value} />} />)}</Surface>
  </Screen>;
}
