'use client'

import axios from "axios";
import { CldImage } from "next-cloudinary";

interface ServiceCardProps {
  _id: string;
  name: string;
  imageId?: string;
  description?: string;
  role:"admin"|"user"|null
}


export default function ServiceCard({name,_id,imageId,role}: ServiceCardProps ,) {

  const handleDelete = (id:string) =>{
    axios.delete(`/api/admin/services/${id}`)
    .then(()=>console.log("service deleted"))
    .catch(err=>console.error(err))
  }
  

  return (
  
    
    <div className="bg-white shadow p-4 rounded-lg shadow-md text-center min-w-60">
      {imageId ? (
        
        <CldImage 
          className=" p-5 mx-auto w-auto h-40"
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
      {role === "admin" && (
  <div>
    <button
      onClick={() => handleDelete(_id)}
      className="mt-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 me-4 rounded-lg"
    >
      Delete
    </button>
    <button
      onClick={() => { window.location.href = `/admin/services/edit/${_id}` }}
      className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
    >
      Edit
    </button>
  </div>
)}
    </div>
    

  );
}
