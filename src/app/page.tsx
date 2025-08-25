'use client'

import { services } from "@/data/services";
import ProductCard from "@/components/ProductCard";
import ContactForm from "@/components/ContactForm";
import ServiceCard from "@/components/ServiceCard";
import NewsCard from "@/components/NewsCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface ProductsType {
  name:string,
  price:number,
  imageUrl:string,
  _id:string
}
interface serviceType{
  _id:string,
  name:string,
  imageId:string,
}

export default function HomePage() {

  const [products,setProducts] = useState<ProductsType[]>([])
  const [role,setRole] = useState<"user"|"admin"|null>(null)
  const [services,setServices] = useState<serviceType[]>([])
  

useEffect( () =>{
  axios.get("/api/product")
  .then(res=>{setProducts(res.data)})
  .catch(err=>console.log(err))

 axios.get("/api/services")
    .then((res)=>{
      setServices(res.data)
    })
    .catch((err)=>{
      console.error(err)
    })

  axios.get("/api/profile")
  .then((res)=>
   setRole(res.data.user?.role ?? null)
  )
 .catch(err =>{ console.error(err)
  setRole(null)
 });
},[])


  return (
    <main className="w-fit items-center mx-auto  mx-4 flex flex-col gap-10 my-4">
      <section id="services" className="bg-zinc-100 p-4 rounded-lg shadow sm:mx-4 mx-2" >
        <h2 className="text-2xl font-bold mb-2">Our Services</h2>
        <div className="flex flex-wrap gap-7 justify-center items-center">
          {services.map((s) => (
            <ServiceCard key={s._id} {...s}  role={role}/>
          ))}
        </div>
        <div className="flex items-center justify-center">
        {role==="admin"&&(
          <Button className="bg-green-600 hover:bg-green-700 mt-4 " onClick={()=>{window.location.href="/admin/services/add"}}>Add Service</Button>
        )}
      </div>
      </section>

      <section id="products" className="bg-zinc-100 p-4 rounded-lg shadow sm:mx-4 mx-2">
        <h2 className="text-2xl font-bold mb-2">Available Products</h2>
        <div className="flex flex-wrap gap-7 justify-center items-center">
          {products.map((p) => (
            <ProductCard key={p._id} {...p} role={role} />
          ))}
        </div>
      <div className="flex items-center justify-center">
        {role==="admin"&&(
          <Button className="bg-green-600 hover:bg-green-700 mt-4 " onClick={()=>{window.location.href="/admin/products/add"}}>Add Product</Button>
        )}
      </div>
      </section>

       <section id="news" className='my-4 mx-2'>
                      <NewsCard/>
            </section>

      <section id="contact"  className="bg-zinc-100 p-4 rounded-lg shadow sm:mx-4 mx-2">
        <ContactForm />
      </section>
    </main>
  );
}
