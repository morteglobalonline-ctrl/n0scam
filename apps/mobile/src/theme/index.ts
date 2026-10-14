export const colors = {
  brand: '#00FF8A', brandPressed: '#00D977', brandMuted: '#063D2A', background: '#000000',
  backgroundElevated: '#080C0B', surface: '#0F0F0F', surfaceRaised: '#151A18', text: '#FFFFFF',
  textSecondary: '#A1A1A1', textMuted: '#6F7774', separator: '#24302B', danger: '#FF453A',
  dangerMuted: '#3A0E0C', warning: '#FF9F0A', warningMuted: '#3A2604', info: '#64D2FF',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 } as const;
export const shadows = { card: '0 8px 24px rgba(0, 255, 138, 0.06)' } as const;
export const fonts = { regular: 'Sora_400Regular', medium: 'Sora_500Medium', semibold: 'Sora_600SemiBold', bold: 'Sora_700Bold' } as const;
