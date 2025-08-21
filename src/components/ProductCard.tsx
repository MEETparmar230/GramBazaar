'use client'

import axios from "axios";

interface ProductCardProps {
  name: string;
  price: number;
  imageUrl: string;
}

export default function ProductCard({ name, price, imageUrl }: ProductCardProps) {
  const handleAddToCart = async () => {
    try {
      const res = await axios.post("/api/bookings", {
        items: [{ name, price, quantity: 1 }],
      });

      alert("Booking successful!");
    } catch (err) {
      alert("Failed to book product");
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg text-center w-48">
      <img src={imageUrl} alt={name} className="w-16 h-16 mx-auto mb-2" />
      <p className="font-semibold">{name}</p>
      <p className="text-green-600 font-bold">₹{price}</p>
      <button
        onClick={handleAddToCart}
        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
      >
        Book Now
      </button>
    </div>
  );
}
