'use client'

import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface NewsType {
  _id: string
  title: string;
  description: string;
  date: string;
  link: string
}


export default function NewsCard() {

  const [news, setNews] = useState<NewsType[]>([])
  const [role, setRole] = useState<"user" | "admin" | null>(null)
  const [loading, setLoading] = useState(true);


 const handleDelete = (id:string) =>{
  try{
    axios.delete(`/api/admin/news/${id}`)
    alert("news deleted")
  }
  catch(err){
    console.error(err)
    alert("Failed to delete product");
  }
  }

  useEffect(() => {
    axios.get("/api/news")
      .then((res) => {
        setNews(res.data)
      })
      .catch((err) => {
        console.error("Error while fetching news", err.response?.data || err.message)
      })

    axios.get("/api/profile")
      .then(res => {
        setRole(res.data.user?.role ?? null)
        console.log(res.data.message)
      })
      .catch(err => {
        console.error(err.response?.data || err.message)
      })
      .finally(()=>setLoading(false))
  }, [])


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
                Delete
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