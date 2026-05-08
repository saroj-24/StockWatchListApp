import { useState, useMemo, useCallback } from 'react';
import type { Stock } from '../types';
import stocksData from '../data/stock.json';

const ALL_STOCKS = stocksData as Stock[];

export const useStockSearch = () => {
  const [query, setQuery] = useState('');

  const filteredStocks = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return ALL_STOCKS;
    return ALL_STOCKS.filter(
      s =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q),
    );
  }, [query]);

  const findStock = useCallback(
    (symbol: string): Stock | undefined =>
      ALL_STOCKS.find(s => s.symbol === symbol.toUpperCase().trim()),
    [],
  );

  const clearQuery = useCallback(() => setQuery(''), []);

  return { query, setQuery, filteredStocks, findStock, clearQuery, allStocks: ALL_STOCKS };
};