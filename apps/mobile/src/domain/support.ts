export const incidentSteps = [
  { title: 'Ödemeyi durdurun', detail: 'Banka veya kart sağlayıcınıza yalnızca resmi uygulama ya da kartın üzerindeki numara üzerinden hemen ulaşın.' },
  { title: 'Hesabı güvene alın', detail: 'Resmi uygulamadan parolanızı değiştirin, açık oturumları kapatın ve iki aşamalı doğrulamayı açın.' },
  { title: 'Kanıtı koruyun', detail: 'Mesajı, gönderen bilgisini, tarih-saat ve işlem referansını silmeden ekran görüntüsü alın.' },
  { title: 'Aynı bilgiyi tekrar kullanmayın', detail: 'Paylaştığınız parola, kart bilgisi veya doğrulama kodunu başka hiçbir yerde kullanmayın.' },
] as const;

export function buildIncidentHelpSummary() {
  return [
    'n0scam olay yardım özeti',
    '',
    ...incidentSteps.map((step, index) => `${index + 1}. ${step.title}\n${step.detail}`),
    '',
    'Bu özet mesaj, bağlantı, hesap numarası veya kişisel veri içermez.',
    'Bilgiler genel güvenlik adımlarıdır; hukuki veya finansal tavsiye değildir.',
  ].join('\n\n');
}
