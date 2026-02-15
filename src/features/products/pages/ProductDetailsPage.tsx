import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../productService';
import { useCartStore } from '../../cart/cartStore';
import { Loader2, ArrowLeft, ShoppingCart, Check, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const addItem = useCartStore(state => state.addItem);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProductById(id!),
        enabled: !!id,
    });

    const handleAddToCart = () => {
        if (product) {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to add items to cart');
                navigate('/login');
                return;
            }
            addItem(product);
            toast.success('Added to cart!');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-500">Product not found</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Go back to products
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <button
                onClick={() => navigate('/products')}
                className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Catalog
            </button>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center min-h-[400px]">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="max-h-[400px] object-contain" />
                    ) : (
                        <span className="text-gray-300 text-xl">No Image Available</span>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                            {product.active ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <Check className="w-3 h-3 mr-1" /> In Stock ({product.inventory})
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Out of Stock
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-lg text-gray-600 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="pt-6 border-t border-gray-100 space-y-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Shield className="w-5 h-5 text-blue-500" />
                            <span>Enterprise-grade warranty included</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transform active:scale-95 duration-200"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                        </button>
                        <button className="flex-1 bg-white text-gray-900 font-bold py-4 px-8 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
