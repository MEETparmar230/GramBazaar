// src/app/admin/dashboard/page.tsx
'use client'

import Overview from '@/components/Overview'
import Settings from '@/components/Settings'

export default function AdminDashboard() {
  return (
    <div className='w-3/4 mx-auto '>
      <section><Overview/></section>     
    </div>
  )
}
