const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold">ShopEnterprise</h3>
                        <p className="text-gray-400 text-sm mt-1">Premium E-Commerce Solutions</p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
                    </div>
                    <div className="mt-4 md:mt-0 text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} ShopEnterprise. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
