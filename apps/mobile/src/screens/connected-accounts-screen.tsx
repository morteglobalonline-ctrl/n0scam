import { router } from 'expo-router';
import { View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { VendorIcon } from '@/components/vendor-icon';
import { getMailConnectionHealth } from '@/domain/protection';
import { useMailProtectionStatuses } from '@/hooks/use-mail-protection';
import { connectorApi, type MailConnectionStatus } from '@/services/connector-api';
import { colors, radius } from '@/theme';

function statusFor(value: MailConnectionStatus | null) {
  if (!connectorApi.configured) return { label: 'Servis gerekli', tone: 'neutral' as const, detail: 'Güvenli OAuth bağlantı servisi bu sürümde yapılandırılmamış.' };
  const health = getMailConnectionHealth(value);
  if (health === 'VERIFIED' && value && value.state !== 'DISCONNECTED') return { label: 'Bağlı', tone: 'brand' as const, detail: value.accountLabel };
  if (health === 'DEGRADED' && value && value.state !== 'DISCONNECTED') return { label: 'Kontrol gerekli', tone: 'warning' as const, detail: value.accountLabel };
  return { label: 'Bağlı değil', tone: 'neutral' as const, detail: 'Hesap erişimi verilmedi.' };
}

export default function ConnectedAccountsScreen() {
  const statuses = useMailProtectionStatuses();
  const accounts = [
    { id: 'gmail', name: 'Gmail', vendor: 'gmail' as const, status: statusFor(statuses.gmail), route: '/gmail-connection' as const },
    { id: 'outlook', name: 'Outlook', vendor: 'outlook' as const, status: statusFor(statuses.outlook), route: '/outlook-connection' as const },
  ];

  return <Screen contentContainerStyle={{ gap: 14 }}>
    <View style={{ alignItems: 'center', gap: 7, paddingTop: 12 }}><View style={{ width: 54, height: 54, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="person.2.fill" size={25} /></View><N0Text variant="title">Bağlı Hesaplar</N0Text><N0Text variant="small" style={{ textAlign: 'center', maxWidth: 340 }}>E-posta sağlayıcı erişimlerini ve doğrulanmış bağlantı durumlarını yönetin.</N0Text></View>
    {accounts.map((account) => <Surface key={account.id} style={{ gap: 13 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><VendorIcon vendor={account.vendor} size={47} /><View style={{ flex: 1, gap: 3 }}><N0Text variant="headline">{account.name}</N0Text><N0Text variant="small" numberOfLines={2}>{account.status.detail}</N0Text></View><StatusPill label={account.status.label} tone={account.status.tone} /></View><ActionButton title={`${account.name} Bağlantısını Yönet`} variant="secondary" onPress={() => router.push(account.route)} /></Surface>)}
    <Surface style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: colors.surfaceRaised }}><N0Symbol name="lock.shield.fill" size={20} /><N0Text variant="caption" style={{ flex: 1 }}>Google veya Microsoft parolanız uygulamaya girilmez. Bağlantı ancak sağlayıcının sistem onayı, backend sağlık kontrolü ve geçerli OAuth durumu birlikte doğrulandığında “Bağlı” gösterilir.</N0Text></Surface>
  </Screen>;
}
