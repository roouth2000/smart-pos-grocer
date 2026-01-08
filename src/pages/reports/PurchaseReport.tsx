import React from 'react';
import { DollarSign, Package } from 'lucide-react';

const PurchaseReport: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Purchase Report</h2>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">PO Number</th>
                            <th className="px-6 py-4">Vendor</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {[1, 2, 3, 4, 5].map(i => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">PO-2024-00{i}</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Vendor {String.fromCharCode(64 + i)}</td>
                                <td className="px-6 py-4 text-slate-500">Jan {10 + i}, 2026</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        Completed
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-800 dark:text-slate-100">₹{i * 1500 + 450}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PurchaseReport;
