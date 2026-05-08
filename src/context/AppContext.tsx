import React, {
  createContext, useContext, useState, useEffect, useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PortfolioItem, Stock } from '../types';
import stocksData from '../data/stock.json';

const JSON_STOCKS = stocksData as Stock[];

interface AppContextType {
  watchlist: string[];
  portfolio: PortfolioItem[];
  allStocks: Stock[];                         
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
  editPortfolioItem: (item: PortfolioItem) => void;
  deletePortfolioItem: (id: string) => void;
  addCustomStock: (stock: Stock) => void;     
  removeCustomStock: (symbol: string) => void; 
}

const AppContext = createContext<AppContextType>({} as AppContextType);

const WATCHLIST_KEY  = '@watchlist';
const PORTFOLIO_KEY  = '@portfolio';
const CUSTOM_STOCKS_KEY = '@custom_stocks';   

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist]       = useState<string[]>([]);
  const [portfolio, setPortfolio]       = useState<PortfolioItem[]>([]);
  const [customStocks, setCustomStocks] = useState<Stock[]>([]);
  const allStocks: Stock[] = [
    ...JSON_STOCKS,
    ...customStocks.filter(cs => !JSON_STOCKS.some(js => js.symbol === cs.symbol)),
  ];
  useEffect(() => {
    const load = async () => {
      try {
        const [wl, pf, cs] = await Promise.all([
          AsyncStorage.getItem(WATCHLIST_KEY),
          AsyncStorage.getItem(PORTFOLIO_KEY),
          AsyncStorage.getItem(CUSTOM_STOCKS_KEY),
        ]);
        if (wl) setWatchlist(JSON.parse(wl));
        if (pf) setPortfolio(JSON.parse(pf));
        if (cs) setCustomStocks(JSON.parse(cs));
      } catch (_) {}
    };
    load();
  }, []);

  const saveWatchlist    = useCallback(async (d: string[]) =>
    AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(d)), []);

  const savePortfolio    = useCallback(async (d: PortfolioItem[]) =>
    AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify(d)), []);

  const saveCustomStocks = useCallback(async (d: Stock[]) =>
    AsyncStorage.setItem(CUSTOM_STOCKS_KEY, JSON.stringify(d)), []);

  const addToWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => {
      if (prev.includes(symbol)) return prev;
      const next = [...prev, symbol];
      saveWatchlist(next);
      return next;
    });
  }, [saveWatchlist]);

  const removeFromWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => {
      const next = prev.filter(s => s !== symbol);
      saveWatchlist(next);
      return next;
    });
  }, [saveWatchlist]);

  const isInWatchlist = useCallback((symbol: string) =>
    watchlist.includes(symbol), [watchlist]);

  const addPortfolioItem = useCallback((item: Omit<PortfolioItem, 'id'>) => {
    setPortfolio(prev => {
      const next = [...prev, { ...item, id: Date.now().toString() }];
      savePortfolio(next);
      return next;
    });
  }, [savePortfolio]);

  const editPortfolioItem = useCallback((item: PortfolioItem) => {
    setPortfolio(prev => {
      const next = prev.map(p => p.id === item.id ? item : p);
      savePortfolio(next);
      return next;
    });
  }, [savePortfolio]);

  const deletePortfolioItem = useCallback((id: string) => {
    setPortfolio(prev => {
      const next = prev.filter(p => p.id !== id);
      savePortfolio(next);
      return next;
    });
  }, [savePortfolio]);

  const addCustomStock = useCallback((stock: Stock) => {
    setCustomStocks(prev => {
      if (JSON_STOCKS.some(s => s.symbol === stock.symbol)) return prev;
      if (prev.some(s => s.symbol === stock.symbol)) return prev;
      const next = [...prev, stock];
      saveCustomStocks(next);
      return next;
    });
  }, [saveCustomStocks]);

  const removeCustomStock = useCallback((symbol: string) => {
    setCustomStocks(prev => {
      const next = prev.filter(s => s.symbol !== symbol);
      saveCustomStocks(next);
      return next;
    });
  }, [saveCustomStocks]);

  return (
    <AppContext.Provider value={{
      watchlist, portfolio, allStocks,
      addToWatchlist, removeFromWatchlist, isInWatchlist,
      addPortfolioItem, editPortfolioItem, deletePortfolioItem,
      addCustomStock, removeCustomStock,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);