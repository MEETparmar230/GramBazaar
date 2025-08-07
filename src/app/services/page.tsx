'use client'

import ServiceCard from '@/components/ServiceCard'
import { services } from "@/data/services";
import React from 'react'

export default function page() {
  return (
    <div className='w-fit md:mx-auto sm:mx-auto mx-2 md:max-w-3/4 my-4'>
      <section id="services" className="bg-zinc-100 p-4 rounded-lg shadow mx-2 " >
              <h2 className="text-2xl font-bold mb-2">Our Services</h2>
              <div className="flex flex-wrap gap-7 justify-center items-center">
                {services.map((s) => (
                  <ServiceCard key={s.name} {...s} />
                ))}
              </div>
            </section>
    </div>
  )
}
