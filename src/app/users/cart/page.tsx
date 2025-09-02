'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Product {
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
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productName: string, quantity: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productName]: quantity,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemsToBook = products
      .filter((p) => selectedItems[p.name] > 0)
      .map((p) => ({
        name: p.name,
        price: p.price,
        quantity: selectedItems[p.name],
      }));

    if (itemsToBook.length === 0) {
      alert('Please select at least one product with quantity.');
      return;
    }

    try {
      await axios.post('/api/bookings', { items: itemsToBook });
      router.push('/dashboard?success=1');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to book products.');
    }
  };

  if (loading) return <p className="text-center mt-8">Loading products...</p>;

  return (
    <div className="max-w-2xl sm:mx-auto md:mx-auto mx-2 p-6 mt-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">🛒 Book Products</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {products.map((product) => (
          <div
            key={product.name}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-gray-500 text-sm">₹{product.price}</p>
            </div>
            <input
              type="number"
              min={0}
              value={selectedItems[product.name] || 0}
              onChange={(e) =>
                handleQuantityChange(product.name, parseInt(e.target.value) || 0)
              }
              className="w-20 border rounded px-2 py-1"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book Selected Products
        </button>
      </form>
    </div>
  );
}
