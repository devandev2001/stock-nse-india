import React, { useState, useEffect } from 'react';
import { Search, BarChart3, TrendingUp, Activity } from 'lucide-react';
import { StatCard } from '../components/Common/StatCard';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { ErrorMessage } from '../components/Common/ErrorMessage';
import { apiService } from '../services/api';

export const IndexAnalysis: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState('NIFTY 50');
  const [indexNames, setIndexNames] = useState<any[]>([]);
  const [indexData, setIndexData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndexNames = async () => {
      try {
        const names = await apiService.getIndexNames();
        setIndexNames(names.data || []);
      } catch (err) {
        console.error('Error fetching index names:', err);
      }
    };

    fetchIndexNames();
  }, []);

  const fetchIndexData = async (indexSymbol: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiService.getIndexDetails(indexSymbol);
      setIndexData(data);
    } catch (err) {
      setError(`Failed to fetch data for ${indexSymbol}`);
      console.error('Error fetching index data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIndex) {
      fetchIndexData(selectedIndex);
    }
  }, [selectedIndex]);

  const popularIndices = [
    'NIFTY 50', 'NIFTY BANK', 'NIFTY AUTO', 'NIFTY IT', 'NIFTY PHARMA',
    'NIFTY FMCG', 'NIFTY METAL', 'NIFTY ENERGY', 'NIFTY REALTY', 'NIFTY MEDIA'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Index Analysis</h2>
        <p className="text-gray-600">Analyze NSE indices and their constituents</p>
      </div>

      {/* Index Selection */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Index
            </label>
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(e.target.value)}
              className="input-field"
            >
              <option value="">Choose an index...</option>
              {popularIndices.map((index) => (
                <option key={index} value={index}>{index}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {popularIndices.slice(0, 5).map((index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedIndex === index
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner text={`Loading ${selectedIndex} data...`} />}

      {error && <ErrorMessage message={error} onRetry={() => fetchIndexData(selectedIndex)} />}

      {indexData && !loading && (
        <div className="space-y-6 animate-slide-up">
          {/* Index Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Index Value"
              value={indexData.metadata.last.toFixed(2)}
              change={indexData.metadata.change}
              changePercent={indexData.metadata.percChange}
              icon={BarChart3}
            />
            <StatCard
              title="Day High"
              value={indexData.metadata.high.toFixed(2)}
              icon={TrendingUp}
              trend="up"
            />
            <StatCard
              title="Day Low"
              value={indexData.metadata.low.toFixed(2)}
              icon={TrendingUp}
              trend="down"
            />
            <StatCard
              title="Total Volume"
              value={indexData.metadata.totalTradedVolume.toLocaleString('en-IN')}
              icon={Activity}
              subtitle="Shares traded"
            />
          </div>

          {/* Advance/Decline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Advances"
              value={indexData.advance.advances}
              icon={TrendingUp}
              trend="up"
            />
            <StatCard
              title="Declines"
              value={indexData.advance.declines}
              icon={TrendingUp}
              trend="down"
            />
            <StatCard
              title="Unchanged"
              value={indexData.advance.unchanged}
              icon={Activity}
              trend="neutral"
            />
          </div>

          {/* Constituents Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Index Constituents</h3>
              <span className="text-sm text-gray-500">{indexData.data.length} stocks</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="table-header">Symbol</th>
                    <th className="table-header">Last Price</th>
                    <th className="table-header">Change</th>
                    <th className="table-header">% Change</th>
                    <th className="table-header">Volume</th>
                    <th className="table-header">Value (₹ Cr)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {indexData.data
                    .sort((a: any, b: any) => b.pChange - a.pChange)
                    .map((stock: any) => (
                    <tr key={stock.symbol} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">{stock.symbol}</td>
                      <td className="table-cell">₹{stock.lastPrice.toFixed(2)}</td>
                      <td className="table-cell">
                        <span className={stock.change >= 0 ? 'status-positive' : 'status-negative'}>
                          {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={stock.pChange >= 0 ? 'status-positive' : 'status-negative'}>
                          {stock.pChange > 0 ? '+' : ''}{stock.pChange.toFixed(2)}%
                        </span>
                      </td>
                      <td className="table-cell">{stock.totalTradedVolume.toLocaleString('en-IN')}</td>
                      <td className="table-cell">{(stock.totalTradedValue / 10000000).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};