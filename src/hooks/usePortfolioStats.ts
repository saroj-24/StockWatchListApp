import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PortfolioItem } from '../types';


export interface StockStats {
  totalValue: number;
  totalCost: number;
  totalPL: number;
  totalPLPercent: number;
  isPositive: boolean;
  bestPerformer: PortfolioItem | null;
  worstPerformer: PortfolioItem | null;
  stockCount: number;
}

export interface PerStockStats {
  profitLoss: number;
  profitLossPercent: number;
  totalValue: number;
  isPositive: boolean;
}
export const usePortfolioStats = (): StockStats & {
  getStockStats: (item: PortfolioItem) => PerStockStats;
} => {
  const { portfolio } = useApp();

  const stats = useMemo<StockStats>(() => {
    if (portfolio.length === 0) {
      return {
        totalValue: 0, totalCost: 0, totalPL: 0,
        totalPLPercent: 0, isPositive: true,
        bestPerformer: null, worstPerformer: null, stockCount: 0,
      };
    }

    const totalValue = portfolio.reduce(
      (sum, item) => sum + item.currentPrice * item.quantity, 0,
    );
    const totalCost = portfolio.reduce(
      (sum, item) => sum + item.purchasePrice * item.quantity, 0,
    );
    const totalPL = totalValue - totalCost;
    const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

    const sorted = [...portfolio].sort((a, b) => {
      const plA = (a.currentPrice - a.purchasePrice) / a.purchasePrice;
      const plB = (b.currentPrice - b.purchasePrice) / b.purchasePrice;
      return plB - plA;
    });

    return {
      totalValue,
      totalCost,
      totalPL,
      totalPLPercent,
      isPositive: totalPL >= 0,
      bestPerformer: sorted[0] ?? null,
      worstPerformer: sorted[sorted.length - 1] ?? null,
      stockCount: portfolio.length,
    };
  }, [portfolio]);

  const getStockStats = useMemo(
    () =>
      (item: PortfolioItem): PerStockStats => {
        const profitLoss = (item.currentPrice - item.purchasePrice) * item.quantity;
        const profitLossPercent =
          item.purchasePrice > 0
            ? ((item.currentPrice - item.purchasePrice) / item.purchasePrice) * 100
            : 0;
        return {
          profitLoss,
          profitLossPercent,
          totalValue: item.currentPrice * item.quantity,
          isPositive: profitLoss >= 0,
        };
      },
    [],
  );

  return { ...stats, getStockStats };
};