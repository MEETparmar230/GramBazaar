'use client'

import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";
import { useThrottle } from "@/hooks/useThrottle";
import { useDispatch, useSelector } from "react-redux";
import { clearError, fetchProducts, Product as ProductType, removeProduct, removeProductLocal } from "@/redux/slices/productsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { fetchUser } from "@/redux/slices/userSlice";

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

export default function Product() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { products, loading } = useSelector((state: RootState) => state.products);
  const role = useSelector((state: RootState) => state.user.user?.role)
  const userId = useSelector((state: RootState) => state.user.user?._id)

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchUser())
  }, [dispatch]);

  const handleAddToCart = async (productId: string) => {
    if (!userId) {
      toast.error("You must be logged in to add to cart.");
      return;
    }

    try {
      await axios.post("/api/users/cart", {
        user: userId,
        items: [{ productId, quantity: 1 }],
      });
      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  const throttledAddToCart = useThrottle(handleAddToCart, 500);

  const handleDelete = async (id: string) => {

    dispatch(removeProductLocal(id))
    dispatch(removeProduct(id))
      .unwrap()
      .then(() =>
        toast.success("Product deleted!")
    )
      .catch ((err) =>{
        const message = err?.message || "Failed to delete product";
        toast.error(message);
        dispatch(clearError());
         dispatch(fetchProducts());
  }
)


};

return (
  <div className="w-full">
    <section className="bg-zinc-100 p-4 rounded-lg shadow ring-2 ring-green-200 mx-auto w-full">
      <h2 className="md:text-3xl text-2xl text-zinc-700 font-bold mb-4">Available Products</h2>
      <div className="md:my-5 grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <ProductSkeletonCard key={i} />)
          : products.map((p: ProductType) => (
            <div key={p._id} className="bg-white shadow p-4 rounded-lg text-center ring-3 ring-green-200">
              {p.imageId ? (
                <CldImage
                  className="mx-auto w-full h-40 object-contain"
                  src={p.imageId}
                  alt={p.name || "Product image"}
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
                  onClick={() => throttledAddToCart(p._id)}
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded w-full"
                >
                  Add to Cart
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

      {role === "admin" && (
        <div className="flex items-center justify-center">
          <Button className="bg-green-600 text-lg hover:bg-green-700 md:m-4 m-2" onClick={() => router.push("/admin/products/add")}>
            Add Product
          </Button>
        </div>
      )}
    </section>
  </div>
);
}
