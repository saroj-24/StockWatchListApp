import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, useWindowDimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { SimpleLineChart } from '../components/charts/SimpleLineChart';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import type { StockDetailRouteProp, RootNavProp } from '../types';
import stocksData from '../data/stock.json';

const ALL_STOCKS = stocksData as any[];
const TIME_PERIODS = ['1D', '1W', '1M', '3M', '1Y', '5Y'];
type ChartTab = 'price' | 'volume';

export const StockDetailScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const navigation = useNavigation<RootNavProp>();
  const route = useRoute<StockDetailRouteProp>();
  const { width } = useWindowDimensions();
  const [activePeriod, setActivePeriod] = useState('1W');
  const [activeChart, setActiveChart] = useState<ChartTab>('price');

  const stock = ALL_STOCKS.find(s => s.symbol === route.params.symbol);
  const inWatchlist = isInWatchlist(route.params.symbol);
  const isPositive = stock?.change >= 0;
  const chartWidth = width - 32;

  const { chartData, chartLabels } = useMemo(() => {
    if (!stock) return { chartData: [], chartLabels: [] };
    const ph: number[] = stock.priceHistory;
    const pl: string[] = stock.priceLabels;
    const vh: number[] = stock.volumeHistory;
    const vl: string[] = stock.priceLabels;

    const slices: Record<string, number> = {
      '1D': 5, '1W': 7, '1M': 10, '3M': 11, '1Y': 12, '5Y': 13,
    };
    const count = Math.min(slices[activePeriod] || 7, ph.length);
    const pd = ph.slice(-count);
    const pLabel = pl.slice(-count);
    const vd = vh.slice(-count);

    return activeChart === 'price'
      ? { chartData: pd, chartLabels: pLabel }
      : { chartData: vd.map(v => Math.round(v / 1_000_000)), chartLabels: vl.slice(-count) };
  }, [stock, activePeriod, activeChart]);

  if (!stock) {
    return (
      <View style={[styles.notFound, { backgroundColor: theme.background }]}>
        <Text style={[styles.notFoundText, { color: theme.text }]}>Stock not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.headerBackground }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.headerBackground} />
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerSymbol, { color: theme.text }]}>{stock.symbol}</Text>
          <Text style={[styles.headerName, { color: theme.textSecondary }]}>{stock.name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => inWatchlist ? removeFromWatchlist(stock.symbol) : addToWatchlist(stock.symbol)}
        >
          <MaterialIcons
            name={inWatchlist ? 'star' : 'star-border'}
            size={26}
            color={inWatchlist ? '#FFB800' : theme.textMuted}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.priceSection, { backgroundColor: theme.surface }]}>
          <Text style={[styles.price, { color: theme.text }]}>${stock.price.toFixed(2)}</Text>
          <View style={[styles.changeBadge, {
            backgroundColor: isPositive ? theme.positiveBackground : theme.negativeBackground,
          }]}>
            <MaterialIcons
              name={isPositive ? 'trending-up' : 'trending-down'}
              size={16}
              color={isPositive ? theme.positive : theme.negative}
            />
            <Text style={[styles.changeText, { color: isPositive ? theme.positive : theme.negative }]}>
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%) Today
            </Text>
          </View>
          <View style={styles.statsRow}>
            {[
              { label: 'Day High', value: `$${stock.high.toFixed(2)}`, color: theme.positive },
              { label: 'Day Low', value: `$${stock.low.toFixed(2)}`, color: theme.negative },
              { label: 'Open', value: `$${stock.open.toFixed(2)}`, color: theme.text },
            ].map(stat => (
              <View key={stat.label} style={[styles.statItem, { backgroundColor: theme.background }]}>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>{stat.label}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={[styles.chartCard, { backgroundColor: theme.surface }]}>
          <View style={[styles.tabRow, { backgroundColor: theme.background }]}>
            {(['price', 'volume'] as ChartTab[]).map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, activeChart === tab && { backgroundColor: theme.primary }]}
                onPress={() => setActiveChart(tab)}
              >
                <Text style={[styles.tabText, { color: activeChart === tab ? '#fff' : theme.textSecondary }]}>
                  {tab === 'price' ? 'Price Trend' : 'Volume'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <SimpleLineChart
            data={chartData}
            labels={chartLabels}
            width={chartWidth - 32}
            height={180}
            color={isPositive ? theme.positive : theme.negative}
          />
          <View style={styles.periodRow}>
            {TIME_PERIODS.map(period => (
              <TouchableOpacity
                key={period}
                style={[styles.periodBtn, activePeriod === period && [styles.periodBtnActive, { backgroundColor: theme.primary }]]}
                onPress={() => setActivePeriod(period)}
              >
                <Text style={[styles.periodText, {
                  color: activePeriod === period ? '#fff' : theme.textMuted,
                  fontWeight: activePeriod === period ? '700' : '500',
                }]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {activeChart === 'price' && (
          <View style={[styles.chartCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Volume (Millions)</Text>
            <SimpleBarChart
              data={stock.volumeHistory.slice(-7).map((v: number) => Math.round(v / 1_000_000))}
              labels={stock.priceLabels.slice(-7)}
              width={chartWidth - 32}
              height={150}
              color={theme.primary}
            />
          </View>
        )}
        <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>About {stock.symbol}</Text>
          {[
            { label: 'Sector', value: stock.sector },
            { label: 'Market Cap', value: stock.marketCap },
            { label: 'Volume', value: (stock.volume / 1_000_000).toFixed(2) + 'M' },
          ].map(row => (
            <View key={row.label} style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{row.label}</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{row.value}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.actionBtn, {
            backgroundColor: inWatchlist ? theme.dangerLight + '20' : theme.primary,
            borderColor: inWatchlist ? theme.danger : 'transparent',
            borderWidth: inWatchlist ? 1 : 0,
          }]}
          onPress={() => inWatchlist ? removeFromWatchlist(stock.symbol) : addToWatchlist(stock.symbol)}
        >
          <MaterialIcons name={inWatchlist ? 'star' : 'star-border'} size={20} color={inWatchlist ? theme.danger : '#fff'} />
          <Text style={[styles.actionBtnText, { color: inWatchlist ? theme.danger : '#fff' }]}>
            {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 55,
    borderBottomWidth: 0.5,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSymbol: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerName: {
    fontSize: 12,
    marginTop: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  priceSection: {
    borderRadius: 16,
    padding: 16,
  },
  price: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 6,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  statItem: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  chartCard: {
    borderRadius: 16,
    padding: 16,
  },
  tabRow: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
  },
  periodBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodBtnActive: {},
  periodText: {
    fontSize: 12,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    marginTop: 4,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});