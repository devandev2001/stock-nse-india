import React, { useState } from 'react';
import { Search, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { ErrorMessage } from '../components/Common/ErrorMessage';
import { apiService } from '../services/api';

export const OptionChain: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [optionType, setOptionType] = useState<'equity' | 'index' | 'commodity'>('equity');
  const [optionData, setOptionData] = useState<any>(null);
  const [selectedExpiry, setSelectedExpiry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!symbol.trim()) return;

    try {
      setLoading(true);
      setError(null);

      let data;
      switch (optionType) {
        case 'equity':
          data = await apiService.getEquityOptionChain(symbol);
          break;
        case 'index':
          data = await apiService.getIndexOptionChain(symbol);
          break;
        case 'commodity':
          data = await apiService.getCommodityOptionChain(symbol);
          break;
        default:
          throw new Error('Invalid option type');
      }

      setOptionData(data);
      if (data.records.expiryDates.length > 0) {
        setSelectedExpiry(data.records.expiryDates[0]);
      }
    } catch (err) {
      setError(`Failed to fetch option chain for ${symbol}`);
      console.error('Error fetching option chain:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredData = optionData?.records.data.filter((item: any) => 
    !selectedExpiry || item.expiryDate === selectedExpiry
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Option Chain</h2>
        <p className="text-gray-600">Analyze option chain data for equities, indices, and commodities</p>
      </div>

      {/* Search Section */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Option Type
            </label>
            <select
              value={optionType}
              onChange={(e) => setOptionType(e.target.value as any)}
              className="input-field"
            >
              <option value="equity">Equity</option>
              <option value="index">Index</option>
              <option value="commodity">Commodity</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symbol
            </label>
            <input
              type="text"
              placeholder={`Enter ${optionType} symbol`}
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              className="input-field"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={!symbol.trim() || loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Get Option Chain'}
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner text={`Fetching option chain for ${symbol}...`} />}

      {error && <ErrorMessage message={error} onRetry={handleSearch} />}

      {optionData && !loading && (
        <div className="space-y-6 animate-slide-up">
          {/* Expiry Selection */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Option Chain for {symbol}
              </h3>
              <div className="text-sm text-gray-600">
                Underlying: ₹{optionData.records.underlyingValue.toFixed(2)}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {optionData.records.expiryDates.map((expiry: string) => (
                <button
                  key={expiry}
                  onClick={() => setSelectedExpiry(expiry)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedExpiry === expiry
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {expiry}
                </button>
              ))}
            </div>
          </div>

          {/* Option Chain Table */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th colSpan={6} className="table-header text-center bg-success-50 text-success-800">
                      CALL OPTIONS
                    </th>
                    <th className="table-header text-center">Strike Price</th>
                    <th colSpan={6} className="table-header text-center bg-danger-50 text-danger-800">
                      PUT OPTIONS
                    </th>
                  </tr>
                  <tr>
                    <th className="table-header">OI</th>
                    <th className="table-header">Volume</th>
                    <th className="table-header">IV</th>
                    <th className="table-header">LTP</th>
                    <th className="table-header">Change</th>
                    <th className="table-header">% Change</th>
                    <th className="table-header font-bold">Strike</th>
                    <th className="table-header">% Change</th>
                    <th className="table-header">Change</th>
                    <th className="table-header">LTP</th>
                    <th className="table-header">IV</th>
                    <th className="table-header">Volume</th>
                    <th className="table-header">OI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((option: any) => (
                    <tr key={option.strikePrice} className="hover:bg-gray-50">
                      {/* Call Options */}
                      <td className="table-cell">{option.CE?.openInterest?.toLocaleString() || '-'}</td>
                      <td className="table-cell">{option.CE?.totalTradedVolume?.toLocaleString() || '-'}</td>
                      <td className="table-cell">{option.CE?.impliedVolatility?.toFixed(2) || '-'}</td>
                      <td className="table-cell font-medium">{option.CE?.lastPrice?.toFixed(2) || '-'}</td>
                      <td className="table-cell">
                        {option.CE?.change ? (
                          <span className={option.CE.change >= 0 ? 'text-success-600' : 'text-danger-600'}>
                            {option.CE.change > 0 ? '+' : ''}{option.CE.change.toFixed(2)}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="table-cell">
                        {option.CE?.pChange ? (
                          <span className={option.CE.pChange >= 0 ? 'text-success-600' : 'text-danger-600'}>
                            {option.CE.pChange > 0 ? '+' : ''}{option.CE.pChange.toFixed(2)}%
                          </span>
                        ) : '-'}
                      </td>
                      
                      {/* Strike Price */}
                      <td className="table-cell text-center font-bold bg-gray-50">
                        {option.strikePrice}
                      </td>
                      
                      {/* Put Options */}
                      <td className="table-cell">
                        {option.PE?.pChange ? (
                          <span className={option.PE.pChange >= 0 ? 'text-success-600' : 'text-danger-600'}>
                            {option.PE.pChange > 0 ? '+' : ''}{option.PE.pChange.toFixed(2)}%
                          </span>
                        ) : '-'}
                      </td>
                      <td className="table-cell">
                        {option.PE?.change ? (
                          <span className={option.PE.change >= 0 ? 'text-success-600' : 'text-danger-600'}>
                            {option.PE.change > 0 ? '+' : ''}{option.PE.change.toFixed(2)}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="table-cell font-medium">{option.PE?.lastPrice?.toFixed(2) || '-'}</td>
                      <td className="table-cell">{option.PE?.impliedVolatility?.toFixed(2) || '-'}</td>
                      <td className="table-cell">{option.PE?.totalTradedVolume?.toLocaleString() || '-'}</td>
                      <td className="table-cell">{option.PE?.openInterest?.toLocaleString() || '-'}</td>
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