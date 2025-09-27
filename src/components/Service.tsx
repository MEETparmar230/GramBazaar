'use client'

import axios from "axios";
import { CldImage } from "next-cloudinary";
import { useEffect} from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchServices, removeService, removeServiceLocal } from "@/redux/slices/servicesSlice";
import { fetchUser } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";



export default function Service() {
  const router = useRouter();
 const {loading,services} = useSelector((state:RootState)=>state.services)
 const role = useSelector((state:RootState)=>state.user.user?.role)
 const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchServices())
    dispatch(fetchUser())
  }, []);

  const handleDelete = (id: string) => {
  // Optimistic update
  dispatch(removeServiceLocal(id));

  // Async backend call
  dispatch(removeService(id))
    .unwrap()
    .catch(() => {
      toast.error("Failed to delete service");
      dispatch(fetchServices()); 
    });
};


function ServiceSkeletonCard() {
  return (
    <div className="bg-white shadow-md p-4 my-2 rounded-lg text-center min-w-40 ring-3 ring-green-200 animate-pulse">
      <div className="bg-zinc-300 h-40 w-full mb-4 rounded"></div>
      <div className="h-4 bg-zinc-300 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-zinc-300 rounded w-1/2 mx-auto"></div>
    </div>
  );
}


  return (
    
    <div className="w-full">
      <section
        id="services"
        className="bg-zinc-100  rounded-lg shadow-md  p-5 ring-2 ring-green-200"
      >
        <h2 className="md:text-3xl text-2xl text-zinc-700 font-bold md:m-2 mb-2">Our Services</h2>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          {loading
  ? Array.from({ length: 4 }).map((_, i) => <ServiceSkeletonCard key={i} />)
  : services.map((s) => (
      <div
        key={s._id}
        className="bg-white shadow-md p-4 my-2 rounded-lg text-center min-w-50 ring-3 ring-green-200"
      >
        {s.imageId ? (
          <CldImage
            className="p-2 mx-auto h-40 w-60 lg:h-60 object-contain"
            src={s.imageId}
            alt={s.name || "Service image"}
            width={130}
            height={130}
          />
        ) : (
          <div className="bg-zinc-200 p-5 mx-auto w-24 h-24 flex items-center justify-center">
            <span className="text-zinc-500 text-sm">No image</span>
          </div>
        )}
        <p className="font-semibold text-lg text-zinc-700">{s.name}</p>

        {role === "admin" && (
          <div>
            <button
              onClick={() => handleDelete(s._id)}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 me-4 rounded-lg"
            >
              Delete
            </button>
            <button
              onClick={() => router.push(`/admin/services/edit/${s._id}`)}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    ))}

        </div>
        <div className="flex items-center justify-center">
        {role === "admin" && (
          <Button
            className="bg-green-600 text-lg hover:bg-green-700 md:m-4"
            onClick={() => router.push("/admin/services/add")}
          >
            Add service
          </Button>
        )}
      </div>
      </section>

      
    </div>
  );
}
