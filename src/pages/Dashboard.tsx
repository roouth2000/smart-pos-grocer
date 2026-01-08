import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, Package, Users, DollarSign, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';

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

    // Calculate total revenue from transactions
    const totalRevenue = recentTransactions.reduce((acc, curr) => acc + (curr.total || 0), 0);

    const stats = [
        {
            label: 'Total Revenue',
            value: `₹${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            trend: '+12.5%',
            positive: true,
            icon: <DollarSign className="text-emerald-500" size={24} />,
            bg: 'bg-emerald-50 dark:bg-emerald-900/20'
        },
        {
            label: 'Total Orders',
            value: recentTransactions.length.toString(),
            trend: '+5 today',
            positive: true,
            icon: <ShoppingCart className="text-blue-500" size={24} />,
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: 'Active Products',
            value: getProductsCount().toString(),
            trend: 'In Stock',
            positive: true,
            icon: <Package className="text-indigo-500" size={24} />,
            bg: 'bg-indigo-50 dark:bg-indigo-900/20'
        },
        {
            label: 'Total Customers',
            value: '142',
            trend: '+3 new',
            positive: true,
            icon: <Users className="text-amber-500" size={24} />,
            bg: 'bg-amber-50 dark:bg-amber-900/20'
        }
    ];

    // Mock Data for Charts
    const salesData = [
        { name: 'Mon', revenue: 4000, orders: 2400, amt: 2400 },
        { name: 'Tue', revenue: 3000, orders: 1398, amt: 2210 },
        { name: 'Wed', revenue: 2000, orders: 9800, amt: 2290 },
        { name: 'Thu', revenue: 2780, orders: 3908, amt: 2000 },
        { name: 'Fri', revenue: 1890, orders: 4800, amt: 2181 },
        { name: 'Sat', revenue: 2390, orders: 3800, amt: 2500 },
        { name: 'Sun', revenue: 3490, orders: 4300, amt: 2100 },
    ];

    const orderStats = [
        { name: 'Week 1', online: 400, offline: 240 },
        { name: 'Week 2', online: 300, offline: 139 },
        { name: 'Week 3', online: 200, offline: 980 },
        { name: 'Week 4', online: 278, offline: 390 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
                        Download Report
                    </button>
                    <button
                        onClick={() => navigate('/billing')}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                    >
                        <ShoppingCart size={18} />
                        <span>New Sale</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                {stat.icon}
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${stat.positive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <Activity size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Revenue Analytics</h3>
                        </div>
                        <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-3 py-1 outline-none focus:ring-2 focus:ring-indigo-500/20">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f033" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">Order Statistics</h3>
                        <p className="text-sm text-slate-500">Online vs Offline Orders</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={orderStats}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f033" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="online" name="Online" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="offline" name="In-Store" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
                    <button className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">View All Transactions</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                                        No recent transactions found.
                                    </td>
                                </tr>
                            ) : (
                                recentTransactions.map((t, index) => (
                                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {new Date(t.date || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500 dark:text-slate-400">
                                            ORD-{Math.floor(Math.random() * 10000)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            {t.items?.length || 0} products
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">
                                                Completed
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white text-right">
                                            ₹{(t.total || 0).toFixed(2)}
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
