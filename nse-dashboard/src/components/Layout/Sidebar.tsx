import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  PieChart,
  Activity,
  Building2
} from 'lucide-react';

const navigation = [
  { name: 'Market Overview', href: '/', icon: Home },
  { name: 'Equity Details', href: '/equity', icon: TrendingUp },
  { name: 'Index Analysis', href: '/indices', icon: BarChart3 },
  { name: 'Option Chain', href: '/options', icon: PieChart },
  { name: 'Market Activity', href: '/activity', icon: Activity },
  { name: 'Corporate Info', href: '/corporate', icon: Building2 },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 pt-16">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-5 w-5"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};