'use client'

import axios from "axios";


interface ProductCardProps {
  _id:string;
  name: string;
  price: number;
  imageUrl: string;
 role: "user" | "admin" | null;}



export default function ProductCard({_id, name, price, imageUrl, role }: ProductCardProps) {
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


  const handleDelete = async (id:string) =>{
    try{
      await axios.delete(`/api/product/${id}`)
      alert("Product deleted!");
    }
    catch(err){
      alert("Failed to delete product");
    }
  }

  return (
    <div className="bg-white shadow p-4 rounded-lg text-center w-48">
      <img src={imageUrl} alt={name} className="w-16 h-16 mx-auto mb-2" />
      <p className="font-semibold">{name}</p>
      <p className="text-green-600 font-bold">₹{price}</p>
     {role === "user" && (
  <button
    onClick={handleAddToCart}
    className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
  >
    Book Now
  </button>
)}

{role === "admin" && (
  <div>
    <button
      onClick={() => handleDelete(_id)}
      className="mt-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 me-4 rounded-lg"
    >
      Delete
    </button>
    <button
      onClick={() => { window.location.href = `/admin/products/edit/${_id}` }}
      className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
    >
      Edit
    </button>
  </div>
)}

    </div>
  );
}
