'use client'
import { IOrder } from '@/models/order.model'
import axios from 'axios'
import { ArrowLeft, Package, PackageSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {motion} from 'motion/react'
import MyOrderCard from '@/components/MyOrderCard'
function MyOrder() {
const router =  useRouter()
const [orders,setOrders] = useState<IOrder[]>()
const [loading,setLoading] = useState(true)
  const getMyOrders = async ()=>{
    try {
      const result = await axios.get("/api/user/my-orders")
      setOrders(result?.data?.orders)

      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getMyOrders()
  },[])
 if (loading) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full"
      />
      <p className="mt-4 text-gray-600 font-medium">
        Loading your orders...
      </p>
    </div>
  )
}
  return (
    <div className='bg-linear-to-b from-white to-gray-100 min-h-screen w-full'>
      <div className='max-w-3xl mx-auto px-4 pt-16 pb-10 relative '>
        <div className='fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b border-gray-500 z-50 '>
        <div className='max-w-3xl mx-auto flex items-center gap-4 px-4 py-3'>
          <button onClick={()=>router.push('/')} className='p-2 bg-gray-100 rounded-full hoverbg-green-200 active:scale-0.95 transition cursor-pointer'>
            <ArrowLeft size={24} className='text-green-700'/>
          </button>
          <h1 className='text-xl font-bold text-gray-800'>My Orders</h1>

        </div>

        </div>

        {
          orders?.length == 0 ? (
            <div className='pt-20 flex flex-col items-center text-center'>
              <PackageSearch size={70} className='text-green-600 mb-4'/>
              <h2 className='text-xl font-semibold text-gray-700'>No Orders Found</h2>
              <p className='text-gray-500 text-sm mt-1'>Start shopping to view your orders here.</p>
            </div>

          ):
           <div className='mt-4 space-y-6'>
              {
                orders?.map((order,i)=>(
                  <motion.div
                  key={i}
                  initial={{opacity:0,y:20}}
                  animate={{opacity:1,y:0}}
                  transition={{duration:0.4}}

                  >
                    <MyOrderCard order={order}/>
                  </motion.div>
                ))
              }
           </div>
        }
      </div>
    </div>
  )
}

export default MyOrder
