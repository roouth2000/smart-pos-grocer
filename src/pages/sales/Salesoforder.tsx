import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Printer, FileText, CheckCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';

type Item = {
    id: number;
    name: string;
    price: number;
    qty: number;
};

const SalesOfOrder: React.FC = () => {
    const navigate = useNavigate();
    const [orderNo] = useState(`SOF-${Date.now()}`);
    const [status, setStatus] = useState<'Draft' | 'Confirmed'>('Draft');
    const [viewMode, setViewMode] = useState<'Entry' | 'Quotation'>('Entry');

    // Customer Details
    const [customer, setCustomer] = useState({
        name: '',
        phone: '',
        address: ''
    });

    // Financials
    const [discount, setDiscount] = useState(0);
    const [taxRate, setTaxRate] = useState(5);

    const [items, setItems] = useState<Item[]>([
        { id: 1, name: 'Item A', price: 120, qty: 1 },
        { id: 2, name: 'Item B', price: 80, qty: 2 },
    ]);

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', price: '', qty: '1' });

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discountAmount = Math.min(discount, subtotal);
    const taxAmount = ((subtotal - discountAmount) * taxRate) / 100;
    const grandTotal = subtotal - discountAmount + taxAmount;

    const handleAddItem = () => {
        if (!newItem.name || !newItem.price) return;

        setItems([...items, {
            id: Date.now(),
            name: newItem.name,
            price: Number(newItem.price),
            qty: Number(newItem.qty)
        }]);
        setNewItem({ name: '', price: '', qty: '1' });
        setIsAddModalOpen(false);
    };

    const confirmOrder = () => {
        setStatus('Confirmed');
    };

    if (viewMode === 'Quotation') {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-4 mb-6 print:hidden">
                    <button
                        onClick={() => setViewMode('Entry')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-2xl font-bold">Quotation View</h2>
                    <div className="ml-auto flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                            <Printer size={18} /> Print
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg max-w-3xl mx-auto print:shadow-none print:border-none">
                    <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-8 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">QUOTATION</h1>
                            <p className="text-slate-500">#{orderNo}</p>
                            <p className="text-slate-500">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-bold text-lg mb-1">Company Name</h3>
                            <p className="text-slate-500 text-sm">123 Business Rd</p>
                            <p className="text-slate-500 text-sm">City, State, 12345</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Bill To</h4>
                        <div className="text-lg font-medium">{customer.name || 'Walk-in Customer'}</div>
                        {customer.phone && <div className="text-slate-500">{customer.phone}</div>}
                        {customer.address && <div className="text-slate-500 max-w-sm">{customer.address}</div>}
                    </div>

                    <table className="w-full mb-8">
                        <thead className="border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="text-left py-3 font-semibold">Item</th>
                                <th className="text-right py-3 font-semibold">Price</th>
                                <th className="text-center py-3 font-semibold">Qty</th>
                                <th className="text-right py-3 font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td className="py-4 text-slate-800 dark:text-slate-200">{item.name}</td>
                                    <td className="py-4 text-right text-slate-600 dark:text-slate-400">₹{item.price}</td>
                                    <td className="py-4 text-center text-slate-600 dark:text-slate-400">{item.qty}</td>
                                    <td className="py-4 text-right font-medium">₹{item.price * item.qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end border-t border-slate-200 dark:border-slate-800 pt-6">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Discount</span>
                                <span>- ₹{discountAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Tax ({taxRate}%)</span>
                                <span>₹{taxAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl text-slate-800 dark:text-slate-100 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <span>Total</span>
                                <span>₹{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                        title="Go Back"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Sales Order</h2>
                        <p className="text-sm text-slate-500">
                            {orderNo} • <span className={`font-medium ${status === 'Draft' ? 'text-amber-500' : 'text-green-500'}`}>{status}</span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setViewMode('Quotation')}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                        <FileText size={18} />
                        <span>Get Quotation</span>
                    </button>
                    <button
                        onClick={confirmOrder}
                        disabled={status === 'Confirmed'}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
                    >
                        <CheckCircle size={18} />
                        <span>Confirm</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Order Items</h3>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                            >
                                <Plus size={16} /> Add Item
                            </button>
                        </div>

                        <div className="overflow-x-auto flex-1">
                            <table className="w-full">
                                <thead className="text-sm text-slate-500 border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="py-3 text-left font-medium pl-2">Item</th>
                                        <th className="py-3 font-medium">Price</th>
                                        <th className="py-3 font-medium">Qty</th>
                                        <th className="py-3 text-right font-medium">Total</th>
                                        <th className="py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {items.map(i => (
                                        <tr key={i.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-3 pl-2">
                                                <input
                                                    value={i.name}
                                                    onChange={e => setItems(items.map(it => it.id === i.id ? { ...it, name: e.target.value } : it))}
                                                    className="w-full bg-transparent border-none focus:ring-0 p-0 font-medium text-slate-700 dark:text-slate-200"
                                                />
                                            </td>
                                            <td className="py-3 text-center">
                                                <input
                                                    type="number"
                                                    value={i.price}
                                                    onChange={e => setItems(items.map(it => it.id === i.id ? { ...it, price: Number(e.target.value) } : it))}
                                                    className="w-20 bg-slate-50 dark:bg-slate-800 rounded px-2 py-1 text-center"
                                                />
                                            </td>
                                            <td className="py-3 text-center">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={i.qty}
                                                    disabled={status === 'Confirmed'}
                                                    onChange={e =>
                                                        setItems(items.map(it =>
                                                            it.id === i.id
                                                                ? { ...it, qty: Number(e.target.value) }
                                                                : it
                                                        ))
                                                    }
                                                    className="w-16 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                            </td>
                                            <td className="py-3 text-right font-medium text-slate-700 dark:text-slate-200">
                                                ₹{i.price * i.qty}
                                            </td>
                                            <td className="py-3 text-center">
                                                <button
                                                    onClick={() => setItems(items.filter(it => it.id !== i.id))}
                                                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-semibold mb-4 text-slate-800 dark:text-slate-100">Customer Details</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase">Name</label>
                                <input
                                    value={customer.name}
                                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                    placeholder="Customer Name"
                                    className="w-full px-3 py-2 mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase">Phone</label>
                                <input
                                    value={customer.phone}
                                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                    placeholder="Phone Number"
                                    className="w-full px-3 py-2 mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase">Address</label>
                                <textarea
                                    value={customer.address}
                                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                                    placeholder="Address"
                                    rows={2}
                                    className="w-full px-3 py-2 mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Payment Summary</h3>

                        <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                <span>Subtotal</span>
                                <span className="font-medium">₹{subtotal}</span>
                            </div>

                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                <span>Discount</span>
                                <div className="flex items-center gap-1">
                                    <span>- ₹</span>
                                    <input
                                        type="number"
                                        value={discount}
                                        disabled={status === 'Confirmed'}
                                        onChange={e => setDiscount(Number(e.target.value))}
                                        className="w-20 text-right bg-slate-50 dark:bg-slate-800 border-none rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                <span>Tax (%)</span>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        value={taxRate}
                                        disabled={status === 'Confirmed'}
                                        onChange={e => setTaxRate(Number(e.target.value))}
                                        className="w-16 text-right bg-slate-50 dark:bg-slate-800 border-none rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <span>%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center font-bold text-xl text-indigo-600">
                            <span>Grand Total</span>
                            <span>₹{grandTotal}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Sales Item"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item Name</label>
                        <input
                            type="text"
                            value={newItem.name}
                            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Product Name"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price</label>
                            <input
                                type="number"
                                value={newItem.price}
                                onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="0.00"
                            />
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
                            Add to Order
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SalesOfOrder;
