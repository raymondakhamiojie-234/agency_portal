import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 font-medium text-sm">{title}</h3>
        <div className="text-primary bg-primary/10 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      
      <div>
        <h4 className="text-3xl font-bold text-white tracking-tight">{value}</h4>
        
        <div className="flex items-center mt-2 space-x-2">
          {trend && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
              trend.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-gray-500">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
