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
  }, [])



  return (
    <div className="bg-zinc-100 p-6 rounded-xl max-w-3xl w-3xl mx-auto shadow ring-2 ring-green-200">
      <h2 className="text-3xl font-bold mb-4 text-zinc-800 p-2">📰 News & Updates</h2>
      <div className="space-y-4">
        {news.map((n) => (

          <div key={n._id} className="bg-white border-l-4 border-green-500 p-4 rounded shadow-sm flex justify-between ring-3 ring-green-200">
            <div className="">
              <div>
                <h3 className="text-lg font-semibold text-green-800">{n.title}</h3>
                {n.date && <p className="text-sm text-gray-500 mt-1">{format(new Date(n.date), 'PPPP')}</p>}
                {n.description && <p className="text-gray-700 mt-2">{n.description}</p>}
              </div>
            </div>
            <div className="space-y-2 mt-auto mx-2">
              <div>
                {role === "admin" && (
                <Button className="bg-blue-600 hover:bg-blue-700  " onClick={() => { window.location.href = `/admin/news/edit/${n._id}` }}>Edit</Button>
              )}
              </div>
              <div>
                {role === "admin" && (
                <Button className="bg-red-600 hover:bg-red-700  " onClick={() => {handleDelete(n._id)}}>Delete</Button>
              )}
              </div>
              
            </div>
          </div>


        ))}
      </div>
      <div className="flex items-center justify-center m-3">
        {role === "admin" && (
          <Button className="bg-green-600 text-lg  hover:bg-green-700 mt-4 " onClick={() => { window.location.href = "/admin/news/add" }}>Add News</Button>
        )}
      </div>
    </div>
  )
}