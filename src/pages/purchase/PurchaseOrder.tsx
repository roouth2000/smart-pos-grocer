import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Printer } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';

type PurchaseItem = {
    id: number;
    name: string;
    cost: number;
    qty: number;
};

const PurchaseOrder: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [poNumber] = useState(`PO-${Date.now()}`);
    const [status, setStatus] = useState<'Draft' | 'Sent'>('Draft');
    const [vendor, setVendor] = useState('');
    const [items, setItems] = useState<PurchaseItem[]>([
        { id: 1, name: 'Raw Material A', cost: 50, qty: 100 },
        { id: 2, name: 'Packaging B', cost: 5, qty: 500 },
    ]);

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState<{ name: string; cost: string; qty: string }>({
        name: '',
        cost: '',
        qty: ''
    });

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + item.cost * item.qty, 0);
    };

    const handleAddItem = () => {
        if (!newItem.name || !newItem.cost || !newItem.qty) return;

        const item: PurchaseItem = {
            id: Date.now(),
            name: newItem.name,
            cost: Number(newItem.cost),
            qty: Number(newItem.qty)
        };

        setItems([...items, item]);
        setNewItem({ name: '', cost: '', qty: '' });
        setIsAddModalOpen(false);
    };

    const handleRemoveItem = (id: number) => {
        setItems(items.filter(i => i.id !== id));
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Purchase Order</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {poNumber} • <span className={`font-medium ${status === 'Draft' ? 'text-amber-500' : 'text-green-500'}`}>{status}</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                        <Printer size={18} />
                        <span>Print</span>
                    </button>
                    <button
                        onClick={() => setStatus('Sent')}
                        disabled={status === 'Sent'}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <Save size={18} />
                        <span>Save Order</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-6">
                    {/* Items Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Order Items</h3>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors font-medium border border-indigo-100 dark:border-indigo-900/50"
                            >
                                <Plus size={16} /> Add Item
                            </button>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            {items.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                    No items added yet. Click "Add Item" to start.
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Item Name</th>
                                            <th className="px-6 py-3 font-medium">Cost</th>
                                            <th className="px-6 py-3 font-medium">Quantity</th>
                                            <th className="px-6 py-3 font-medium text-right">Total</th>
                                            <th className="px-6 py-3 font-medium w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {items.map(item => (
                                            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-3 font-medium text-slate-700 dark:text-slate-200">{item.name}</td>
                                                <td className="px-6 py-3 text-slate-600 dark:text-slate-300">₹{item.cost}</td>
                                                <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{item.qty}</td>
                                                <td className="px-6 py-3 text-right font-medium text-slate-800 dark:text-slate-100">
                                                    ₹{(item.cost * item.qty).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Remove Item"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Customer/Vendor Info */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Vendor Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Vendor Name</label>
                                <input
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:font-normal"
                                    placeholder="Select or type vendor..."
                                    value={vendor}
                                    onChange={e => setVendor(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Delivery Expected</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700 dark:text-slate-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Order Summary</h3>
                        <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-800 text-sm">
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Subtotal</span>
                                <span>₹{calculateTotal().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Taxes (18%)</span>
                                <span>₹{(calculateTotal() * 0.18).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="pt-4 flex justify-between items-center font-bold text-lg text-indigo-600 dark:text-indigo-400">
                            <span>Total Payable</span>
                            <span>₹{(calculateTotal() * 1.18).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Purchase Item"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item Name</label>
                        <input
                            type="text"
                            value={newItem.name}
                            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Raw Material C"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost per Unit</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-400">₹</span>
                                <input
                                    type="number"
                                    value={newItem.cost}
                                    onChange={e => setNewItem({ ...newItem, cost: e.target.value })}
                                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                            <input
                                type="number"
                                value={newItem.qty}
                                onChange={e => setNewItem({ ...newItem, qty: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="1"
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddItem}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                        >
                            Add Item
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PurchaseOrder;
