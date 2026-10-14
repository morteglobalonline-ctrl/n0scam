import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { colors, radius } from '@/theme';

const filters = ['Tümü', 'Link', 'QR', 'Mesaj', 'E-posta'] as const;

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<(typeof filters)[number]>('Tümü');
  return <Screen contentContainerStyle={{ minHeight: '100%', paddingTop: insets.top + 12, gap: 18 }}>
    <N0Text variant="title" style={{ fontSize: 27 }}>Geçmiş</N0Text>
    <View style={{ flexDirection: 'row', gap: 7 }}>{filters.map((label) => <Pressable key={label} onPress={() => setFilter(label)} accessibilityRole="button" accessibilityState={{ selected: filter === label }} style={({ pressed }) => ({ flex: 1, minHeight: 41, borderRadius: radius.md, borderCurve: 'continuous', borderWidth: filter === label ? 1.5 : 1, borderColor: filter === label ? colors.brand : colors.separator, backgroundColor: filter === label ? colors.brandWash : colors.surface, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.62 : 1 })}><N0Text variant="small" style={{ color: filter === label ? colors.text : colors.textSecondary, fontFamily: filter === label ? 'Sora_600SemiBold' : 'Sora_400Regular', fontSize: 10.5 }}>{label}</N0Text></Pressable>)}</View>
    <View style={{ flex: 1, minHeight: 430, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 }}><Surface style={{ width: '100%', alignItems: 'center', gap: 12, paddingVertical: 30 }}><View style={{ width: 64, height: 64, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name={filter === 'Tümü' ? 'clock' : filter === 'Link' ? 'link' : filter === 'QR' ? 'qrcode.viewfinder' : filter === 'Mesaj' ? 'message.fill' : 'envelope.fill'} size={29} /></View><N0Text variant="heading">Henüz {filter === 'Tümü' ? 'analiz kaydı' : filter.toLocaleLowerCase('tr-TR') + ' kaydı'} yok</N0Text><N0Text variant="small" style={{ maxWidth: 280, textAlign: 'center' }}>Saklamayı seçtiğiniz gerçek analizler tarih ve risk durumlarıyla burada listelenecek.</N0Text></Surface></View>
  </Screen>;
}
