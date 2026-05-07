export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume?: number[];
  priceHistory?: number[];
}

export interface WatchlistItem extends Stock {
  addedAt: string;
}

export interface PortfolioItem {
  id: string;
  tickerSymbol: string;
  companyName: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}