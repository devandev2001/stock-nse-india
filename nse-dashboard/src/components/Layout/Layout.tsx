import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { apiService } from '../../services/api';

export const Layout: React.FC = () => {
  const [marketStatus, setMarketStatus] = useState<any>(null);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const status = await apiService.getMarketStatus();
        setMarketStatus(status);
      } catch (error) {
        console.error('Failed to fetch market status:', error);
      }
    };

    fetchMarketStatus();
    // Refresh market status every 30 seconds
    const interval = setInterval(fetchMarketStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header marketStatus={marketStatus} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none md:ml-64">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};