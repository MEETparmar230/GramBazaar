'use client'

import { news } from "@/data/news";

export default function NewsCard(){

    return(
    <div className="bg-zinc-100 p-6 rounded-xl max-w-3xl mx-auto shadow">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">📰 News & Updates</h2>
  <div className="space-y-4">
    {news.map((n, i) => (
      <div key={i} className="bg-white border-l-4 border-green-500 p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold text-green-800">{n.title}</h3>
        {n.date && <p className="text-sm text-gray-500 mt-1">{n.date}</p>}
        {n.description && <p className="text-gray-700 mt-2">{n.description}</p>}
      </div>
    ))}
  </div>
  </div>
    )
}