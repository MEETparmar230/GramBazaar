'use client'

import axios from "axios";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";



interface ProductsType {
  name: string,
  price: number,
  imageId: string,
  _id: string,
}


export default function Product() {

  const [products, setProducts] = useState<ProductsType[]>([])
  const [role, setRole] = useState<"user" | "admin" | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    axios.get("/api/product")
      .then(res => { setProducts(res.data) })
      .catch(err => console.log(err))
      

    axios.get("/api/profile")
      .then((res) => {
        setRole(res.data.user?.role ?? null);
      })
      .catch(() => {
        setRole(null);
      })
      .finally(()=>setLoading(false))
      
  }, [])

  const handleAddToCart = async (id:string) => {
    try {
       await axios.post("/api/users/bookings", {
        items: [{ productId: id, quantity: 1 }],
      });
      router.push("/users/dashboard")
      alert("Booking successful!");
    } catch (err) {
      alert("Failed to book product");
      console.log(err);
    }
  };



  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/product/${id}`)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      alert("Product deleted!");
    }
    catch (err) {
      alert("Failed to delete product");
    }
  }

  function ProductSkeletonCard() {
  return (
    <div className="bg-white shadow p-4 rounded-lg text-center ring-3 ring-green-200 animate-pulse">
      <div className="bg-zinc-300 mx-auto w-full h-40 mb-4 rounded"></div>
      <div className="h-4 bg-zinc-300 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-zinc-300 rounded w-1/2 mx-auto mb-4"></div>
      <div className="h-8 bg-green-300 rounded w-full"></div>
    </div>
  );
}


  return (
    <div className='w-full'>
      <section id="products" className="bg-zinc-100 p-4 w-full rounded-lg  shadow  ring-2 ring-green-200 mx-auto w-full">
        <h2 className="md:text-3xl text-2xl text-zinc-700 font-bold mb-4 ">Available Products</h2>
        <div className="md:my-5 grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
  {loading
  ? Array.from({ length: 6 }).map((_, i) => <ProductSkeletonCard key={i} />)
  : products.map((p) => (
      <div
        key={p._id}
        className="bg-white shadow p-4 rounded-lg text-center ring-3 ring-green-200"
      >
        {p.imageId ? (
          <CldImage
            className="mx-auto w-full h-40 object-contain"
            src={p.imageId}
            alt={p.name || "Service image"}
            width={220}
            height={160}
          />
        ) : (
          <div className="bg-zinc-200 p-5 mx-auto w-full h-40 flex items-center justify-center">
            <span className="text-zinc-500 text-sm">No image</span>
          </div>
        )}

        <p className="font-semibold text-base md:text-lg">{p.name}</p>
        <p className="text-green-600 font-bold">₹{p.price}</p>

        {role === "user" && (
          <button
            onClick={() => handleAddToCart(p._id)}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded w-full"
          >
            Book Now
          </button>
        )}

        {role === "admin" && (
          <div className="flex justify-between mt-2">
            <button
              onClick={() => handleDelete(p._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg"
            >
              Delete
            </button>
            <button
              onClick={() => router.push(`/admin/products/edit/${p._id}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    ))}

</div>

       
        <div className="flex items-center justify-center">
        {role==="admin"&&(
          <Button className="bg-green-600 text-lg hover:bg-green-700 md:m-4 m-2 " onClick={()=>{router.push("/admin/products/add")}}>Add Product</Button>
        )}
      </div>
      </section>
    </div>


  );
}
