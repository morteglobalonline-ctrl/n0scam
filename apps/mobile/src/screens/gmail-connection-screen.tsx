import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { connectorApi, ConnectorApiError, type GmailConnectionStatus } from '@/services/connector-api';
import { connectGmail } from '@/services/gmail-oauth';
import { colors, radius, spacing } from '@/theme';

function readableError(cause: unknown) {
  if (cause instanceof ConnectorApiError) return cause.message;
  return 'Gmail bağlantısı tamamlanamadı. Daha sonra yeniden deneyebilirsiniz.';
}

export default function GmailConnectionScreen() {
  const [status, setStatus] = useState<GmailConnectionStatus | null>(null);
  const [loading, setLoading] = useState(connectorApi.configured);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!connectorApi.configured) { setLoading(false); return; }
    setLoading(true);
    try { setStatus(await connectorApi.getGmailStatus()); setError(null); }
    catch (cause) { setError(readableError(cause)); }
    finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const connect = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await connectGmail();
      if (result.type === 'connected') setStatus(result.status);
    } catch (cause) { setError(readableError(cause)); }
    finally { setActionLoading(false); }
  };

  const disconnect = () => Alert.alert('Gmail bağlantısını kaldır?', 'n0scam sunucusundaki Gmail yetkisi iptal edilecek. Yerel analiz geçmişiniz silinmez.', [
    { text: 'Vazgeç', style: 'cancel' },
    { text: 'Bağlantıyı Kaldır', style: 'destructive', onPress: () => { setActionLoading(true); void connectorApi.disconnectGmail().then(() => { setStatus({ state: 'DISCONNECTED' }); setError(null); }).catch((cause) => setError(readableError(cause))).finally(() => setActionLoading(false)); } },
  ]);

  const connected = status?.state === 'CONNECTED' || status?.state === 'DEGRADED';
  return <Screen contentContainerStyle={{ gap: spacing.lg }}>
    <View style={{ alignItems: 'center', gap: 10, paddingVertical: spacing.md }}><View style={{ width: 76, height: 76, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="envelope.fill" size={35} /></View><N0Text variant="heading">Gmail Koruması</N0Text><StatusPill tone={status?.state === 'CONNECTED' ? 'brand' : status?.state === 'DEGRADED' ? 'warning' : 'neutral'} label={status?.state === 'CONNECTED' ? 'Bağlı' : status?.state === 'DEGRADED' ? 'Kontrol gerekli' : 'Bağlı değil'} /></View>

    {connected ? <Surface style={{ gap: spacing.sm }}><N0Text variant="headline">Bağlı hesap</N0Text><N0Text variant="body" style={{ color: colors.text }}>{status.accountLabel}</N0Text><N0Text variant="small">Bağlantı: {new Date(status.connectedAt).toLocaleString('tr-TR')}</N0Text><N0Text variant="small">Son sağlık kontrolü: {status.lastHealthCheckAt ? new Date(status.lastHealthCheckAt).toLocaleString('tr-TR') : 'Henüz doğrulanmadı'}</N0Text></Surface> : null}

    <Surface style={{ gap: spacing.md }}><N0Text variant="headline">Nasıl çalışır?</N0Text><View style={{ gap: spacing.sm }}>{[
      'Google onayı sistem kimlik doğrulama penceresinde alınır.',
      'OAuth istemci sırrı ve yenileme belirteci uygulamaya girmez; sunucuda tutulur.',
      'Bağlantı ACTIVE sayılmadan önce taze sağlık kontrolü ve test olayı gerekir.',
      'E-posta içeriği kullanıcı açıklaması ve açık ürün amacı olmadan üçüncü tarafa gönderilmez.',
    ].map((item) => <View key={item} style={{ flexDirection: 'row', gap: 9 }}><N0Symbol name="checkmark.circle.fill" size={17} /><N0Text variant="small" style={{ flex: 1, color: colors.text }}>{item}</N0Text></View>)}</View></Surface>

    {!connectorApi.configured ? <Surface style={{ gap: 8, backgroundColor: colors.warningMuted, borderColor: colors.warning }}><N0Text variant="headline" style={{ color: colors.warning }}>Bağlantı servisi gerekli</N0Text><N0Text variant="small">Mobil OAuth akışı hazır; ancak güvenli sunucu uçları ve Google OAuth istemcisi henüz bu build’e bağlanmadı. Bu nedenle uygulama sahte hesap veya aktif durum üretmez.</N0Text></Surface> : null}
    {error ? <N0Text variant="small" style={{ color: colors.danger, textAlign: 'center' }}>{error}</N0Text> : null}
    {connected ? <ActionButton title="Gmail Bağlantısını Kaldır" variant="danger" onPress={disconnect} loading={actionLoading} /> : <ActionButton title="Gmail ile Güvenli Bağlan" onPress={() => void connect()} loading={loading || actionLoading} disabled={!connectorApi.configured} />}
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Google parolanız n0scam tarafından görülmez veya saklanmaz.</N0Text>
  </Screen>;
}
