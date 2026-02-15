import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { Order, PaginatedResponse } from '../../../types';
import { Loader2, Package, Calendar, ChevronRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OrderHistoryPage = () => {
    const navigate = useNavigate();
    const customerId = localStorage.getItem('customerId');

    const { data: ordersPage, isLoading, error } = useQuery({
        queryKey: ['orders', customerId],
        queryFn: async () => {
            if (!customerId) return null;
            // The backend returns a Page<OrderResponseDTO>
            // GET /api/order/customer/{customerId}
            const response = await api.get<PaginatedResponse<Order>>(`/order/customer/${customerId}`);
            return response.data;
        },
        enabled: !!customerId,
    });

    const handlePayNow = async (orderId: string) => {
        try {
            // Simulate Payment
            // POST /api/payment/{orderId}
            await api.post(`/payment/${orderId}`);
            toast.success('Payment simulated successfully!');
            // In a real app, we would refresh the order status here
        } catch (error) {
            console.error('Payment simulation failed', error);
            toast.error('Payment failed.');
        }
    };

    if (!customerId) {
        return <div className="p-8 text-center">Please login to view orders.</div>;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Failed to load orders.</div>;
    }

    const orders = ordersPage?.content || [];

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="text-gray-500 mb-6">Looks like you haven't placed any orders.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="text-blue-600 hover:underline font-medium"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-400">Order ID: {order.id}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                    ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`
                                }>
                                    {order.status}
                                </span>
                                <span className="text-xl font-bold text-gray-900">${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-3 mb-6">
                                {order.orderItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">Img</div>
                                            <span className="font-medium text-gray-700">
                                                {item.product?.name || `Product`} <span className="text-gray-400">x{item.quantity}</span>
                                            </span>
                                        </div>
                                        <span className="text-gray-600">${item.priceAtPurchase.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-50 gap-3">
                                {order.status === 'PENDING' && (
                                    <button
                                        onClick={() => handlePayNow(order.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Pay Now
                                    </button>
                                )}
                                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 text-sm font-medium hover:bg-blue-50 rounded-lg transition">
                                    View Details <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
