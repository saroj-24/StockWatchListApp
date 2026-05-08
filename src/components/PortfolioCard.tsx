import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioStats } from '../hooks/usePortfolioStats';
import { StockAvatar } from './StockAvatar';
import type { PortfolioItem } from '../types';

interface Props {
  item: PortfolioItem;
  onEdit: () => void;
  onDelete: () => void;
}

export const PortfolioCard: React.FC<Props> = ({ item, onEdit, onDelete }) => {
  const { theme } = useTheme();
  const { getStockStats } = usePortfolioStats();
  const { profitLoss, profitLossPercent, totalValue, isPositive } = getStockStats(item);

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
      <View style={styles.topRow}>
        <StockAvatar symbol={item.symbol} size={44} />
        <View style={styles.info}>
          <Text style={[styles.symbol, { color: theme.text }]}>{item.symbol}</Text>
          <Text style={[styles.name, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={[styles.totalValue, { color: theme.text }]}>
            ${totalValue.toFixed(2)}
          </Text>
          <View
            style={[
              styles.plBadge,
              {
                backgroundColor: isPositive
                  ? theme.positiveBackground
                  : theme.negativeBackground,
              },
            ]}
          >
            <MaterialIcons
              name={isPositive ? 'arrow-drop-up' : 'arrow-drop-down'}
              size={14}
              color={isPositive ? theme.positive : theme.negative}
            />
            <Text style={[styles.pl, { color: isPositive ? theme.positive : theme.negative }]}>
              {isPositive ? '+' : ''}${Math.abs(profitLoss).toFixed(2)} (
              {isPositive ? '+' : ''}
              {profitLossPercent.toFixed(2)}%)
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <View style={styles.detailRow}>
        {[
          { label: 'Shares', value: item.quantity.toString() },
          { label: 'Buy Price', value: `$${item.purchasePrice.toFixed(2)}` },
          { label: 'Current', value: `$${item.currentPrice.toFixed(2)}` },
          { label: 'Since', value: new Date(item.dateOfPurchase).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) },
        ].map(d => (
          <View key={d.label} style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>{d.label}</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{d.value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onEdit}
          style={[styles.actionBtn, { backgroundColor: theme.primary + '18', flex: 1, marginRight: 6 }]}
        >
          <MaterialIcons name="edit" size={15} color={theme.primary} />
          <Text style={[styles.actionBtnText, { color: theme.primary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          style={[styles.actionBtn, { backgroundColor: theme.negativeBackground, flex: 1, marginLeft: 6 }]}
        >
          <MaterialIcons name="delete-outline" size={15} color={theme.danger} />
          <Text style={[styles.actionBtnText, { color: theme.danger }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginVertical: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: 12 },
  symbol: { fontSize: 15, fontWeight: '700' },
  name: { fontSize: 12, marginTop: 2 },
  valueContainer: { alignItems: 'flex-end' },
  totalValue: { fontSize: 16, fontWeight: '800' },
  plBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  pl: { fontSize: 11, fontWeight: '600' },
  divider: { height: 1, marginVertical: 10 },
  detailRow: { flexDirection: 'row', marginBottom: 10 },
  detailItem: { flex: 1 },
  detailLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4 },
  detailValue: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  actions: { flexDirection: 'row' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionBtnText: { fontSize: 13, fontWeight: '600' },
});