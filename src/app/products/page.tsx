'use client'

import ProductCard from '@/components/ProductCard'
import {products} from '@/data/products'
import React from 'react'

export default function page() {
  return (
    <div className='w-fit sm:mx-auto md:mx-auto md:max-w-3/4 my-4 mx-2'>
      <section id="products" className="bg-zinc-100 p-4 rounded-lg md:mx-auto lg:mx-auto sm-mx-2 shadow mx-2">
              <h2 className="text-2xl font-bold mb-2">Available Products</h2>
              <div className="flex flex-wrap gap-7 justify-center items-center">
                {products.map((p) => (
                  <ProductCard key={p.name} {...p} />
                ))}
              </div>
            </section>
    </div>
  )
}
