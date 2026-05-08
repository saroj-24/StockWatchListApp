declare module '*/stocks.json' {
  const value: {
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
  }[];
  export default value;
}