import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { protectionModules, stateLabel } from '@/domain/protection';
import { colors, spacing } from '@/theme';

export default function ProtectionScreen() {
  return <Screen><View style={{ paddingTop: spacing.xl, gap: spacing.sm }}><N0Text variant="title">Koruma Merkezi</N0Text><N0Text variant="body" style={{ color: colors.textSecondary }}>Her kanal ayrı kurulur ve canlı sağlık kontrolünden geçmeden aktif sayılmaz.</N0Text></View><Surface style={{ gap: spacing.sm, backgroundColor: colors.warningMuted }}><N0Text variant="headline" style={{ color: colors.warning }}>Otomatik koruma kapalı</N0Text><N0Text variant="small">Bu erken sürüm manuel QR, link ve mesaj ön değerlendirmesi sunuyor. Safari, e-posta, SMS ve ağ entegrasyonları henüz doğrulanmadı.</N0Text></Surface><View style={{ gap: spacing.md }}>{protectionModules.map((module) => <Pressable key={module.id} onPress={() => router.push({ pathname: '/module/[id]', params: { id: module.id } })}><Surface style={{ gap: spacing.md }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}><N0Symbol name="shield" /><View style={{ flex: 1 }}><N0Text variant="headline">{module.name}</N0Text><N0Text variant="caption">{module.summary}</N0Text></View><StatusPill tone={module.state === 'NOT_SUPPORTED' ? 'danger' : 'neutral'} label={stateLabel[module.state]} /></View><N0Text variant="small">Kapsam: {module.coverage}</N0Text></Surface></Pressable>)}</View></Screen>;
}
