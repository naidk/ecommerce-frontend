import { useForm } from 'react-hook-form';
import { useCartStore } from '../../cart/cartStore';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const { items, total, clearCart, fetchCart } = useCartStore();
    const navigate = useNavigate();
    const totalPrice = total();

    const { handleSubmit } = useForm();

    // Ensure cart is fresh
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const mutation = useMutation({
        mutationFn: async () => {
            const customerId = localStorage.getItem('customerId');
            if (!customerId) {
                throw new Error("User not logged in");
            }

            // Generate Idempotency Key
            const idempotencyKey = crypto.randomUUID();

            // Call Server-Side Order Endpoint
            const response = await api.post(`/order/${customerId}`, {}, {
                headers: {
                    'Idempotency-Key': idempotencyKey
                }
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Order placed successfully!');
            clearCart();
            navigate('/');
        },
        onError: (error) => {
            console.error('Checkout failed', error);
            toast.error('Failed to place order. Please try again.');
        }
    });

    const onSubmit = () => {
        mutation.mutate();
    };

    if (items.length === 0) {
        if (!mutation.isPending) {
            // Only redirect if not currently submitting (to avoid flash)
        }
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-gray-50 p-8 rounded-xl h-fit">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                    {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6">Confirm Order</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm mb-4">
                        Your order will be processed using your saved account details.
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        {mutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
