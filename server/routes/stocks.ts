import { RequestHandler } from "express";

// Mock stock data
const stocks: Record<string, { latestClose: number; changePercent: number }> = {
  "NIFTY_50.BSE": { latestClose: 22310.5, changePercent: 0.8 },
  "TCS.BSE": { latestClose: 3850.75, changePercent: 2.15 },
  "HDFCBANK.BSE": { latestClose: 1450.2, changePercent: -1.3 },
  "INFY.BSE": { latestClose: 1350.35, changePercent: 1.25 },
  "HINDUNILVR.BSE": { latestClose: 2405.0, changePercent: -0.45 },
  "RELIANCE.BSE": { latestClose: 2550.5, changePercent: 0.9 },
  "INDIGO.BSE": { latestClose: 2450.0, changePercent: -2.1 },
  "DMART.BSE": { latestClose: 3800.0, changePercent: 1.5 },
};

export const handleStocksBatch: RequestHandler = (req, res) => {
  const symbols = (req.query.symbols as string)?.split(",") || [];
  const result: typeof stocks = {};
  for (const symbol of symbols) {
    if (stocks[symbol]) {
      result[symbol] = stocks[symbol];
    }
  }
  res.json(result);
};