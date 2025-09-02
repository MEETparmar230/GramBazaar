'use client'

import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useEffect, useState } from 'react'


interface ProductsType {
  name:string,
  price:number,
  imageId:string,
  _id:string,
}

export default function Productspage() {

  const [products,setProducts] = useState<ProductsType[]>([])
  const [role,setRole] = useState<"user"|"admin"|null>(null)

useEffect( () =>{
  axios.get("/api/product")
  .then(res=>{setProducts(res.data)})
  .catch(err=>console.log(err))

 axios.get("/api/profile")
    .then((res) => {
      setRole(res.data.user?.role ?? null);
    })
    .catch(() => {
      setRole(null);
    });
},[])


  return (
    <div className='w-fit sm:mx-auto md:mx-auto md:max-w-3/4 my-4 mx-2'>
      <section id="products" className="bg-zinc-100 p-4 rounded-lg md:mx-auto lg:mx-auto sm-mx-2 shadow mx-2">
              <h2 className="text-2xl font-bold mb-2">Available Products</h2>
              <div className="flex flex-wrap gap-7 justify-center items-center">
                {products.map((p) => (
                  <ProductCard key={p._id} {...p} role={role} />
                ))}
              </div>
            </section>
            <div className="flex items-center justify-center">
                    {role==="admin"&&(
                      <Button className="bg-green-600 hover:bg-green-700 mt-4 " onClick={()=>{window.location.href="/admin/products/add"}}>Add Product</Button>
                    )}
                  </div>
    </div>
  )
}
