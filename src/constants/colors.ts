export const COLORS = {
  light: {
    primary: '#2C3E50',
    secondary: '#3498DB',
    success: '#27AE60',
    danger: '#E74C3C',
    warning: '#F39C12',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    border: '#E0E0E0',
    chartLine: '#3498DB',
    chartBar: '#2ECC71',
  },
  dark: {
    primary: '#34495E',
    secondary: '#5DADE2',
    success: '#2ECC71',
    danger: '#E74C3C',
    warning: '#F39C12',
    background: '#1A1A1A',
    surface: '#2C2C2C',
    text: '#ECF0F1',
    textSecondary: '#BDC3C7',
    border: '#404040',
    chartLine: '#5DADE2',
    chartBar: '#2ECC71',
  },
} as const;

export type Theme = 'light' | 'dark';
