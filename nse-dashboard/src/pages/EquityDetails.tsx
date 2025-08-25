import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, BarChart3, Building2 } from 'lucide-react';
import { StatCard } from '../components/Common/StatCard';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { ErrorMessage } from '../components/Common/ErrorMessage';
import { apiService } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays } from 'date-fns';

export const EquityDetails: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [searchSymbol, setSearchSymbol] = useState('');
  const [equityData, setEquityData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [tradeInfo, setTradeInfo] = useState<any>(null);
  const [corporateInfo, setCorporateInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!symbol.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setSearchSymbol(symbol.toUpperCase());

      const endDate = format(new Date(), 'yyyy-MM-dd');
      const startDate = format(subDays(new Date(), 90), 'yyyy-MM-dd');

      const [equity, historical, trade, corporate] = await Promise.all([
        apiService.getEquityDetails(symbol),
        apiService.getEquityHistorical(symbol, startDate, endDate),
        apiService.getEquityTradeInfo(symbol),
        apiService.getEquityCorporateInfo(symbol)
      ]);

      setEquityData(equity);
      setHistoricalData(historical);
      setTradeInfo(trade);
      setCorporateInfo(corporate);
    } catch (err) {
      setError(`Failed to fetch data for ${symbol}. Please check if the symbol is valid.`);
      console.error('Error fetching equity data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatChartData = (data: any[]) => {
    if (!data || !data[0]?.data) return [];
    
    return data[0].data.map((item: any) => ({
      date: item.CH_TIMESTAMP,
      price: item.CH_CLOSING_PRICE,
      volume: item.CH_TOT_TRADED_QTY,
      high: item.CH_TRADE_HIGH_PRICE,
      low: item.CH_TRADE_LOW_PRICE,
      open: item.CH_OPENING_PRICE
    })).slice(-30); // Last 30 days
  };

  const chartData = formatChartData(historicalData);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Equity Analysis</h2>
        <p className="text-gray-600">Search and analyze individual stocks</p>
      </div>

      {/* Search Section */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter stock symbol (e.g., TCS, RELIANCE, INFY)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="input-field pl-10"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={!symbol.trim() || loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner text={`Fetching data for ${searchSymbol}...`} />}

      {error && <ErrorMessage message={error} onRetry={handleSearch} />}

      {equityData && !loading && (
        <div className="space-y-6 animate-slide-up">
          {/* Company Info Header */}
          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{equityData.info.companyName}</h3>
                <p className="text-gray-600">{equityData.info.symbol} • {equityData.metadata.industry}</p>
                <p className="text-sm text-gray-500 mt-1">ISIN: {equityData.info.isin}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  ₹{equityData.priceInfo.lastPrice.toFixed(2)}
                </div>
                <div className={`text-lg font-medium ${
                  equityData.priceInfo.change >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {equityData.priceInfo.change > 0 ? '+' : ''}{equityData.priceInfo.change.toFixed(2)} 
                  ({equityData.priceInfo.pChange > 0 ? '+' : ''}{equityData.priceInfo.pChange.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Open"
              value={`₹${equityData.priceInfo.open.toFixed(2)}`}
              icon={TrendingUp}
            />
            <StatCard
              title="Day High"
              value={`₹${equityData.priceInfo.intraDayHighLow.max.toFixed(2)}`}
              icon={TrendingUp}
              trend="up"
            />
            <StatCard
              title="Day Low"
              value={`₹${equityData.priceInfo.intraDayHighLow.min.toFixed(2)}`}
              icon={TrendingUp}
              trend="down"
            />
            <StatCard
              title="Previous Close"
              value={`₹${equityData.priceInfo.previousClose.toFixed(2)}`}
              icon={BarChart3}
            />
          </div>

          {/* Charts */}
          {chartData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Chart (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value: any) => format(new Date(value), 'MMM dd')}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(value: any) => format(new Date(value), 'MMM dd, yyyy')}
                      formatter={(value: any) => [`₹${value.toFixed(2)}`, 'Price']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Chart (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value: any) => format(new Date(value), 'MMM dd')}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(value: any) => format(new Date(value), 'MMM dd, yyyy')}
                      formatter={(value: any) => [value.toLocaleString('en-IN'), 'Volume']}
                    />
                    <Bar dataKey="volume" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Depth */}
            {tradeInfo?.marketDeptOrderBook && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 text-primary-600 mr-2" />
                  Market Depth
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Buy Orders</h4>
                    <div className="space-y-1">
                      {tradeInfo.marketDeptOrderBook.bid.slice(0, 5).map((bid: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-success-600">₹{bid.price.toFixed(2)}</span>
                          <span className="text-gray-600">{bid.quantity.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Sell Orders</h4>
                    <div className="space-y-1">
                      {tradeInfo.marketDeptOrderBook.ask.slice(0, 5).map((ask: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-danger-600">₹{ask.price.toFixed(2)}</span>
                          <span className="text-gray-600">{ask.quantity.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Corporate Announcements */}
            {corporateInfo?.latest_announcements && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 text-primary-600 mr-2" />
                  Recent Announcements
                </h3>
                <div className="space-y-3">
                  {corporateInfo.latest_announcements.data.slice(0, 5).map((announcement: any, index: number) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-4">
                      <p className="text-sm font-medium text-gray-900">{announcement.subject}</p>
                      <p className="text-xs text-gray-500">{announcement.broadcastdate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};