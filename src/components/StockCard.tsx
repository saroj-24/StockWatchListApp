import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stock } from '../types';
import { useTheme } from '../context/ThemeContext';
import { StockAvatar } from './StockAvatar';


interface Props {
  stock: Stock;
  onPress: () => void;
}

export const StockCard: React.FC<Props> = ({ stock, onPress }) => {
  const { theme } = useTheme();
  const isPositive = stock.change >= 0;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <StockAvatar symbol={stock.symbol} size={46} />
      <View style={styles.info}>
        <Text style={[styles.symbol, { color: theme.text }]}>{stock.symbol}</Text>
        <Text style={[styles.name, { color: theme.textSecondary }]} numberOfLines={1}>{stock.name}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: theme.text }]}>${stock.price.toFixed(2)}</Text>
        <View style={[styles.changeBadge, {
          backgroundColor: isPositive ? theme.positiveBackground : theme.negativeBackground,
        }]}>
          <Text style={[styles.change, { color: isPositive ? theme.positive : theme.negative }]}>
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginVertical: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  symbol: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  name: {
    fontSize: 12,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
  },
  changeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  change: {
    fontSize: 11,
    fontWeight: '600',
  },
});