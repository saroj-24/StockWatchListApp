import { stocksData } from '../data/stocks';
import { Stock } from '../types';


export class StockService {
  private stocks: Stock[] = stocksData;

  getAllStocks(): Stock[] {
    return this.stocks;
  }

  getStockBySymbol(symbol: string): Stock | undefined {
    return this.stocks.find(
      stock => stock.symbol.toLowerCase() === symbol.toLowerCase()
    );
  }

  searchStocks(query: string): Stock[] {
    const lowerQuery = query.toLowerCase();
    return this.stocks.filter(
      stock =>
        stock.symbol.toLowerCase().includes(lowerQuery) ||
        stock.name.toLowerCase().includes(lowerQuery)
    );
  }

  validateStockSymbol(symbol: string): boolean {
    return this.stocks.some(
      stock => stock.symbol.toLowerCase() === symbol.toLowerCase()
    );
  }

  getStockPriceHistory(symbol: string): number[] {
    const stock = this.getStockBySymbol(symbol);
    return stock?.priceHistory || [0, 0, 0, 0, 0];
  }

  getStockVolume(symbol: string): number[] {
    const stock = this.getStockBySymbol(symbol);
    return stock?.volume || [0, 0, 0, 0, 0];
  }
}