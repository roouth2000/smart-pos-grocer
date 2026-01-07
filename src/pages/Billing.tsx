import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, Download, ImageIcon } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    categoryId: string;
    image?: string;
}

interface CartItem extends Product {
    quantity: number;
}

const Billing: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) setProducts(JSON.parse(savedProducts));
    }, []);

    const addToCart = (product: Product) => {
        if (product.stock <= 0) {
            alert('Product out of stock!');
            return;
        }

        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                alert('Not enough stock!');
                return;
            }
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                const product = products.find(p => p.id === id);
                if (newQty > 0 && product && newQty <= product.stock) {
                    return { ...item, quantity: newQty };
                }
            }
            return item;
        }));
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCheckout = () => {
        if (cart.length === 0) return;

        if (!window.confirm('Are you sure you want to complete this checkout?')) return;

        const updatedProducts = products.map(p => {
            const cartItem = cart.find(item => item.id === p.id);
            if (cartItem) {
                return { ...p, stock: p.stock - cartItem.quantity };
            }
            return p;
        });

        localStorage.setItem('products', JSON.stringify(updatedProducts));
        setProducts(updatedProducts);

        const transaction = {
            id: Date.now().toString(),
            items: cart,
            total: calculateSubtotal(),
            date: new Date().toISOString()
        };
        const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        localStorage.setItem('transactions', JSON.stringify([...savedTransactions, transaction]));

        alert('Checkout successful!');
        setCart([]);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
            {/* Product Selection Area */}
            <div className="flex-1 flex flex-col min-w-0 space-y-6">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden text-left hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 group flex flex-col"
                            >
                                <div className="aspect-square w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-black shadow-sm ${product.stock <= 5 ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-slate-900/90 dark:text-white backdrop-blur-md'
                                        }`}>
                                        Stock: {product.stock}
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{product.name}</h4>
                                    <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">${product.price.toFixed(2)}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Sidebar Area */}
            <div className="w-full lg:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col flex-shrink-0 overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold dark:text-white">Active Cart</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{cart.length} unique items</p>
                    </div>
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <ShoppingCart size={18} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-3 py-10">
                            <ShoppingCart size={48} className="opacity-20" />
                            <p className="font-bold text-sm">Cart is empty</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/30">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1 flex-1">{item.name}</h4>
                                    <span className="font-black text-slate-900 dark:text-white text-sm ml-2">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"><Minus size={14} /></button>
                                        <span className="w-6 text-center font-black dark:text-white text-xs">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"><Plus size={14} /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="space-y-1">
                        <div className="flex justify-between text-slate-500 dark:text-slate-400 text-sm font-medium">
                            <span>Subtotal</span>
                            <span>${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-black dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                            <span>Total</span>
                            <span>${calculateSubtotal().toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-2xl font-black text-base shadow-xl shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer"
                        disabled={cart.length === 0}
                        onClick={handleCheckout}
                    >
                        <Download size={20} />
                        <span>Complete Order</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Billing;
