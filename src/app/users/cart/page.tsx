'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  icon?: string;
}

export default function BookPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/product');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load products:', err);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemsToBook = products
      .filter((p) => selectedItems[p._id] > 0)
      .map((p) => ({
        productId: p._id,
        quantity: selectedItems[p._id],
      }));

    if (itemsToBook.length === 0) {
      toast.error('Please select at least one product with quantity.');
      return;
    }

    try {
      await axios.post('/api/users/bookings', { items: itemsToBook });
      toast.success('Booking successful!');
      router.push('/users/dashboard?success=1');
    } catch (err) {
      console.error('Booking failed:', err);
      toast.error('Booking failed, please try again.');
    }
  };

  if (loading) return <p className="text-center mt-8">Loading products...</p>;

  const totalAmount = products.reduce((total, p) => {
    const qty = selectedItems[p._id] || 0;
    return total + p.price * qty;
  }, 0);

  return (
    <div className="max-w-2xl sm:mx-auto md:mx-auto mx-2 p-6 mt-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">🛒 Book Products</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-gray-500 text-sm">₹{product.price}</p>
            </div>
            <input
              type="number"
              min={0}
              value={selectedItems[product._id] || 0}
              onChange={(e) =>
                handleQuantityChange(product._id, parseInt(e.target.value) || 0)
              }
              className="w-20 border rounded px-2 py-1"
            />
          </div>
        ))}
        {totalAmount > 0 && (
          <p className="font-semibold text-right">Total: ₹{totalAmount}</p>
        )}
        <button
          type="submit"
          disabled={totalAmount === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Book Selected Products
        </button>
      </form>
    </div>
  );
}
