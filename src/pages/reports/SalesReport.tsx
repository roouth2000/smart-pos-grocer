import React from 'react';
import { BarChart, TrendingUp, Calendar } from 'lucide-react';

const SalesReport: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Sales Report</h2>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium">
                        <Calendar size={16} /> Last 30 Days
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Export CSV</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Sales', value: '₹1,24,500', change: '+12%', icon: BarChart, color: 'text-indigo-600 bg-indigo-50' },
                    { label: 'Orders', value: '1,432', change: '+5%', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
                    { label: 'Avg. Order Value', value: '₹840', change: '-2%', icon: Calendar, color: 'text-amber-600 bg-amber-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.color} dark:bg-opacity-20`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">{stat.value}</h3>
                        <p className="text-slate-500 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 h-64 flex items-center justify-center text-slate-400">
                Chart Visualization Placeholder
            </div>
        </div>
    );
};

export default SalesReport;
