import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const STOCK_COLORS: Record<string, string> = {
  AAPL: '#1C1C1E', TSLA: '#CC0000', GOOGL: '#4285F4',
  MSFT: '#00A4EF', AMZN: '#FF9900', NVDA: '#76B900',
  META: '#1877F2', NFLX: '#E50914',
};

const getColorFromSymbol = (symbol: string): string => {
  if (STOCK_COLORS[symbol]) return STOCK_COLORS[symbol];
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 65%, 40%)`;
};

interface Props {
  symbol: string;
  size?: number;
}

export const StockAvatar: React.FC<Props> = ({ symbol, size = 44 }) => {
  const bgColor = getColorFromSymbol(symbol);
  const label = symbol.slice(0, 2);
  const fontSize = size * 0.36;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }]}>
      <Text style={[styles.text, { fontSize }]}>{label}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});