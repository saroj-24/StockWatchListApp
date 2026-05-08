import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { usePortfolioStats } from '../hooks/usePortfolioStats';
import { PortfolioCard } from '../components/PortfolioCard';
import { EmptyState } from '../components/EmptyState';
import type { RootNavProp } from '../types';

export const PortfolioScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { portfolio, deletePortfolioItem } = useApp();
  const navigation = useNavigation<RootNavProp>();
  const {
    totalValue,
    totalCost,
    totalPL,
    totalPLPercent,
    isPositive,
    bestPerformer,
    worstPerformer,
    stockCount,
  } = usePortfolioStats();

  const handleDelete = (id: string, symbol: string) => {
    Alert.alert('Remove Stock', `Remove ${symbol} from your portfolio?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => deletePortfolioItem(id),
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.headerBackground }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.headerBackground}
      />
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Portfolio</Text>
        <View style={[styles.countBadge, { backgroundColor: theme.primary + '20' }]}>
          <Text style={[styles.countText, { color: theme.primary }]}>{stockCount} stocks</Text>
        </View>
      </View>

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {portfolio.length > 0 && (
          <>
            <View style={[styles.summaryCard, { backgroundColor: theme.primary }]}>
              <View style={styles.summaryMain}>
                <Text style={styles.summarySubLabel}>Total Portfolio Value</Text>
                <Text style={styles.summaryValue}>${totalValue.toFixed(2)}</Text>
                <View style={styles.plRow}>
                  <MaterialIcons
                    name={isPositive ? 'trending-up' : 'trending-down'}
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.plText}>
                    {isPositive ? '+' : ''}${Math.abs(totalPL).toFixed(2)}{' '}
                    ({isPositive ? '+' : ''}{totalPLPercent.toFixed(2)}%) overall
                  </Text>
                </View>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: 'rgba(255,255,255,0.25)' }]} />
              <View style={styles.summaryMeta}>
                <View style={styles.summaryMetaItem}>
                  <Text style={styles.summaryMetaLabel}>Invested</Text>
                  <Text style={styles.summaryMetaValue}>${totalCost.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryMetaItem}>
                  <Text style={styles.summaryMetaLabel}>Gain / Loss</Text>
                  <Text style={styles.summaryMetaValue}>
                    {isPositive ? '+' : ''}${totalPL.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
            {(bestPerformer || worstPerformer) && stockCount > 1 && (
              <View style={styles.performerRow}>
                {bestPerformer && (
                  <View style={[styles.performerCard, { backgroundColor: theme.positiveBackground }]}>
                    <MaterialIcons name="emoji-events" size={16} color={theme.positive} />
                    <View style={styles.performerInfo}>
                      <Text style={[styles.performerLabel, { color: theme.textMuted }]}>Best</Text>
                      <Text style={[styles.performerSymbol, { color: theme.positive }]}>
                        {bestPerformer.symbol}
                      </Text>
                    </View>
                    <Text style={[styles.performerPct, { color: theme.positive }]}>
                      +{(((bestPerformer.currentPrice - bestPerformer.purchasePrice) / bestPerformer.purchasePrice) * 100).toFixed(1)}%
                    </Text>
                  </View>
                )}
                {worstPerformer && (
                  <View style={[styles.performerCard, { backgroundColor: theme.negativeBackground }]}>
                    <MaterialIcons name="trending-down" size={16} color={theme.danger} />
                    <View style={styles.performerInfo}>
                      <Text style={[styles.performerLabel, { color: theme.textMuted }]}>Worst</Text>
                      <Text style={[styles.performerSymbol, { color: theme.danger }]}>
                        {worstPerformer.symbol}
                      </Text>
                    </View>
                    <Text style={[styles.performerPct, { color: theme.danger }]}>
                      {(((worstPerformer.currentPrice - worstPerformer.purchasePrice) / worstPerformer.purchasePrice) * 100).toFixed(1)}%
                    </Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}
        {portfolio.length === 0 ? (
          <EmptyState
            icon="account-balance-wallet"
            title="Your portfolio is empty"
            subtitle="Add stocks to track your investments and see profit & loss."
            actionLabel="Add First Stock"
            onAction={() => navigation.navigate('AddPortfolio')}
          />
        ) : (
          <FlatList
            data={portfolio}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <PortfolioCard
                item={item}
                onEdit={() => navigation.navigate('EditPortfolio', { item })}
                onDelete={() => handleDelete(item.id, item.symbol)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('AddPortfolio')}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  countBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  countText: {
    fontSize: 12,
    fontWeight: '700',
  },

  fab: {
    alignItems: 'center',
    borderRadius: 28,
    bottom: 24,
    elevation: 8,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 56,
  },

  header: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
  },

  listContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },

  performerCard: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 10,
  },

  performerInfo: {
    flex: 1,
  },

  performerLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  performerPct: {
    fontSize: 13,
    fontWeight: '700',
  },

  performerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  performerSymbol: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 1,
  },

  plRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 6,
  },

  plText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },

  safeArea: {
    flex: 1,
  },

  summaryCard: {
    borderRadius: 20,
    marginTop: 14,
    padding: 18,
  },

  summaryDivider: {
    height: 1,
    marginVertical: 14,
  },

  summaryMain: {},

  summaryMeta: {
    flexDirection: 'row',
  },
  summaryMetaItem: {
    flex: 1,
  },
  summaryMetaLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
  },
  summaryMetaValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
  },
  summarySubLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 4,
  },
});