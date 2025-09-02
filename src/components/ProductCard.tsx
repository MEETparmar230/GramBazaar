'use client'

import axios from "axios";
import { CldImage } from "next-cloudinary";


interface ProductCardProps {
  _id:string;
  name: string;
  price: number;
  imageId: string;
 role: "user" | "admin" | null;}



export default function ProductCard({_id, name, price, imageId, role }: ProductCardProps) {
  const handleAddToCart = async () => {
    try {
      const res = await axios.post("/api/users/bookings", {
        items: [{ name, price, quantity: 1 }],
      });

      alert("Booking successful!");
    } catch (err) {
      alert("Failed to book product");
    }
  };


  const handleDelete = async (id:string) =>{
    try{
      await axios.delete(`/api/admin/product/${id}`)
      alert("Product deleted!");
    }
    catch(err){
      alert("Failed to delete product");
    }
  }

  return (
    <div className="bg-white shadow p-4 rounded-lg text-center w-48">
      {imageId ? (
        
        <CldImage 
          className="mx-auto w-auto h-20"
          src={imageId}
          alt={name || "Service image"}
          width={100}
          height={100}
          
        />
      ) : (
        <div className="bg-zinc-200 p-5 mx-auto w-24 h-24 flex items-center justify-center">
          <span className="text-zinc-500 text-sm">No image</span>
        </div>
      )}
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
