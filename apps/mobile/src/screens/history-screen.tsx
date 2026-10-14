import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { GroupedRow } from '@/components/grouped-row';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { colors, spacing } from '@/theme';

const samples = [
  { icon: 'link' as const, title: 'Şüpheli bağlantı örneği', detail: 'Bugün, 14:32 • Yüksek risk', tone: 'danger' as const, label: 'DEMO', group: 'Riskli' },
  { icon: 'text.bubble.fill' as const, title: 'Teslimat mesajı örneği', detail: 'Dün, 18:05 • Dikkat', tone: 'danger' as const, label: 'DEMO', group: 'Riskli' },
  { icon: 'qrcode.viewfinder' as const, title: 'Etkinlik QR örneği', detail: '12 Eki, 09:41 • Doğrulanamadı', tone: 'neutral' as const, label: 'DEMO', group: 'Güvenli' },
];

export default function HistoryScreen() {
  const [filter, setFilter] = useState('Tümü');
  const visibleSamples = filter === 'Tümü' ? samples : samples.filter((item) => item.group === filter);
  return <Screen>
    <View style={{ gap: 3, paddingTop: spacing.sm }}><N0Text variant="title">Geçmiş</N0Text><N0Text variant="small">Saklamayı seçtiğin analizler burada görünür.</N0Text></View>
    <View style={{ flexDirection: 'row', gap: 6 }}>{['Tümü', 'Riskli', 'Güvenli'].map((label) => <Pressable key={label} onPress={() => setFilter(label)} accessibilityRole="button" accessibilityState={{ selected: filter === label }} style={({ pressed }) => ({ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: filter === label ? colors.brand : colors.separator, backgroundColor: filter === label ? colors.brandWash : colors.surface, opacity: pressed ? 0.65 : 1 })}><N0Text variant="caption" style={{ color: filter === label ? colors.brand : colors.textSecondary }}>{label}</N0Text></Pressable>)}</View>
    <View style={{ gap: 8 }}><N0Text variant="caption">TASARIM ÖNİZLEMESİ — GERÇEK KAYIT DEĞİL</N0Text><Surface style={{ padding: 0 }}>{visibleSamples.map((item, index) => <GroupedRow key={item.title} icon={item.icon} iconTone={item.tone} title={item.title} detail={item.detail} last={index === visibleSamples.length - 1} trailing={<StatusPill tone={item.tone} label={item.label} />} />)}</Surface></View>
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Gerçek geçmiş yalnızca açık saklama tercihiyle oluşturulacak.</N0Text>
  </Screen>;
}
