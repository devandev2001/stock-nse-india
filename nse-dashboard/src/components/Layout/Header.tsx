import React from 'react';
import { TrendingUp, Clock, Activity } from 'lucide-react';

interface HeaderProps {
  marketStatus?: {
    marketState: Array<{
      market: string;
      marketStatus: string;
      marketStatusMessage: string;
    }>;
  };
}

export const Header: React.FC<HeaderProps> = ({ marketStatus }) => {
  const mainMarket = marketStatus?.marketState?.find(m => m.market === 'Capital Market');
  const isMarketOpen = mainMarket?.marketStatus === 'Open';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">NSE Dashboard</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {new Date().toLocaleTimeString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  hour12: true 
                })}
              </span>
            </div>
            
            {mainMarket && (
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-gray-500" />
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  isMarketOpen 
                    ? 'bg-success-100 text-success-800' 
                    : 'bg-danger-100 text-danger-800'
                }`}>
                  {mainMarket.marketStatus}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};