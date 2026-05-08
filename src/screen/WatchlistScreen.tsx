import React, { useMemo } from 'react';
import {
  View, Text, FlatList, StyleSheet, StatusBar, SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { WatchlistCard } from '../components/WatchlistCard';
import { EmptyState } from '../components/EmptyState';
import type { RootNavProp } from '../types';
import stocksData from '../data/stock.json';

const ALL_STOCKS = stocksData as any[];

export const WatchlistScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { watchlist, removeFromWatchlist } = useApp();
  const navigation = useNavigation<RootNavProp>();

  const watchlistStocks = useMemo(
    () => ALL_STOCKS.filter(s => watchlist.includes(s.symbol)),
    [watchlist],
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.headerBackground }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.headerBackground} />
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="star" size={24} color="#FFB800" />
          <Text style={[styles.headerTitle, { color: theme.text }]}>My Watchlist</Text>
        </View>
        <Text style={[styles.countBadge, { backgroundColor: theme.primary + '20', color: theme.primary }]}>
          {watchlist.length} stocks
        </Text>
      </View>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {watchlistStocks.length === 0 ? (
          <EmptyState
            icon="star-border"
            title="No stocks in your watchlist"
            subtitle="Add stocks from the Home screen to keep track of them."
            actionLabel="Explore Stocks"
            onAction={() => navigation.navigate('MainTabs')}
          />
        ) : (
          <FlatList
            data={watchlistStocks}
            keyExtractor={item => item.symbol}
            renderItem={({ item }) => (
              <WatchlistCard
                stock={item}
                onPress={() => navigation.navigate('StockDetail', { symbol: item.symbol })}
                onDelete={() => removeFromWatchlist(item.symbol)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 54,
    borderBottomWidth: 0.5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 30,
  },
});