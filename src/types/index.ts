import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  marketCap: string;
  sector: string;
  color: string;
  priceHistory: number[];
  priceLabels: string[];
  volumeHistory: number[];
  isCustom?: boolean;
}

export interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  dateOfPurchase: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  StockDetail: { symbol: string };
  AddPortfolio: undefined;
  EditPortfolio: { item: PortfolioItem };
};

export type TabParamList = {
  Home: undefined;
  Watchlist: undefined;
  Portfolio: undefined;
  Settings: undefined;
};

export type RootNavProp = NativeStackNavigationProp<RootStackParamList>;
export type StockDetailRouteProp = RouteProp<RootStackParamList, 'StockDetail'>;
export type EditPortfolioRouteProp = RouteProp<RootStackParamList, 'EditPortfolio'>;