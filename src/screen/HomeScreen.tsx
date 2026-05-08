import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useStockSearch } from '../hooks/useStockSearch';
import { StockCard } from '../components/StockCard';
import { EmptyState } from '../components/EmptyState';
import type { RootNavProp } from '../types';

export const HomeScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { addToWatchlist } = useApp();
  const navigation = useNavigation<RootNavProp>();
  const { query, setQuery, filteredStocks, findStock, clearQuery } = useStockSearch();
  const [addSymbol, setAddSymbol] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  const handleAddToWatchlist = useCallback(() => {
    const sym = addSymbol.trim().toUpperCase();
    if (!sym) {
      setAddError('Please enter a stock symbol');
      return;
    }
    const found = findStock(sym);
    if (!found) {
      setAddError(`"${sym}" not found. Try AAPL, TSLA, GOOGL...`);
      setAddSuccess('');
    } else {
      addToWatchlist(sym);
      setAddError('');
      setAddSuccess(`${sym} added to watchlist ✓`);
      setAddSymbol('');
      setTimeout(() => setAddSuccess(''), 2500);
    }
  }, [addSymbol, addToWatchlist, findStock]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.headerBackground }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.headerBackground}
      />
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Stocks</Text>
        <MaterialIcons name="notifications-none" size={26} color={theme.text} />
      </View>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <MaterialIcons name="search" size={20} color={theme.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search by name, symbol or sector..."
            placeholderTextColor={theme.textMuted}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearQuery}>
              <MaterialIcons name="close" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.addRow}>
          <View style={[styles.addInputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TextInput
              style={[styles.addInput, { color: theme.text }]}
              placeholder="Enter symbol to add (e.g. AAPL)"
              placeholderTextColor={theme.textMuted}
              value={addSymbol}
              onChangeText={t => {
                setAddSymbol(t);
                setAddError('');
                setAddSuccess('');
              }}
              autoCapitalize="characters"
              returnKeyType="done"
              onSubmitEditing={handleAddToWatchlist}
            />
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
            onPress={handleAddToWatchlist}
          >
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
        {addError.length > 0 && (
          <View style={[styles.messageBanner, { backgroundColor: theme.negativeBackground }]}>
            <MaterialIcons name="error-outline" size={16} color={theme.danger} />
            <Text style={[styles.messageText, { color: theme.danger }]}>{addError}</Text>
            <Text style={[styles.suggestionRow, { color: theme.textMuted }]}>
              Try: APPL · TSLA · MSFT · GOOGL
            </Text>
          </View>
        )}
        {addSuccess.length > 0 && (
          <View style={[styles.messageBanner, { backgroundColor: theme.positiveBackground }]}>
            <MaterialIcons name="check-circle-outline" size={16} color={theme.positive} />
            <Text style={[styles.messageText, { color: theme.positive }]}>{addSuccess}</Text>
          </View>
        )}
        {query.length > 0 && (
          <Text style={[styles.resultCount, { color: theme.textMuted }]}>
            {filteredStocks.length} result{filteredStocks.length !== 1 ? 's' : ''} for "{query}"
          </Text>
        )}
        <FlatList
          data={filteredStocks}
          keyExtractor={item => item.symbol}
          renderItem={({ item }) => (
            <StockCard
              stock={item as any}
              onPress={() => navigation.navigate('StockDetail', { symbol: item.symbol })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="search-off"
              title="No Results Found"
              subtitle={`No stocks match "${query}". Try a symbol or company name.`}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  addBtn: {
    alignItems: 'center',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  addBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  addInput: {
    fontSize: 14,
  },

  addInputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    height: 46,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  addRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
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
    letterSpacing: -0.5,
  },

  listContent: {
    paddingBottom: 30,
    paddingTop: 10,
  },

  messageBanner: {
    borderRadius: 10,
    gap: 4,
    marginTop: 8,
    padding: 10,
  },

  messageText: {
    fontSize: 13,
    fontWeight: '600',
  },

  resultCount: {
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 4,
    marginTop: 10,
  },

  safeArea: {
    flex: 1,
  },

  searchContainer: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 46,
    marginTop: 14,
    paddingHorizontal: 12,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },

  suggestionRow: {
    fontSize: 11,
    marginTop: 2,
  },
});