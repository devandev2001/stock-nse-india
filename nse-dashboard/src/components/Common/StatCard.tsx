import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changePercent?: number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changePercent,
  icon: Icon,
  trend,
  subtitle
}) => {
  const getTrendColor = () => {
    if (trend === 'up' || (change && change > 0)) return 'text-success-600';
    if (trend === 'down' || (change && change < 0)) return 'text-danger-600';
    return 'text-gray-600';
  };

  const getTrendBg = () => {
    if (trend === 'up' || (change && change > 0)) return 'bg-success-50';
    if (trend === 'down' || (change && change < 0)) return 'bg-danger-50';
    return 'bg-gray-50';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {(change !== undefined || changePercent !== undefined) && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getTrendBg()} ${getTrendColor()}`}>
              {change !== undefined && (
                <span>{change > 0 ? '+' : ''}{change.toFixed(2)}</span>
              )}
              {changePercent !== undefined && (
                <span className="ml-1">({changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%)</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  );
};