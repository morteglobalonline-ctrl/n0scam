export const colors = {
  brand: '#00FF8A', brandPressed: '#00D977', brandMuted: '#063D2A', brandWash: '#031A11', background: '#000000',
  backgroundElevated: '#010806', surface: '#03100C', surfaceRaised: '#091713', text: '#FFFFFF',
  textSecondary: '#A1A1AA', textMuted: '#6B7270', separator: '#12382C', border: '#006C4C', danger: '#FF3B45',
  dangerMuted: '#33080C', warning: '#FF9F1C', warningMuted: '#342004', info: '#55C7FF',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 } as const;
export const shadows = { card: '0 8px 28px rgba(0, 255, 138, 0.045)', glow: '0 0 34px rgba(0, 255, 138, 0.30)', dangerGlow: '0 0 30px rgba(255, 59, 69, 0.22)' } as const;
export const fonts = { regular: 'Sora_400Regular', medium: 'Sora_500Medium', semibold: 'Sora_600SemiBold', bold: 'Sora_700Bold' } as const;
