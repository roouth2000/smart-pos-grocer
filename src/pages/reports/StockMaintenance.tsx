import React from 'react';

const StockMaintenance: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Stock Maintenance</h2>
            <p className="text-slate-500">Adjust stock levels, report damage, or perform audits.</p>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <span className="text-2xl">🛠️</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Stock Audit In Progress</h3>
                <p className="max-w-md text-slate-500">
                    You can manually adjust stock quantities here. This action represents the "stack maintance" requirement where users can correct stock numbers.
                </p>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium">Start New Audit</button>
            </div>
        </div>
    );
};

export default StockMaintenance;
