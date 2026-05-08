import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { Stock } from '../types';
import { StockAvatar } from './StockAvatar';


interface Props {
  stock: Stock;
  onPress: () => void;
  onDelete: () => void;
}

export const WatchlistCard: React.FC<Props> = ({ stock, onPress, onDelete }) => {
  const { theme } = useTheme();
  const isPositive = stock.change >= 0;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleDelete = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onDelete);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <StockAvatar symbol={stock.symbol} size={44} />
        <View style={styles.info}>
          <Text style={[styles.symbol, { color: theme.text }]}>{stock.symbol}</Text>
          <Text style={[styles.name, { color: theme.textSecondary }]} numberOfLines={1}>{stock.name}</Text>
        </View>
        <View style={styles.middle}>
          <Text style={[styles.price, { color: theme.text }]}>${stock.price.toFixed(2)}</Text>
          <Text style={[styles.change, { color: isPositive ? theme.positive : theme.negative }]}>
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </Text>
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialIcons name="delete-outline" size={22} color={theme.danger} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
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
  },
  name: {
    fontSize: 12,
    marginTop: 2,
  },
  middle: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
  },
  change: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
  deleteBtn: {
    padding: 4,
  },
});