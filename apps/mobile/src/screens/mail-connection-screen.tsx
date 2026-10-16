import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { connectorApi, ConnectorApiError, type MailConnectionStatus, type MailProvider } from '@/services/connector-api';
import { connectMail } from '@/services/mail-oauth';
import { colors, radius, spacing } from '@/theme';

const providerCopy = {
  gmail: { name: 'Gmail', icon: 'envelope.fill' as const, account: 'Google', server: 'Google OAuth' },
  outlook: { name: 'Outlook', icon: 'envelope.fill' as const, account: 'Microsoft', server: 'Microsoft Entra' },
};

function readableError(cause: unknown, providerName: string) {
  if (cause instanceof ConnectorApiError) return cause.message;
  return `${providerName} bağlantısı tamamlanamadı. Daha sonra yeniden deneyebilirsiniz.`;
}

export function MailConnectionScreen({ provider }: { provider: MailProvider }) {
  const copy = providerCopy[provider];
  const [status, setStatus] = useState<MailConnectionStatus | null>(null);
  const [loading, setLoading] = useState(connectorApi.configured);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!connectorApi.configured) { setLoading(false); return; }
    setLoading(true);
    try {
      setStatus(provider === 'gmail' ? await connectorApi.getGmailStatus() : await connectorApi.getOutlookStatus());
      setError(null);
    } catch (cause) { setError(readableError(cause, copy.name)); }
    finally { setLoading(false); }
  }, [copy.name, provider]);

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const connect = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await connectMail(provider);
      if (result.type === 'connected') setStatus(result.status);
    } catch (cause) { setError(readableError(cause, copy.name)); }
    finally { setActionLoading(false); }
  };

  const disconnect = () => Alert.alert(`${copy.name} bağlantısını kaldır?`, `n0scam sunucusundaki ${copy.name} yetkisi iptal edilecek. Yerel analiz geçmişiniz silinmez.`, [
    { text: 'Vazgeç', style: 'cancel' },
    { text: 'Bağlantıyı Kaldır', style: 'destructive', onPress: () => {
      setActionLoading(true);
      const request = provider === 'gmail' ? connectorApi.disconnectGmail() : connectorApi.disconnectOutlook();
      void request.then(() => { setStatus({ state: 'DISCONNECTED' }); setError(null); }).catch((cause) => setError(readableError(cause, copy.name))).finally(() => setActionLoading(false));
    } },
  ]);

  const connected = status?.state === 'CONNECTED' || status?.state === 'DEGRADED';
  return <Screen contentContainerStyle={{ gap: spacing.lg }}>
    <View style={{ alignItems: 'center', gap: 10, paddingVertical: spacing.md }}><View style={{ width: 76, height: 76, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name={copy.icon} size={35} /></View><N0Text variant="heading">{copy.name} Koruması</N0Text><StatusPill tone={status?.state === 'CONNECTED' ? 'brand' : status?.state === 'DEGRADED' ? 'warning' : 'neutral'} label={status?.state === 'CONNECTED' ? 'Bağlı' : status?.state === 'DEGRADED' ? 'Kontrol gerekli' : 'Bağlı değil'} /></View>

    {connected ? <Surface style={{ gap: spacing.sm }}><N0Text variant="headline">Bağlı hesap</N0Text><N0Text variant="body" style={{ color: colors.text }}>{status.accountLabel}</N0Text><N0Text variant="small">Bağlantı: {new Date(status.connectedAt).toLocaleString('tr-TR')}</N0Text><N0Text variant="small">Son sağlık kontrolü: {status.lastHealthCheckAt ? new Date(status.lastHealthCheckAt).toLocaleString('tr-TR') : 'Henüz doğrulanmadı'}</N0Text></Surface> : null}

    <Surface style={{ gap: spacing.md }}><N0Text variant="headline">Nasıl çalışır?</N0Text><View style={{ gap: spacing.sm }}>{[
      `${copy.account} onayı sistem kimlik doğrulama penceresinde alınır.`,
      'OAuth istemci sırrı ve yenileme belirteci uygulamaya girmez; sunucuda tutulur.',
      'Bağlantı ACTIVE sayılmadan önce taze sağlık kontrolü ve test olayı gerekir.',
      'E-posta içeriği kullanıcı açıklaması ve açık ürün amacı olmadan üçüncü tarafa gönderilmez.',
    ].map((item) => <View key={item} style={{ flexDirection: 'row', gap: 9 }}><N0Symbol name="checkmark.circle.fill" size={17} /><N0Text variant="small" style={{ flex: 1, color: colors.text }}>{item}</N0Text></View>)}</View></Surface>

    {!connectorApi.configured ? <Surface style={{ gap: 8, backgroundColor: colors.warningMuted, borderColor: colors.warning }}><N0Text variant="headline" style={{ color: colors.warning }}>Bağlantı servisi gerekli</N0Text><N0Text variant="small">Mobil OAuth akışı hazır; ancak güvenli sunucu uçları ve {copy.server} istemcisi henüz bu build’e bağlanmadı. Bu nedenle uygulama sahte hesap veya aktif durum üretmez.</N0Text></Surface> : null}
    {error ? <N0Text variant="small" style={{ color: colors.danger, textAlign: 'center' }}>{error}</N0Text> : null}
    {connected ? <ActionButton title={`${copy.name} Bağlantısını Kaldır`} variant="danger" onPress={disconnect} loading={actionLoading} /> : <ActionButton title={`${copy.name} ile Güvenli Bağlan`} onPress={() => void connect()} loading={loading || actionLoading} disabled={!connectorApi.configured} />}
    <N0Text variant="caption" style={{ textAlign: 'center' }}>{copy.account} parolanız n0scam tarafından görülmez veya saklanmaz.</N0Text>
  </Screen>;
}
