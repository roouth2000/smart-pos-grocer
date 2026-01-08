import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Upload, ImageIcon, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    categoryId: string;
    price: number;
    stock: number;
    image?: string;
}

interface Category {
    id: string;
    name: string;
}

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        price: 0,
        stock: 0,
        image: ''
    });

    useEffect(() => {
        const savedProducts = localStorage.getItem('products');
        const savedCategories = localStorage.getItem('categories');
        if (savedProducts) setProducts(JSON.parse(savedProducts));
        if (savedCategories) setCategories(JSON.parse(savedCategories));
    }, []);

    const saveToLocalStorage = (newProducts: Product[]) => {
        localStorage.setItem('products', JSON.stringify(newProducts));
        setProducts(newProducts);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            const updated = products.map(p =>
                p.id === editingProduct.id ? { ...p, ...formData } : p
            );
            saveToLocalStorage(updated);
        } else {
            const newProduct: Product = {
                id: Date.now().toString(),
                ...formData
            };
            saveToLocalStorage([...products, newProduct]);
        }
        closeModal();
    };

    const deleteProduct = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const updated = products.filter(p => p.id !== id);
            saveToLocalStorage(updated);
        }
    };

    const openModal = (product: Product | null = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                categoryId: product.categoryId,
                price: product.price,
                stock: product.stock,
                image: product.image || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                categoryId: categories[0]?.id || '',
                price: 0,
                stock: 0,
                image: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const getCategoryName = (id: string) => {
        return categories.find(c => c.id === id)?.name || 'Unknown';
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory Items</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your product stock and pricing</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    <span>Add Product</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {paginatedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-slate-100 dark:border-slate-700" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                )}
                                                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                                                {getCategoryName(product.categoryId)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700 dark:text-slate-300">
                                            ${product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {product.stock} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                            <button
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                onClick={() => openModal(product)}
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                onClick={() => deleteProduct(product.id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-400"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Simple logic to show first 5 pages or dynamic window could be implemented
                                // For now, simple standard pages
                                let pageNum = i + 1;
                                if (totalPages > 5 && currentPage > 3) {
                                    pageNum = currentPage - 2 + i;
                                }
                                if (pageNum > totalPages) return null;

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-all
                                            ${currentPage === pageNum
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-400"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold dark:text-white">{editingProduct ? 'Update Product' : 'New Product'}</h2>
                            <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 sm:col-span-1 space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Product Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                                        placeholder="e.g. Fresh Apples"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1 space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1 space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1 space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Product Image</label>
                                <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="text-slate-300" size={32} />
                                        )}
                                    </div>
                                    <label className="flex-1 cursor-pointer">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                                            <Upload size={20} />
                                            <span>{formData.image ? 'Change Image' : 'Upload Image'}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95">
                                    <Check size={20} />
                                    <span>{editingProduct ? 'Update' : 'Save'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
