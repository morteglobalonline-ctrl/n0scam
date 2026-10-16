import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { getMailConnectionHealth, protectionModules, stateLabel } from '@/domain/protection';
import { useMailProtectionStatuses } from '@/hooks/use-mail-protection';
import { useSmsProtectionHeartbeat } from '@/hooks/use-sms-protection';
import { colors, radius, spacing } from '@/theme';

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const smsHeartbeat = useSmsProtectionHeartbeat();
  const mailStatuses = useMailProtectionStatuses();
  const module = protectionModules.find((item) => item.id === id) ?? protectionModules[0];
  const smsVerified = module.id === 'sms' && smsHeartbeat?.fresh;
  const mailStatus = module.id === 'gmail' ? mailStatuses.gmail : module.id === 'outlook' ? mailStatuses.outlook : null;
  const mailHealth = getMailConnectionHealth(mailStatus);
  const verified = Boolean(smsVerified) || mailHealth === 'VERIFIED';
  const degraded = mailHealth === 'DEGRADED';
  const mailConnected = mailStatus?.state === 'CONNECTED' || mailStatus?.state === 'DEGRADED';
  return <Screen><View style={{ alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg }}><View style={{ width: 72, height: 72, borderRadius: radius.full, backgroundColor: colors.brandMuted, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="shield" size={34} /></View><N0Text variant="heading" style={{ textAlign: 'center' }}>{module.name}</N0Text><StatusPill tone={verified ? 'brand' : degraded || module.state !== 'NOT_SUPPORTED' ? 'warning' : 'danger'} label={smsVerified ? 'Son olay doğrulandı' : mailHealth === 'VERIFIED' ? 'Bağlı' : degraded ? 'Kontrol gerekli' : stateLabel[module.state]} /></View>{module.id === 'sms' && smsHeartbeat ? <Surface style={{ gap: spacing.sm, borderColor: smsHeartbeat.fresh ? colors.brand : colors.warning }}><N0Text variant="headline">Son cihaz sinyali</N0Text><N0Text variant="body" style={{ color: colors.text }}>{new Date(smsHeartbeat.lastEvaluatedAt).toLocaleString('tr-TR')}</N0Text><N0Text variant="small">Bu sinyal, iOS’un Message Filter uzantısını en az bir bilinmeyen gönderici mesajı için çalıştırdığını doğrular. Mesaj gövdesi veya gönderen saklanmaz. Apple mevcut aç/kapa iznini uygulamaya sunmadığı için tek başına “aktif” iddiası değildir.</N0Text></Surface> : null}{mailConnected ? <Surface style={{ gap: spacing.sm, borderColor: verified ? colors.brand : colors.warning }}><N0Text variant="headline">Bağlı hesap</N0Text><N0Text variant="body" style={{ color: colors.text }}>{mailStatus.accountLabel}</N0Text><N0Text variant="small">Son sağlık kontrolü: {mailStatus.lastHealthCheckAt ? new Date(mailStatus.lastHealthCheckAt).toLocaleString('tr-TR') : 'Henüz doğrulanmadı'}</N0Text></Surface> : <Surface style={{ gap: spacing.sm }}><N0Text variant="headline">Mevcut kapsam</N0Text><N0Text variant="body" style={{ color: colors.textSecondary }}>{module.coverage}</N0Text></Surface>}{module.id === 'gmail' ? <ActionButton title="Gmail Bağlantısını Yönet" onPress={() => router.push('/gmail-connection')} /> : null}{module.id === 'outlook' ? <ActionButton title="Outlook Bağlantısını Yönet" onPress={() => router.push('/outlook-connection')} /> : null}{!verified ? <Surface style={{ gap: spacing.sm }}><N0Text variant="headline">Neden aktif değil?</N0Text><N0Text variant="body" style={{ color: colors.textSecondary }}>{module.summary} Gerekli izin, entegrasyon, taze sağlık kontrolü ve başarılı test olayı olmadan bu modül ACTIVE gösterilmez.</N0Text></Surface> : null}{module.setupSteps ? <Surface style={{ gap: spacing.md }}><N0Text variant="headline">Fiziksel iPhone doğrulaması</N0Text>{module.setupSteps.map((step, index) => <View key={step} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}><View style={{ width: 24, height: 24, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Text variant="caption" style={{ color: colors.brand }}>{index + 1}</N0Text></View><N0Text variant="small" style={{ flex: 1, color: colors.text }}>{step}</N0Text></View>)}</Surface> : null}{!verified ? <Surface style={{ gap: spacing.sm, backgroundColor: colors.warningMuted }}><N0Text variant="headline" style={{ color: colors.warning }}>Geliştirme kapısı</N0Text><N0Text variant="small">Bu modül imzalı cihaz testi ve başarılı doğrulama olayı olmadan aktif gösterilmez. Uygulama bu aşamada sahte bağlantı veya başarı durumu üretmez.</N0Text></Surface> : null}</Screen>;
}
