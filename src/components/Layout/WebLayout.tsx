import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
    LayoutDashboard,
    Package,
    Tag,
    LogOut,
    ShoppingCart,
    Sun,
    Moon,
    User,
    Bell,
    BarChart
} from 'lucide-react';

const WebLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Submenu States
    const [salesOpen, setSalesOpen] = useState(location.pathname.startsWith('/sales'));
    const [reportsOpen, setReportsOpen] = useState(location.pathname.startsWith('/reports'));
    const [usersOpen, setUsersOpen] = useState(location.pathname.startsWith('/users') || location.pathname.startsWith('/roles'));

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { name: 'Product POS', icon: <ShoppingCart size={20} />, path: '/billing' },
        { name: 'Inventory', icon: <Package size={20} />, path: '/products' },
        { name: 'Categories', icon: <Tag size={20} />, path: '/categories' },
        { name: 'Purchase', icon: <ShoppingCart size={20} className="rotate-180" />, path: '/purchase' },
        { name: 'Branch', icon: <LayoutDashboard size={20} />, path: '/branches' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper for submenus
    const renderSubMenu = (
        label: string,
        icon: React.ReactNode,
        isOpen: boolean,
        setIsOpen: (v: boolean) => void,
        basePath: string,
        items: { name: string, path: string }[]
    ) => (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
            ${location.pathname.startsWith(basePath)
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span>{label}</span>
                </div>
            </button>

            {isOpen && (
                <div className="ml-6 mt-2 space-y-1">
                    {items.map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all
                        ${location.pathname === item.path
                                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        Smart POS
                    </h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                            ${location.pathname === item.path
                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </button>
                    ))}

                    {/* Sales Menu */}
                    {renderSubMenu(
                        'Sales', <Tag size={20} />, salesOpen, setSalesOpen, '/sales',
                        [
                            { name: 'Sales of Order', path: '/sales/order' },
                        ]
                    )}

                    {/* Reports Menu */}
                    {renderSubMenu(
                        'Reports', <BarChart size={20} />, reportsOpen, setReportsOpen, '/reports',
                        [
                            { name: 'Sales Report', path: '/reports/sales' },
                            { name: 'Purchase Report', path: '/reports/purchase' },
                            { name: 'Stock Report', path: '/reports/stock' },
                            { name: 'Stock Maintenance', path: '/reports/maintenance' }
                        ]
                    )}

                    {/* User Management Menu */}
                    {renderSubMenu(
                        'User Mgmt', <User size={20} />, usersOpen, setUsersOpen, '/users',
                        [
                            { name: 'All Users', path: '/users' },
                            { name: 'Roles & Perms', path: '/roles' }
                        ]
                    )}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-semibold"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {menuItems.find(i => i.path === location.pathname)?.name ||
                            (location.pathname.startsWith('/sales') ? 'Sales' :
                                location.pathname.startsWith('/reports') ? 'Reports' :
                                    location.pathname.startsWith('/users') ? 'User Management' : 'Welcome')}
                    </h1>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <button className="relative p-2.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                        </button>

                        <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                    {user?.role}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <User size={24} />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default WebLayout;
