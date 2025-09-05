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


export default function ProductCard() {

  const [products, setProducts] = useState<ProductsType[]>([])
  const [role, setRole] = useState<"user" | "admin" | null>(null)
  const router = useRouter()


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
      });
  }, [])

  const handleAddToCart = async (id:string) => {
    try {
      const res = await axios.post("/api/users/bookings", {
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

  return (
    <div className=' sm:mx-auto md:mx-auto md:w-3/4  mx-2'>
      <section id="products" className="bg-zinc-100 p-4 rounded-lg md:mx-auto lg:mx-auto sm-mx-2 shadow mx-2 ring-2 ring-green-200">
        <h2 className="text-3xl text-zinc-700 font-bold m-2">Available Products</h2>
        <div className="flex flex-wrap gap-7 justify-center items-center m-5">
          {products.map((p)=>
            <div key={p._id} className="bg-white shadow p-4 rounded-lg text-center w-60 ring-3 ring-green-200">
            {p.imageId ? (

              <CldImage
                className="mx-auto w-40  h-40 object-contain"
                src={p.imageId}
                alt={p.name || "Service image"}
                width={130}
                height={130}

              />
            ) : (
              <div className="bg-zinc-200 p-5 mx-auto w-24 h-24 flex items-center justify-center">
                <span className="text-zinc-500 text-sm">No image</span>
              </div>
            )}
            <p className="font-semibold">{p.name}</p>
            <p className="text-green-600 font-bold">₹{p.price}</p>
            {role === "user" && (
              <button
                onClick={()=>{handleAddToCart(p._id)}}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                Book Now
              </button>
            )}

            {role === "admin" && (
              <div>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 me-4 rounded-lg"
                >
                  Delete
                </button>
                <button
                  onClick={() => { router.push(`/admin/products/edit/${p._id}`) }}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                >
                  Edit
                </button>
              </div>
            )}

          </div>)}
        </div>
        <div className="flex items-center justify-center">
        {role==="admin"&&(
          <Button className="bg-green-600 text-lg hover:bg-green-700 m-4 " onClick={()=>{router.push("/admin/products/add")}}>Add Product</Button>
        )}
      </div>
      </section>
    </div>


  );
}
