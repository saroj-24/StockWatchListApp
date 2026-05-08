export interface Theme {
  background: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  danger: string;
  dangerLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  inputBackground: string;
  tabBar: string;
  positive: string;
  positiveBackground: string;
  negative: string;
  negativeBackground: string;
  cardShadow: string;
  headerBackground: string;
  shimmer: string;
  overlay: string;
  chartLine: string;
  chartGrid: string;
}

export const lightTheme: Theme = {
  background: '#F4F6F8',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  primary: '#1B8A3C',
  primaryDark: '#145F2B',
  primaryLight: '#4CAF50',
  danger: '#D32F2F',
  dangerLight: '#EF5350',
  text: '#1A1A2E',
  textSecondary: '#4A4A6A',
  textMuted: '#9A9AB0',
  border: '#E8EAF0',
  inputBackground: '#F0F2F5',
  tabBar: '#FFFFFF',
  positive: '#1B8A3C',
  positiveBackground: '#E8F5E9',
  negative: '#D32F2F',
  negativeBackground: '#FFEBEE',
  cardShadow: 'rgba(0,0,0,0.08)',
  headerBackground: '#FFFFFF',
  shimmer: '#F0F2F5',
  overlay: 'rgba(0,0,0,0.5)',
  chartLine: '#1B8A3C',
  chartGrid: '#E8EAF0',
};

export const darkTheme: Theme = {
  background: '#0A0E1A',
  surface: '#141926',
  surfaceElevated: '#1E2436',
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  primaryLight: '#81C784',
  danger: '#F44336',
  dangerLight: '#EF5350',
  text: '#ECEEFF',
  textSecondary: '#A8AAC8',
  textMuted: '#60628A',
  border: '#252B3E',
  inputBackground: '#1E2436',
  tabBar: '#0E1220',
  positive: '#4CAF50',
  positiveBackground: 'rgba(76,175,80,0.15)',
  negative: '#F44336',
  negativeBackground: 'rgba(244,67,54,0.15)',
  cardShadow: 'rgba(0,0,0,0.4)',
  headerBackground: '#0E1220',
  shimmer: '#1E2436',
  overlay: 'rgba(0,0,0,0.7)',
  chartLine: '#4CAF50',
  chartGrid: '#252B3E',
};