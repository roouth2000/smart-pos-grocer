import React from 'react';
import { User, Shield } from 'lucide-react';

const UserManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">User Management</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg transition">Add User</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">User {i}</h3>
                            <p className="text-sm text-slate-500 mb-2">user{i}@example.com</p>
                            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded w-fit">
                                <Shield size={12} />
                                <span>{i === 1 ? 'Super Admin' : 'Sales Agent'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;
