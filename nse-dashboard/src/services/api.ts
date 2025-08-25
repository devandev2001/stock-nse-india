import axios from 'axios';
import type { EquityDetails, MarketStatus, IndexDetails, HistoricalData, OptionChainData, GainersLosers } from '../types/api';

// Configure the base URL for your NSE API
const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Market Status
  getMarketStatus: (): Promise<MarketStatus> =>
    api.get('/api/marketStatus').then(res => res.data),

  // All Symbols
  getAllSymbols: (): Promise<string[]> =>
    api.get('/api/allSymbols').then(res => res.data),

  // All Indices
  getAllIndices: () =>
    api.get('/api/allIndices').then(res => res.data),

  // Index Names
  getIndexNames: () =>
    api.get('/api/indexNames').then(res => res.data),

  // Equity Details
  getEquityDetails: (symbol: string): Promise<EquityDetails> =>
    api.get(`/api/equity/${symbol}`).then(res => res.data),

  // Equity Historical Data
  getEquityHistorical: (symbol: string, dateStart?: string, dateEnd?: string): Promise<HistoricalData[]> => {
    let url = `/api/equity/historical/${symbol}`;
    const params = new URLSearchParams();
    if (dateStart) params.append('dateStart', dateStart);
    if (dateEnd) params.append('dateEnd', dateEnd);
    if (params.toString()) url += `?${params.toString()}`;
    return api.get(url).then(res => res.data);
  },

  // Equity Intraday Data
  getEquityIntraday: (symbol: string, preOpen = false) =>
    api.get(`/api/equity/intraday/${symbol}?preOpen=${preOpen}`).then(res => res.data),

  // Equity Trade Info
  getEquityTradeInfo: (symbol: string) =>
    api.get(`/api/equity/tradeInfo/${symbol}`).then(res => res.data),

  // Equity Corporate Info
  getEquityCorporateInfo: (symbol: string) =>
    api.get(`/api/equity/corporateInfo/${symbol}`).then(res => res.data),

  // Index Details
  getIndexDetails: (indexSymbol: string): Promise<IndexDetails> =>
    api.get(`/api/index/${indexSymbol}`).then(res => res.data),

  // Index Historical Data
  getIndexHistorical: (indexSymbol: string, dateStart: string, dateEnd: string) =>
    api.get(`/api/index/historical/${indexSymbol}?dateStart=${dateStart}&dateEnd=${dateEnd}`).then(res => res.data),

  // Index Intraday Data
  getIndexIntraday: (indexSymbol: string, preOpen = false) =>
    api.get(`/api/index/intraday/${indexSymbol}?preOpen=${preOpen}`).then(res => res.data),

  // Option Chain Data
  getEquityOptionChain: (symbol: string): Promise<OptionChainData> =>
    api.get(`/api/equity/options/${symbol}`).then(res => res.data),

  getIndexOptionChain: (indexSymbol: string): Promise<OptionChainData> =>
    api.get(`/api/index/options/${indexSymbol}`).then(res => res.data),

  getCommodityOptionChain: (commoditySymbol: string): Promise<OptionChainData> =>
    api.get(`/api/commodity/options/${commoditySymbol}`).then(res => res.data),

  // Gainers and Losers
  getGainersLosers: (indexSymbol: string): Promise<GainersLosers> =>
    api.get(`/api/gainersAndLosers/${indexSymbol}`).then(res => res.data),

  // Most Active
  getMostActive: (indexSymbol: string) =>
    api.get(`/api/mostActive/${indexSymbol}`).then(res => res.data),
};