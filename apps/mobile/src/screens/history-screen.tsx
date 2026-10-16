import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import type { HistoryKind, HistoryRecord } from '@/domain/history';
import { deleteHistoryRecord, listHistoryRecords } from '@/services/history-store';
import { colors, radius } from '@/theme';

const filters = ['Tümü', 'Link', 'QR', 'Mesaj', 'E-posta'] as const;
const filterKind: Record<(typeof filters)[number], HistoryKind | undefined> = { Tümü: undefined, Link: 'LINK', QR: 'QR', Mesaj: 'MESSAGE', 'E-posta': 'EMAIL' };

const kindLabel: Record<HistoryKind, string> = { LINK: 'Link', QR: 'QR', MESSAGE: 'Mesaj', EMAIL: 'E-posta' };

function recordPalette(record: HistoryRecord) {
  if (record.verdict === 'BLOCK') return { color: colors.danger, background: colors.dangerMuted, icon: 'exclamationmark.triangle.fill' as const, label: 'Yüksek risk' };
  if (record.verdict === 'WARN') return { color: colors.warning, background: colors.warningMuted, icon: 'exclamationmark.circle.fill' as const, label: 'Orta risk' };
  return { color: colors.brand, background: colors.brandWash, icon: 'questionmark.circle.fill' as const, label: 'Doğrulanamadı' };
}

export default function HistoryScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<(typeof filters)[number]>('Tümü');
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRecords(await listHistoryRecords(db, filterKind[filter]));
      setError(null);
    } catch {
      setError('Geçmiş cihazdan okunamadı.');
    } finally {
      setLoading(false);
    }
  }, [db, filter]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const confirmDelete = (record: HistoryRecord) => Alert.alert('Kaydı kaldır?', 'Bu analiz özeti yalnızca bu cihazdaki geçmişten silinecek.', [
    { text: 'Vazgeç', style: 'cancel' },
    { text: 'Sil', style: 'destructive', onPress: () => { void deleteHistoryRecord(db, record.id).then(load); } },
  ]);

  return <Screen contentContainerStyle={{ minHeight: '100%', paddingTop: insets.top + 12, gap: 18 }}>
    <N0Text variant="title" style={{ fontSize: 27 }}>Geçmiş</N0Text>
    <View style={{ flexDirection: 'row', gap: 7 }}>{filters.map((label) => <Pressable key={label} onPress={() => setFilter(label)} accessibilityRole="button" accessibilityState={{ selected: filter === label }} style={({ pressed }) => ({ flex: 1, minHeight: 41, borderRadius: radius.md, borderCurve: 'continuous', borderWidth: filter === label ? 1.5 : 1, borderColor: filter === label ? colors.brand : colors.separator, backgroundColor: filter === label ? colors.brandWash : colors.surface, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.62 : 1 })}><N0Text variant="small" style={{ color: filter === label ? colors.text : colors.textSecondary, fontFamily: filter === label ? 'Sora_600SemiBold' : 'Sora_400Regular', fontSize: 10.5 }}>{label}</N0Text></Pressable>)}</View>
    {loading ? <View style={{ minHeight: 360, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.brand} /></View> : error ? <Surface style={{ alignItems: 'center', gap: 10 }}><N0Symbol name="exclamationmark.circle.fill" size={32} tintColor={colors.danger} /><N0Text variant="small" style={{ color: colors.danger }}>{error}</N0Text><Pressable onPress={() => void load()}><N0Text variant="headline" style={{ color: colors.brand }}>Yeniden Dene</N0Text></Pressable></Surface> : records.length ? <View style={{ gap: 9 }}>{records.map((record) => { const palette = recordPalette(record); const date = new Date(record.createdAt); return <Surface key={record.id} style={{ minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 14 }}><View style={{ width: 45, height: 45, borderRadius: radius.full, backgroundColor: palette.background, borderWidth: 1, borderColor: palette.color, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name={palette.icon} size={22} tintColor={palette.color} /></View><View style={{ flex: 1, gap: 3 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}><N0Text variant="headline" numberOfLines={1} style={{ flexShrink: 1, fontSize: 13.5 }}>{record.label}</N0Text><N0Text variant="caption" style={{ color: palette.color }}>{palette.label}</N0Text></View><N0Text variant="small">{kindLabel[record.kind]} · {record.evidenceCount} işaret</N0Text><N0Text variant="caption" style={{ fontVariant: ['tabular-nums'] }}>{date.toLocaleDateString('tr-TR')} · {date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</N0Text></View><Pressable onPress={() => confirmDelete(record)} hitSlop={10} accessibilityRole="button" accessibilityLabel={`${record.label} kaydının menüsü`}><N0Symbol name="ellipsis" size={22} tintColor={colors.textSecondary} /></Pressable></Surface>; })}<N0Text variant="caption" style={{ textAlign: 'center', paddingTop: 5 }}>Ham mesajlar ve tam bağlantılar kaydedilmez. En fazla 200 özet yalnızca bu cihazda tutulur.</N0Text></View> : <View style={{ flex: 1, minHeight: 430, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 }}><Surface style={{ width: '100%', alignItems: 'center', gap: 12, paddingVertical: 30 }}><View style={{ width: 64, height: 64, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name={filter === 'Tümü' ? 'clock' : filter === 'Link' ? 'link' : filter === 'QR' ? 'qrcode.viewfinder' : filter === 'Mesaj' ? 'message.fill' : 'envelope.fill'} size={29} /></View><N0Text variant="heading">Henüz {filter === 'Tümü' ? 'analiz kaydı' : filter.toLocaleLowerCase('tr-TR') + ' kaydı'} yok</N0Text><N0Text variant="small" style={{ maxWidth: 280, textAlign: 'center' }}>Saklamayı seçtiğiniz gerçek analizler tarih ve risk durumlarıyla burada listelenecek.</N0Text></Surface></View>}
  </Screen>;
}
