import { View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { GroupedRow } from '@/components/grouped-row';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { colors, radius, shadows } from '@/theme';

const features = [
  ['shield.fill', 'Gelişmiş Koruma', 'Daha fazla kanal ve ayrıntılı risk açıklamaları.'],
  ['envelope.fill', 'E-posta Bağlantıları', 'Desteklenen hesaplar için kurulum akışları.'],
  ['person.2.fill', 'Aile Koruması', 'Yakınların için ortak koruma alanı.'],
  ['clock.arrow.circlepath', 'Genişletilmiş Geçmiş', 'Açık saklama tercihiyle daha uzun kayıt.'],
] as const;

export default function ProScreen() {
  return <Screen>
    <View style={{ minHeight: 185, alignItems: 'center', justifyContent: 'center', gap: 7 }}><View style={{ position: 'absolute', width: 220, height: 220, borderRadius: radius.full, backgroundColor: 'rgba(0,255,138,0.035)' }} /><View style={{ width: 72, height: 72, borderRadius: radius.full, borderWidth: 1, borderColor: colors.brand, backgroundColor: colors.brandWash, alignItems: 'center', justifyContent: 'center', boxShadow: shadows.glow }}><N0Symbol name="crown.fill" size={34} /></View><N0Text variant="title"><N0Text variant="title" style={{ color: colors.brand }}>n0scam</N0Text> Pro</N0Text><N0Text variant="small" style={{ textAlign: 'center', maxWidth: 270 }}>Daha kapsamlı dijital koruma için hazırlanan iOS paketi.</N0Text></View>
    <Surface style={{ padding: 0 }}>{features.map(([icon, title, detail], index) => <GroupedRow key={title} icon={icon} title={title} detail={detail} last={index === features.length - 1} />)}</Surface>
    <ActionButton title="Pro yakında" onPress={() => {}} disabled />
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Abonelik henüz satışa açık değildir. Yayınlandığında Apple uygulama içi satın alma üzerinden sunulacaktır.</N0Text>
  </Screen>;
}
