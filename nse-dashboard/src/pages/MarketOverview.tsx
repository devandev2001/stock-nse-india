import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/Common/StatCard';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { ErrorMessage } from '../components/Common/ErrorMessage';
import { apiService } from '../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign,
  BarChart3,
  Users
} from 'lucide-react';

export const MarketOverview: React.FC = () => {
  const [marketData, setMarketData] = useState<any>(null);
  const [allIndices, setAllIndices] = useState<any>(null);
  const [gainersLosers, setGainersLosers] = useState<any>(null);
  const [mostActive, setMostActive] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [marketStatus, indices, nifty50GainersLosers, nifty50MostActive] = await Promise.all([
        apiService.getMarketStatus(),
        apiService.getAllIndices(),
        apiService.getGainersLosers('NIFTY 50'),
        apiService.getMostActive('NIFTY 50')
      ]);

      setMarketData(marketStatus);
      setAllIndices(indices);
      setGainersLosers(nifty50GainersLosers);
      setMostActive(nifty50MostActive);
    } catch (err) {
      setError('Failed to fetch market data. Please check if the API server is running.');
      console.error('Error fetching market data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh data every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading market overview..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  const nifty50 = allIndices?.data?.find((index: any) => index.indexSymbol === 'NIFTY 50');
  const sensex = allIndices?.data?.find((index: any) => index.indexSymbol === 'NIFTY BANK');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Market Overview</h2>
        <p className="text-gray-600">Real-time market data and key indices performance</p>
      </div>

      {/* Key Indices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {nifty50 && (
          <StatCard
            title="NIFTY 50"
            value={nifty50.last}
            change={nifty50.variation}
            changePercent={nifty50.percentChange}
            icon={BarChart3}
            trend={nifty50.variation > 0 ? 'up' : 'down'}
          />
        )}
        {sensex && (
          <StatCard
            title="NIFTY BANK"
            value={sensex.last}
            change={sensex.variation}
            changePercent={sensex.percentChange}
            icon={BarChart3}
            trend={sensex.variation > 0 ? 'up' : 'down'}
          />
        )}
        {gainersLosers && (
          <>
            <StatCard
              title="Top Gainers"
              value={gainersLosers.gainers?.length || 0}
              icon={TrendingUp}
              subtitle="NIFTY 50 stocks"
            />
            <StatCard
              title="Top Losers"
              value={gainersLosers.losers?.length || 0}
              icon={TrendingDown}
              subtitle="NIFTY 50 stocks"
            />
          </>
        )}
      </div>

      {/* Market Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        {gainersLosers?.gainers && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 text-success-600 mr-2" />
                Top Gainers (NIFTY 50)
              </h3>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="table-header">Symbol</th>
                    <th className="table-header">Price</th>
                    <th className="table-header">Change</th>
                    <th className="table-header">% Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gainersLosers.gainers.slice(0, 5).map((stock: any) => (
                    <tr key={stock.symbol} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">{stock.symbol}</td>
                      <td className="table-cell">₹{stock.lastPrice.toFixed(2)}</td>
                      <td className="table-cell">
                        <span className="status-positive">
                          +{stock.change.toFixed(2)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="status-positive">
                          +{stock.pChange.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Losers */}
        {gainersLosers?.losers && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingDown className="h-5 w-5 text-danger-600 mr-2" />
                Top Losers (NIFTY 50)
              </h3>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="table-header">Symbol</th>
                    <th className="table-header">Price</th>
                    <th className="table-header">Change</th>
                    <th className="table-header">% Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gainersLosers.losers.slice(0, 5).map((stock: any) => (
                    <tr key={stock.symbol} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">{stock.symbol}</td>
                      <td className="table-cell">₹{stock.lastPrice.toFixed(2)}</td>
                      <td className="table-cell">
                        <span className="status-negative">
                          {stock.change.toFixed(2)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="status-negative">
                          {stock.pChange.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Most Active Stocks */}
      {mostActive && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 text-primary-600 mr-2" />
                Most Active by Volume
              </h3>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="table-header">Symbol</th>
                    <th className="table-header">Price</th>
                    <th className="table-header">Volume</th>
                    <th className="table-header">% Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mostActive.byVolume.slice(0, 5).map((stock: any) => (
                    <tr key={stock.symbol} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">{stock.symbol}</td>
                      <td className="table-cell">₹{stock.lastPrice.toFixed(2)}</td>
                      <td className="table-cell">{stock.totalTradedVolume.toLocaleString('en-IN')}</td>
                      <td className="table-cell">
                        <span className={stock.pChange >= 0 ? 'status-positive' : 'status-negative'}>
                          {stock.pChange > 0 ? '+' : ''}{stock.pChange.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 text-primary-600 mr-2" />
                Most Active by Value
              </h3>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="table-header">Symbol</th>
                    <th className="table-header">Price</th>
                    <th className="table-header">Value (₹ Cr)</th>
                    <th className="table-header">% Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mostActive.byValue.slice(0, 5).map((stock: any) => (
                    <tr key={stock.symbol} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">{stock.symbol}</td>
                      <td className="table-cell">₹{stock.lastPrice.toFixed(2)}</td>
                      <td className="table-cell">{(stock.totalTradedValue / 10000000).toFixed(2)}</td>
                      <td className="table-cell">
                        <span className={stock.pChange >= 0 ? 'status-positive' : 'status-negative'}>
                          {stock.pChange > 0 ? '+' : ''}{stock.pChange.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* All Indices Overview */}
      {allIndices?.data && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 text-primary-600 mr-2" />
              Key Indices Performance
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allIndices.data
              .filter((index: any) => ['BROAD MARKET INDICES', 'SECTORAL INDICES'].includes(index.key))
              .slice(0, 12)
              .map((index: any) => (
                <div key={index.indexSymbol} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-sm font-medium text-gray-900">{index.indexSymbol}</div>
                  <div className="text-lg font-bold text-gray-900 mt-1">{index.last.toFixed(2)}</div>
                  <div className={`text-sm mt-1 ${index.variation >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {index.variation > 0 ? '+' : ''}{index.variation.toFixed(2)} ({index.percentChange > 0 ? '+' : ''}{index.percentChange.toFixed(2)}%)
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};