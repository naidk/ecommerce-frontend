import { useQuery } from '@tanstack/react-query';
import { productService } from '../productService';
import ProductCard from '../components/ProductCard';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const ProductListPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getAllProducts(),
    });

    const filteredProducts = products?.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-96 text-red-500">
                <AlertCircle className="w-12 h-12 mb-4" />
                <h2 className="text-xl font-bold">Failed to load products</h2>
                <p className="text-gray-600 mt-2">Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
                    <p className="text-gray-500 mt-1">Explore our premium collection</p>
                </div>

                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search query.</p>
                </div>
            )}
        </div>
    );
};

export default ProductListPage;
