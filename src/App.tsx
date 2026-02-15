import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./features/auth/login/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/register/RegisterPage'));
const ProductListPage = lazy(() => import('./features/products/pages/ProductListPage'));
const ProductDetailsPage = lazy(() => import('./features/products/pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./features/cart/pages/CartPage'));
const CheckoutPage = lazy(() => import('./features/checkout/pages/CheckoutPage'));
const OrderHistoryPage = lazy(() => import('./features/orders/pages/OrderHistoryPage'));

const PageLoader = () => (
    <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
);

function App() {
    return (
        <Router>
            <Layout>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/products" element={<ProductListPage />} />
                        <Route path="/products/:id" element={<ProductDetailsPage />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/orders" element={<OrderHistoryPage />} />
                        </Route>
                    </Routes>
                </Suspense>
            </Layout>
        </Router>
    );
}

export default App;
