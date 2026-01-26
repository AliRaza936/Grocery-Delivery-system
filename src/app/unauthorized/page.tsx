'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

function Unauthorized() {
  const router = useRouter();
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-200'>
      <h1 className='text-3xl font-bold text-red-600'>Access Denied 🚫</h1>
      <p className='mt-2 text-gray-700'>You can not access this page</p>
      <button onClick={()=>router.push('/')} className='bg-green-600 p-2 mt-3 rounded-2xl px-4 text-white font-semibold cursor-pointer'>Go to Home Page</button>
    </div>
  )
}

export default Unauthorized
