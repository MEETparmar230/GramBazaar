// src/app/admin/dashboard/page.tsx
'use client'

import Overview from '@/components/Overview'
import Settings from '@/components/Settings'

export default function AdminDashboard() {
  return (
    <div className='md:w-3/4 md:mx-auto mx-2'>
      <section><Overview/></section>     
    </div>
  )
}
