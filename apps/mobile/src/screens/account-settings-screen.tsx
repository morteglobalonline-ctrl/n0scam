import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { clearHistoryRecords, countHistoryRecords } from '@/services/history-store';
import { disableWeeklyProtectionReminder, getLocalNotificationState } from '@/services/local-notifications';
import { colors, radius } from '@/theme';

type LocalDataState = { historyCount: number; reminderEnabled: boolean };

export default function AccountSettingsScreen() {
  const db = useSQLiteContext();
  const [state, setState] = useState<LocalDataState>({ historyCount: 0, reminderEnabled: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [historyCount, reminder] = await Promise.all([countHistoryRecords(db), getLocalNotificationState()]);
      setState({ historyCount, reminderEnabled: reminder.enabled });
      setError(null);
    } catch { setError('Yerel veri durumu okunamadı.'); }
    finally { setLoading(false); }
  }, [db]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const clearLocalData = () => Alert.alert('Yerel veriler temizlensin mi?', 'Analiz geçmişi ve haftalık hatırlatıcı bu cihazdan kaldırılacak. Bağlı e-posta hesapları etkilenmeyecek.', [
    { text: 'Vazgeç', style: 'cancel' },
    { text: 'Verileri Temizle', style: 'destructive', onPress: () => {
      setLoading(true);
      setError(null);
      void Promise.all([clearHistoryRecords(db), disableWeeklyProtectionReminder()])
        .then(() => load())
        .catch(() => { setError('Yerel verilerin tamamı temizlenemedi. Lütfen yeniden deneyin.'); setLoading(false); });
    } },
  ]);

  const hasLocalData = state.historyCount > 0 || state.reminderEnabled;
  return <Screen contentContainerStyle={{ gap: 14 }}>
    <View style={{ alignItems: 'center', gap: 7, paddingTop: 12 }}><View style={{ width: 58, height: 58, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="person.crop.circle.fill" size={28} /></View><N0Text variant="title">Hesap ve Veriler</N0Text><N0Text variant="small" style={{ textAlign: 'center', maxWidth: 330 }}>Bu geliştirme sürümünde oturum açılmış bir n0scam hesabı bulunmuyor.</N0Text></View>
    <Surface style={{ gap: 12 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><N0Text variant="small">Hesap durumu</N0Text><StatusPill label="Oturum yok" tone="neutral" /></View><View style={{ height: 1, backgroundColor: colors.separator }} /><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><N0Text variant="small">Yerel analiz özeti</N0Text><N0Text variant="headline" style={{ color: colors.text }}>{loading ? '…' : state.historyCount}</N0Text></View><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><N0Text variant="small">Haftalık hatırlatıcı</N0Text><StatusPill label={state.reminderEnabled ? 'Açık' : 'Kapalı'} tone={state.reminderEnabled ? 'brand' : 'neutral'} /></View></Surface>
    <Surface style={{ gap: 8, backgroundColor: colors.surfaceRaised }}><N0Text variant="headline">Cihaz verisi kontrolü</N0Text><N0Text variant="small">Bu işlem yalnızca n0scam’in cihazda sakladığı redakte geçmişi ve yerel hatırlatıcıyı temizler. Gmail veya Outlook bağlantısını kaldırmak için Bağlı Hesaplar ekranını kullanın.</N0Text></Surface>
    <ActionButton title={hasLocalData ? 'Yerel Verileri Temizle' : 'Temizlenecek Yerel Veri Yok'} variant="danger" disabled={!hasLocalData} loading={loading} onPress={clearLocalData} />
    {error ? <N0Text variant="small" style={{ color: colors.danger, textAlign: 'center' }}>{error}</N0Text> : null}
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Sunucu hesabı oluşturulmadığı için bu ekranda yanıltıcı bir hesap silme işlemi gösterilmez.</N0Text>
  </Screen>;
}
