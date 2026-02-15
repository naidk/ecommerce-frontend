import { ShoppingCart, User, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../features/cart/cartStore';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { itemCount, fetchCart } = useCartStore();
    const count = itemCount();
    const navigate = useNavigate();

    // Fetch cart on mount if user is logged in
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleLogout = () => {
        localStorage.clear();
        useCartStore.getState().clearCart();
        navigate('/login');
    };

    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-blue-600">ShopEnterprise</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/products" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Products</Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/cart" className="p-2 text-gray-600 hover:text-blue-600 relative">
                            <ShoppingCart className="h-6 w-6" />
                            {count > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                    {count}
                                </span>
                            )}
                        </Link>

                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/orders" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Orders</Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                                >
                                    <User className="h-6 w-6" />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                                <User className="h-6 w-6" />
                                <span className="text-sm font-medium">Login</span>
                            </Link>
                        )}

                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/products" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">Products</Link>
                        <Link to="/cart" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">Cart ({count})</Link>
                        {isLoggedIn ? (
                            <>
                                <Link to="/orders" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">My Orders</Link>
                                <button onClick={handleLogout} className="block w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">Login</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
