import { useCartStore } from '../cartStore';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
    const totalPrice = total();

    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">Looks like you haven't added anything yet.</p>
                <Link
                    to="/products"
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center p-6 border-b border-gray-100 last:border-b-0">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 mr-6">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                            )}
                        </div>

                        <div className="flex-grow">
                            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                            <p className="text-gray-500 text-sm">${item.price.toFixed(2)}</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-2 hover:bg-gray-50 text-gray-600"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 font-medium">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-50 text-gray-600"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 p-2"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-between items-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <button
                        onClick={clearCart}
                        className="text-gray-500 hover:text-red-500 text-sm underline"
                    >
                        Clear Cart
                    </button>
                </div>
                <div className="text-right">
                    <p className="text-gray-500 mb-1">Total</p>
                    <p className="text-3xl font-bold text-gray-900 mb-6">${totalPrice.toFixed(2)}</p>
                    <div className="flex gap-4">
                        <Link
                            to="/products"
                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            to="/checkout"
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            Proceed to Checkout <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
