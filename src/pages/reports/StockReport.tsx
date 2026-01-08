import React from 'react';

const StockReport: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Stock Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Low Stock', 'Out of Stock', 'Overstocked', 'Moving Fast'].map(status => (
                    <div key={status} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <p className="text-slate-500 text-sm mb-1">{status} Items</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{Math.floor(Math.random() * 50)}</h3>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="font-semibold mb-4 text-slate-800 dark:text-slate-100">Stock Alerts</h3>
                <ul className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <li key={i} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-red-700 dark:text-red-400">
                            <span>Item XYZ is below threshold (5 remaining)</span>
                            <button className="text-xs font-bold underline">Reorder</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default StockReport;
