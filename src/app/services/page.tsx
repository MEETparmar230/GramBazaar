'use client'

import ServiceCard from '@/components/ServiceCard'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface serviceType{
  _id:string,
  name:string,
  imageId:string,
}

export default function ServicesPage() {

  const [services,setServices] = useState<serviceType[]>([])
  const [role,setRole] = useState<"user"|"admin"|null>(null)

  useEffect(()=>{
    axios.get("/api/services")
    .then((res)=>{
      setServices(res.data)
    })
    .catch((err)=>{
      console.error(err)
    })
 axios.get("/api/profile")
    .then((res) => {
      setRole(res.data.user?.role ?? null);
    })
    .catch(() => {
      setRole(null);
    });

  },[])

  return (
    <div className='w-fit sm:mx-auto md:mx-auto md:max-w-3/4  my-4 mx-2'>
      <section id="services" className="bg-zinc-100 p-4 rounded-lg shadow mx-2 " >
              <h2 className="text-2xl font-bold mb-2">Our Services</h2>
              <div className="flex flex-wrap gap-7 justify-center items-center">
                {services.map((s) => (
                  <ServiceCard key={s._id} {...s} role={role} />
                ))}
              </div>
            </section>
            <div className="flex items-center justify-center">
                    {role==="admin"&&(
                      <Button className="bg-green-600 hover:bg-green-700 mt-4 " onClick={()=>{window.location.href="/admin/services/add"}}>Add service</Button>
                    )}
                  </div>
            
    </div>
  )
}
