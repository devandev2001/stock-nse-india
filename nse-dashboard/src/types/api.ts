// API Response Types
export interface EquityDetails {
  info: {
    symbol: string;
    companyName: string;
    industry: string;
    activeSeries: string[];
    isFNOSec: boolean;
    isin: string;
  };
  metadata: {
    series: string;
    symbol: string;
    isin: string;
    status: string;
    listingDate: string;
    industry: string;
    lastUpdateTime: string;
    pdSectorPe: number;
    pdSymbolPe: number;
    pdSectorInd: string;
  };
  priceInfo: {
    lastPrice: number;
    change: number;
    pChange: number;
    previousClose: number;
    open: number;
    close: number;
    vwap: number;
    lowerCP: string;
    upperCP: string;
    intraDayHighLow: {
      min: number;
      max: number;
      value: number;
    };
    weekHighLow: {
      min: number;
      max: number;
      minDate: string;
      maxDate: string;
      value: number;
    };
  };
}

export interface MarketStatus {
  marketState: Array<{
    market: string;
    marketStatus: string;
    tradeDate: string;
    index: string;
    last: number;
    variation: number;
    percentChange: number;
    marketStatusMessage: string;
  }>;
}

export interface IndexDetails {
  name: string;
  data: Array<{
    symbol: string;
    lastPrice: number;
    change: number;
    pChange: number;
    open: number;
    dayHigh: number;
    dayLow: number;
    previousClose: number;
    totalTradedVolume: number;
    totalTradedValue: number;
  }>;
  metadata: {
    indexName: string;
    open: number;
    high: number;
    low: number;
    previousClose: number;
    last: number;
    percChange: number;
    change: number;
    totalTradedVolume: number;
    totalTradedValue: number;
  };
}

export interface HistoricalData {
  data: Array<{
    CH_SYMBOL: string;
    CH_TIMESTAMP: string;
    CH_OPENING_PRICE: number;
    CH_TRADE_HIGH_PRICE: number;
    CH_TRADE_LOW_PRICE: number;
    CH_CLOSING_PRICE: number;
    CH_TOT_TRADED_QTY: number;
    CH_TOT_TRADED_VAL: number;
  }>;
}

export interface OptionChainData {
  records: {
    data: Array<{
      strikePrice: number;
      expiryDate: string;
      PE?: {
        lastPrice: number;
        change: number;
        pChange: number;
        openInterest: number;
        totalTradedVolume: number;
        impliedVolatility: number;
      };
      CE?: {
        lastPrice: number;
        change: number;
        pChange: number;
        openInterest: number;
        totalTradedVolume: number;
        impliedVolatility: number;
      };
    }>;
    expiryDates: string[];
    underlyingValue: number;
  };
}

export interface GainersLosers {
  gainers: Array<{
    symbol: string;
    lastPrice: number;
    change: number;
    pChange: number;
    totalTradedVolume: number;
  }>;
  losers: Array<{
    symbol: string;
    lastPrice: number;
    change: number;
    pChange: number;
    totalTradedVolume: number;
  }>;
}