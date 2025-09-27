'use client'

import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchNews, removeNews, removeNewsLocal } from "@/redux/slices/newsSlice";
import toast from "react-hot-toast";


export default function NewsCard() {

const dispatch = useDispatch<AppDispatch>()
const {news,loading,deletingId,error} = useSelector((state:RootState)=>state.news)
const role = useSelector((state:RootState)=>state.user.user?.role)

 const handleDelete = (id:string) =>{
 
    dispatch(removeNewsLocal(id))
    dispatch(removeNews(id))
    .unwrap()
    .then(()=>toast.success("news deleted"))
    .catch(err=>{
    console.error(err)
    toast.error(err)
    })
  }

  useEffect(() => {
   
    dispatch(fetchNews())
    .unwrap()
      .catch((err) => {
        console.error(err)
        toast.error(err)
      })
  }, [])

  useEffect(()=>{
     if (error) toast.error(error)
  },[error])


function NewsSkeletonCard() {
  return (
    <div className= "md:w-2xl max-w-2xl sm:w-xl w-sm  bg-white border-l-4 border-green-500 p-4 rounded shadow-sm flex flex-col gap-2 animate-pulse ring-3 ring-green-200">
      <div className="h-4 bg-zinc-300 rounded w-1/2"></div>
      <div className="h-3 bg-zinc-200 rounded w-1/3"></div>
      <div className="h-4 bg-zinc-200 rounded w-full mt-2"></div>
      <div className="h-4 bg-zinc-200 rounded w-5/6 mt-1"></div>
      <div className="flex gap-2 mt-4">
        <div className="h-8 w-20 bg-green-300 rounded"></div>
        <div className="h-8 w-20 bg-red-300 rounded"></div>
      </div>
    </div>
  );
}


  return (
    <div className="bg-zinc-100 md:p-6 p-2 rounded-xl max-w-3xl  w-fit mx-auto shadow ring-2 ring-green-200">
      <h2 className="md:text-3xl text-2xl font-bold mb-4 text-zinc-800 p-2">📰 News & Updates</h2>
      <div className="space-y-4">
        {loading
  ? Array.from({ length: 3 }).map((_, i) => <NewsSkeletonCard key={i} />)
  : news.map((n) => (
      <div
        key={n._id}
        className="bg-white border-l-4 border-green-500 md:p-4 p-2 rounded shadow-sm flex md:flex-row flex-col gap-2 justify-between ring-3 ring-green-200"
      >
        <div>
          <h3 className="text-lg font-semibold text-green-800">{n.title}</h3>
          {n.date && (
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(n.date), "PPPP")}
            </p>
          )}
          {n.description && <p className="text-gray-700 mt-2">{n.description}</p>}
        </div>

        <div className="space-y-2 mt-auto mx-2 flex md:flex-col gap-2">
          {role === "admin" && (
            <>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  window.location.href = `/admin/news/edit/${n._id}`;
                }}
              >
                Edit
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(n._id)}
              >
               {deletingId===n._id?"Deleting..." : "Delete"}
              </Button>
            </>
          )}
        </div>
      </div>
    ))}

      </div>
      <div className="flex items-center justify-center md:m-3 ">
        {role === "admin" && (
          <Button className="bg-green-600 text-lg  hover:bg-green-700  mt-4 mb-2" onClick={() => { window.location.href = "/admin/news/add" }}>Add News</Button>
        )}
      </div>
    </div>
  )
}