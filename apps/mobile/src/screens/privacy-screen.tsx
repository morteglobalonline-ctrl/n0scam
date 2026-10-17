import { View } from 'react-native';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { colors, spacing } from '@/theme';

const principles = [
  ['Minimum veri', 'Yalnızca seçtiğin analiz için gerekli içerik işlenir.'],
  ['Cihazda ön değerlendirme', 'Bu MVP’de URL ve mesaj kuralları cihaz üzerinde çalışır.'],
  ['Otomatik paylaşım yok', 'QR kodu veya bağlantı açık onayın olmadan çalıştırılmaz.'],
  ['Şeffaf durum', 'Doğrulanmamış entegrasyonlar aktif gösterilmez.'],
  ['Silme hakkı', 'Yerel analiz geçmişi tek tek, topluca veya Hesap ve Veriler ekranından temizlenebilir.'],
];

export default function PrivacyScreen() {
  return <Screen><View style={{ gap: spacing.sm }}><N0Text variant="heading">Mahremiyet ürünün temeli</N0Text><N0Text variant="body" style={{ color: colors.textSecondary }}>Koruma için daha fazla veriye değil, doğru anda gerekli olan en az veriye erişmeyi hedefliyoruz.</N0Text></View><Surface style={{ padding: 0 }}>{principles.map(([title, detail], index) => <View key={title} style={{ padding: spacing.lg, flexDirection: 'row', gap: spacing.md, borderBottomWidth: index < principles.length - 1 ? 1 : 0, borderBottomColor: colors.separator }}><N0Symbol name="checkmark.seal.fill" size={20} /><View style={{ flex: 1, gap: spacing.xs }}><N0Text variant="headline">{title}</N0Text><N0Text variant="small">{detail}</N0Text></View></View>)}</Surface><N0Text variant="caption">Bu metin ürün içi teknik özet niteliğindedir; yayımdan önce hukuk ve gizlilik incelemesi tamamlanacaktır.</N0Text></Screen>;
}
