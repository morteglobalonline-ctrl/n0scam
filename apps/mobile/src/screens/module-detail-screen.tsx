import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { protectionModules, stateLabel } from '@/domain/protection';
import { colors, radius, spacing } from '@/theme';

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const module = protectionModules.find((item) => item.id === id) ?? protectionModules[0];
  return <Screen><View style={{ alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg }}><View style={{ width: 72, height: 72, borderRadius: radius.full, backgroundColor: colors.brandMuted, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="shield" size={34} /></View><N0Text variant="heading" style={{ textAlign: 'center' }}>{module.name}</N0Text><StatusPill tone={module.state === 'NOT_SUPPORTED' ? 'danger' : 'warning'} label={stateLabel[module.state]} /></View><Surface style={{ gap: spacing.sm }}><N0Text variant="headline">Mevcut kapsam</N0Text><N0Text variant="body" style={{ color: colors.textSecondary }}>{module.coverage}</N0Text></Surface><Surface style={{ gap: spacing.sm }}><N0Text variant="headline">Neden aktif değil?</N0Text><N0Text variant="body" style={{ color: colors.textSecondary }}>{module.summary} Gerekli izin, entegrasyon, taze sağlık kontrolü ve başarılı test olayı olmadan bu modül ACTIVE gösterilmez.</N0Text></Surface><Surface style={{ gap: spacing.sm, backgroundColor: colors.warningMuted }}><N0Text variant="headline" style={{ color: colors.warning }}>Geliştirme kapısı</N0Text><N0Text variant="small">Bu ekran gerçek bağlantı akışı hazır olduğunda izin, bağlanma, test ve yeniden yetkilendirme adımlarını barındıracak. Şu anda sahte bağlantı veya başarı durumu üretmez.</N0Text></Surface></Screen>;
}
