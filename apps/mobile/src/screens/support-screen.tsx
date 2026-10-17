import { Share, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { buildIncidentHelpSummary, incidentSteps } from '@/domain/support';
import { colors, radius } from '@/theme';

export default function SupportScreen() {
  const shareHelp = async () => {
    try { await Share.share({ title: 'n0scam olay yardım özeti', message: buildIncidentHelpSummary() }); }
    catch { /* The system share sheet can be dismissed without changing app state. */ }
  };
  return <Screen contentContainerStyle={{ gap: 14 }}>
    <View style={{ alignItems: 'center', gap: 7, paddingTop: 12 }}><View style={{ width: 58, height: 58, borderRadius: radius.full, backgroundColor: colors.dangerMuted, borderWidth: 1, borderColor: colors.danger, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="exclamationmark.triangle.fill" size={28} tintColor={colors.danger} /></View><N0Text variant="title" style={{ textAlign: 'center' }}>Şüpheli İşlem Yardımı</N0Text><N0Text variant="small" style={{ textAlign: 'center', maxWidth: 340 }}>Para gönderdiyseniz veya bilgi paylaştıysanız beklemeden resmi kanallardan harekete geçin.</N0Text></View>
    <Surface style={{ padding: 0 }}>{incidentSteps.map((step, index) => <View key={step.title} style={{ flexDirection: 'row', gap: 12, padding: 15, borderBottomWidth: index === incidentSteps.length - 1 ? 0 : 1, borderBottomColor: colors.separator }}><View style={{ width: 29, height: 29, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Text variant="caption" style={{ color: colors.brand }}>{index + 1}</N0Text></View><View style={{ flex: 1, gap: 4 }}><N0Text variant="headline">{step.title}</N0Text><N0Text variant="small">{step.detail}</N0Text></View></View>)}</Surface>
    <ActionButton title="Yardım Özetini Paylaş" onPress={() => void shareHelp()} />
    <Surface style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: colors.warningMuted }}><N0Symbol name="lock.shield.fill" size={20} tintColor={colors.warning} /><N0Text variant="caption" style={{ flex: 1 }}>Paylaşılan özet kişisel veri, mesaj veya bağlantı içermez. Banka, platform ya da resmi makama yalnızca doğruladığınız iletişim kanalından ulaşın.</N0Text></Surface>
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Bu adımlar genel bilgilendirmedir; hukuki veya finansal tavsiye değildir.</N0Text>
  </Screen>;
}
