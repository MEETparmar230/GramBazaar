'use client'

import ServiceCard from '@/components/ServiceCard'
import { services } from "@/data/services";
import React from 'react'

export default function page() {
  return (
    <div className='w-fit sm:mx-auto md:mx-auto md:max-w-3/4  my-4 mx-2'>
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
