'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  fetchCart,
  updateQuantityAsync,
  removeItemAsync,
  clearCartAsync,
} from '@/redux/slices/cartSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { CiTrash } from "react-icons/ci";

// Skeletons
const CartItemSkeleton = () => (
  <div className="flex flex-col sm:flex-row justify-between items-center p-4 border rounded-lg shadow-sm animate-pulse">
    <div className="flex-1 mb-2 sm:mb-0">
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="flex items-center space-x-2">
      <div className="w-20 h-8 bg-gray-200 rounded"></div>
      <div className="h-5 bg-gray-300 rounded w-16"></div>
    </div>
  </div>
);

const CartSkeleton = () => (
  <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg ring-2 ring-green-200 my-6">
    <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-6 animate-pulse"></div>
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <CartItemSkeleton key={index} />
      ))}
    </div>
    <div className="mt-6 flex justify-between items-center border-t pt-4">
      <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
      <div className="h-10 bg-gray-300 rounded w-40 animate-pulse"></div>
    </div>
  </div>
);

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { items: cartItems, loading, error } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (quantity < 1) return; // Prevent invalid quantities
    
    try {
      await dispatch(updateQuantityAsync({ productId, quantity })).unwrap();
      toast.success('Quantity updated');
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error('Update quantity error:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await dispatch(removeItemAsync(productId)).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Remove item error:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCartAsync()).unwrap();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
      console.error('Clear cart error:', error);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    router.push('/users/payment');
  };

  if (loading) return <CartSkeleton />;
  if (error) toast.error(error);

  if (!cartItems.length) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="text-6xl">🛒</div>
        <p className="text-gray-500 text-lg">Your cart is empty</p>
        <button
          onClick={() => router.push('/products')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl md:mx-auto p-6 bg-white shadow-lg rounded-lg ring-2 ring-green-200 md:my-10 my-4 mx-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🛒 Your Cart</h2>
        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium border px-2 rounded-md border-red-500 hover:border-red-700"
          >
            Clear Cart
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col sm:flex-row justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex-1 mb-2 sm:mb-0">
              <p className="font-semibold text-gray-700">{item.name}</p>
              <p className="text-gray-500 text-sm">₹{item.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.productId, parseInt(e.target.value) || 1)
                }
                className="w-20 border rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <span className="font-semibold text-gray-700">
                ₹{item.price * item.quantity}
              </span>
              <button
                onClick={() => handleRemoveItem(item.productId)}
                className="text-red-600 hover:text-red-800 font-bold px-2 py-1"
                title="Remove item"
              >
                <CiTrash className='text-xl'/>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <p className="md:text-lg font-bold text-gray-800">Total: ₹{totalAmount}</p>
        <button
          onClick={handleCheckout}
          className="bg-green-600 hover:bg-green-700 text-white md:px-6 px-3 py-2 rounded-lg font-semibold transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}