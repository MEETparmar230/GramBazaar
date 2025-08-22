   'use client'
   
   import React from 'react'
    import ProductEditForm from '@/components/ProductEditForm'
    import { useParams } from 'next/navigation'

    export default function page() {

        const params = useParams()
        const id = params.id as string

    return (
        <div>
            <ProductEditForm id={id}/>
        </div>
    )
    }
