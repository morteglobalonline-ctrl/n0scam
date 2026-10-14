import { router } from 'expo-router';
import { View } from 'react-native';
import { GroupedRow } from '@/components/grouped-row';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { protectionModules } from '@/domain/protection';
import { colors, radius, spacing } from '@/theme';

const iconFor = (id: string) => id === 'safari' ? 'safari' as const : id === 'sms' ? 'message.fill' as const : id === 'network' ? 'network' as const : 'envelope.fill' as const;

export default function ProtectionScreen() {
  return <Screen>
    <View style={{ alignItems: 'center', gap: 4, paddingTop: spacing.sm }}><View style={{ width: 46, height: 46, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="shield.lefthalf.filled" size={24} /></View><N0Text variant="title">Koruma Merkezi</N0Text><N0Text variant="small" style={{ textAlign: 'center' }}>Kanallarını bağla, izinleri ve kapsamı tek yerden gör.</N0Text></View>
    <Surface style={{ padding: 0 }}>{protectionModules.map((module, index) => <GroupedRow key={module.id} icon={iconFor(module.id)} title={module.name} detail={module.summary} last={index === protectionModules.length - 1} onPress={() => router.push({ pathname: '/module/[id]', params: { id: module.id } })} trailing={<StatusPill tone={module.state === 'NOT_SUPPORTED' ? 'danger' : 'neutral'} label={module.state === 'NOT_SUPPORTED' ? 'Yakında' : 'Bağla'} />} />)}</Surface>
    <View style={{ gap: 8 }}><N0Text variant="caption">AİLE KORUMASI</N0Text><Surface style={{ padding: 0 }}><GroupedRow icon="person.2.fill" title="Aile Koruması" detail="Yakınların için ortak koruma alanı." last trailing={<StatusPill tone="neutral" label="Yakında" />} /></Surface></View>
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Bir kanal canlı sağlık kontrolünden geçmeden “aktif” gösterilmez.</N0Text>
  </Screen>;
}
