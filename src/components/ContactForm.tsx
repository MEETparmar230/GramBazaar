'use client';
import { ContactFormData,contactSchema } from "@/lib/validations/message";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

export default function ContactForm() {

   const { 
    register,
    handleSubmit,
    reset,
    formState:{errors,isSubmitting},
  } = useForm<ContactFormData>({
    resolver:zodResolver(contactSchema)
  })


  const onSubmit = async (data:ContactFormData) => {
    try{
    const res = await axios.post("api/contact",data)
    const result = res.data
      if(result.success){
        toast.success(result.message)
        reset()
      }
       else {
        toast.error(result.message);
        console.error(result.errors)
      }
    }
    catch(err:unknown){
      if(axios.isAxiosError(err)){
      toast.error(err.response?.data?.message || "Request failed")
      console.error("Axios Error:", err.response?.data)
      }

      else if(err instanceof Error){
        toast.error(err.message)
        console.error("General error:",err.message)
      }
      else{
        toast.error("Unexpected error")
        console.error("Unknown error", err)
      }
    }
  }

 
  return (
    <div className=" mx-auto  bg-zinc-100 rounded-lg w-3xl shadow py-6 px-10">
      <h2 className="text-3xl text-center mb-6 font-bold mb-4 text-zinc-900">Contact Us</h2>
      <p className="mb-2 text-lg text-zinc-900 ">📍 <span className="text-green-600">GramBazaar HQ</span>, Village Center, India</p>
      <p className="mb-4 text-lg text-zinc-900 mb-8">📞 Helpline: 1800-123-456</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
        <input
          {...register("name")}
          placeholder="Your Name"
          className="border p-2 rounded w-full outline-none focus:border-green-600 focus:ring-0  border-green-300"
          
        />
        {errors.name && (<p className="text-red-500 text-sm">{errors.name.message}</p>)}
        </div>
        <div>
        <input
          {...register("email")}
          placeholder="Your Email"
          className="border p-2 rounded w-full outline-none focus:border-green-600 focus:ring-0 border-green-300"
          
        />
        {errors.email && (<p className="text-red-500 text-sm">{errors.email.message}</p>)}
        </div>
        <div className="">
        <textarea
          {...register("message")}
          placeholder="Your Message"
          className="border p-2 rounded w-full  h-26 outline-none focus:border-green-600 focus:ring-0  border-green-300"
          
        />
        {errors.message && (<p className="text-red-500 text-sm">{errors.message.message}</p>)}
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white text-lg w-xl mx-auto my-2 px-4 py-2 rounded hover:bg-green-700"
        >
          {isSubmitting ? "sending...":"Send"}
        </button>
      </form>
     
    </div>
  );
}
