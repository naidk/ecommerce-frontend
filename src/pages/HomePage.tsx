import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative bg-blue-600 rounded-3xl overflow-hidden text-white py-20 px-8 text-center md:text-left">
                <div className="max-w-2xl relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Elevate Your Shopping Experience
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8">
                        Discover premium products curated for the modern enterprise. Scale your lifestyle with ShopEnterprise.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link to="/products" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                            Browse Products <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/register" className="bg-blue-700 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-800 transition-colors flex items-center justify-center">
                            Join Now
                        </Link>
                    </div>
                </div>
                {/* Abstract shapes/bg can be added here or via CSS */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500 to-transparent opacity-50 hidden md:block"></div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Curated Selection</h3>
                    <p className="text-gray-600">Hand-picked items that meet the highest standards of quality and design.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
                    <p className="text-gray-600">Enterprise-grade security ensuring your data and payments are always safe.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                        <Truck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                    <p className="text-gray-600">Efficient logistics network to get your products to you in record time.</p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
