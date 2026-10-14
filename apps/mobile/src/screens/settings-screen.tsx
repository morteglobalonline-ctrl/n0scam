import { router } from 'expo-router';
import { View } from 'react-native';
import { GroupedRow } from '@/components/grouped-row';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { colors, radius, spacing } from '@/theme';

const rows = [
  { id: 'account', title: 'Hesap', detail: 'Profil ve hesap işlemleri', icon: 'person.crop.circle.fill' as const },
  { id: 'connections', title: 'Bağlı Hesaplar', detail: 'E-posta ve tarayıcı bağlantıları', icon: 'link' as const },
  { id: 'privacy', title: 'Gizlilik ve Veri', detail: 'İzinler, saklama ve veri kullanımı', icon: 'hand.raised.fill' as const },
  { id: 'notifications', title: 'Bildirimler', detail: 'Uyarı tercihleri', icon: 'bell.fill' as const },
  { id: 'language', title: 'Dil', detail: 'Türkçe', icon: 'globe' as const },
  { id: 'appearance', title: 'Görünüm', detail: 'Koyu tema', icon: 'moon.fill' as const },
  { id: 'support', title: 'Destek', detail: 'Yardım ve geri bildirim', icon: 'questionmark.circle.fill' as const },
  { id: 'about', title: 'Hakkında', detail: 'n0scam iOS geliştirme sürümü', icon: 'info.circle.fill' as const },
];

export default function SettingsScreen() {
  return <Screen>
    <View style={{ gap: 3, paddingTop: spacing.sm }}><N0Text variant="title">Ayarlar</N0Text><N0Text variant="small">Hesap, gizlilik ve uygulama tercihleri</N0Text></View>
    <Surface style={{ padding: 0 }}><GroupedRow icon="person.crop.circle.fill" title="n0scam Kullanıcısı" detail="Yerel geliştirme profili" onPress={() => router.push({ pathname: '/setting/[id]', params: { id: 'account' } })} trailing={<View style={{ width: 29, height: 29, borderRadius: radius.full, backgroundColor: colors.brandMuted, alignItems: 'center', justifyContent: 'center' }}><N0Text variant="headline" style={{ color: colors.brand }}>N</N0Text></View>} />{rows.map((row, index) => <GroupedRow key={row.title} icon={row.icon} title={row.title} detail={row.detail} last={index === rows.length - 1} onPress={() => row.id === 'connections' ? router.push('/protection') : row.id === 'privacy' ? router.push('/privacy') : router.push({ pathname: '/setting/[id]', params: { id: row.id } })} />)}</Surface>
    <Surface style={{ padding: 0 }}><GroupedRow icon="crown.fill" title="n0scam Pro" detail="Gelişmiş koruma özellikleri" last onPress={() => router.push('/pro')} trailing={<StatusPill tone="brand" label="Yakında" />} /></Surface>
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Sürüm 1.0.0 • iOS geliştirme yapısı</N0Text>
  </Screen>;
}
