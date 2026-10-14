export const colors = {
  brand: '#00FF8A', brandPressed: '#00D977', brandMuted: '#063D2A', brandWash: '#071A13', background: '#010504',
  backgroundElevated: '#050A08', surface: '#07100D', surfaceRaised: '#0A1712', text: '#F5FFF9',
  textSecondary: '#8A9892', textMuted: '#53615B', separator: '#153229', danger: '#FF4D57',
  dangerMuted: '#2A0A0D', warning: '#FFB020', warningMuted: '#2D2105', info: '#55C7FF',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 7, md: 10, lg: 13, xl: 20, full: 999 } as const;
export const shadows = { card: '0 8px 28px rgba(0, 255, 138, 0.035)', glow: '0 0 34px rgba(0, 255, 138, 0.22)' } as const;
export const fonts = { regular: 'Sora_400Regular', medium: 'Sora_500Medium', semibold: 'Sora_600SemiBold', bold: 'Sora_700Bold' } as const;
