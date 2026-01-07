import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('transactions');
        if (saved) {
            setRecentTransactions(JSON.parse(saved).slice(-5).reverse());
        }
    }, []);

    const getProductsCount = () => {
        try {
            return JSON.parse(localStorage.getItem('products') || '[]').length;
        } catch (e) {
            return 0;
        }
    };

    const stats = [
        {
            label: 'Total Sales',
            value: `$${recentTransactions.reduce((acc, curr) => acc + (curr.total || 0), 0).toFixed(2)}`,
            trend: '+12%',
            icon: <TrendingUp className="text-emerald-500" size={24} />,
            bg: 'bg-emerald-50 dark:bg-emerald-900/20'
        },
        {
            label: 'Total Orders',
            value: recentTransactions.length.toString(),
            trend: '+5',
            icon: <ShoppingCart className="text-blue-500" size={24} />,
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: 'Inventory',
            value: getProductsCount().toString(),
            trend: 'OK',
            icon: <Package className="text-indigo-500" size={24} />,
            bg: 'bg-indigo-50 dark:bg-indigo-900/20'
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Business Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your sales and inventory summary</p>
                </div>
                <button
                    onClick={() => navigate('/billing')}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                >
                    <ShoppingCart size={20} />
                    <span>New Bill</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
                    <button className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                                        No recent transactions to show.
                                    </td>
                                </tr>
                            ) : (
                                recentTransactions.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            {t.items.length} products
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">
                                                Completed
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white text-right">
                                            ${(t.total || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
