import { Host, Switch } from '@expo/ui';
import { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import {
  disableWeeklyProtectionReminder,
  enableWeeklyProtectionReminder,
  getLocalNotificationState,
  type LocalNotificationState,
} from '@/services/local-notifications';
import { colors, radius } from '@/theme';

const initialState: LocalNotificationState = { enabled: false, permission: 'UNDETERMINED' };

export default function NotificationSettingsScreen() {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void getLocalNotificationState()
      .then((next) => { if (active) setState(next); })
      .catch(() => { if (active) setError('Bildirim durumu okunamadı.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const toggleReminder = async (enabled: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const next = enabled ? await enableWeeklyProtectionReminder() : await disableWeeklyProtectionReminder();
      setState(next);
      if (enabled && !next.enabled) setError('Bildirim izni verilmedi. İzni Sistem Ayarları üzerinden açabilirsiniz.');
    } catch {
      setError('Hatırlatıcı güncellenemedi. Lütfen yeniden deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const permissionLabel = state.permission === 'GRANTED' ? 'İzin verildi' : state.permission === 'DENIED' ? 'İzin kapalı' : 'Henüz sorulmadı';

  return <Screen contentContainerStyle={{ gap: 14 }}>
    <View style={{ alignItems: 'center', gap: 7, paddingTop: 12 }}><View style={{ width: 54, height: 54, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="bell.fill" size={25} /></View><N0Text variant="title">Bildirimler</N0Text><N0Text variant="small" style={{ textAlign: 'center', maxWidth: 330 }}>Yalnızca sizin açtığınız cihaz içi hatırlatıcıları yönetin.</N0Text></View>

    <Surface style={{ gap: 15 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><View style={{ flex: 1, gap: 4 }}><N0Text variant="headline">Haftalık koruma kontrolü</N0Text><N0Text variant="small">Her pazartesi 10:00’da modül durumlarını gözden geçirmeniz için cihazda hatırlatır.</N0Text></View><Host matchContents seedColor={colors.brand} colorScheme="dark"><Switch value={state.enabled} onValueChange={(value) => void toggleReminder(value)} disabled={loading} testID="weekly-protection-reminder" /></Host></View>
      <View style={{ height: 1, backgroundColor: colors.separator }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}><N0Text variant="small">Sistem bildirimi</N0Text><StatusPill tone={state.permission === 'GRANTED' ? 'brand' : 'neutral'} label={loading ? 'Kontrol ediliyor' : permissionLabel} /></View>
    </Surface>

    {state.permission === 'DENIED' ? <ActionButton title="Sistem Ayarlarını Aç" variant="secondary" onPress={() => void Linking.openSettings()} /> : null}
    {error ? <N0Text variant="small" style={{ color: colors.danger, textAlign: 'center' }}>{error}</N0Text> : null}
    <Surface style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 11, backgroundColor: colors.surfaceRaised }}><N0Symbol name="lock.shield.fill" size={21} /><N0Text variant="caption" style={{ flex: 1 }}>Hatırlatıcı yalnızca cihazınızda planlanır. URL, mesaj, e-posta veya analiz sonucu bildirim içeriğine eklenmez. Otomatik risk tespiti yaptığı anlamına gelmez.</N0Text></Surface>
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Risk sonuçları analitiktir, tavsiye değildir.</N0Text>
  </Screen>;
}
