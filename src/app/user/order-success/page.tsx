'use client'
import React from 'react'

import {motion} from 'motion/react'
import { ArrowRight, CheckCircle, Package } from 'lucide-react'
import Link from 'next/link'

function OrderSuccess() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[90vh] px-6 text-center bg-linear-to-b from-green-100 to-white '>
        <motion.div
               initial={{scale:0,rotate:-180}}
      animate={{scale:1,rotate:0}}
      transition={{
        type:'spring',
        damping:10,
        stiffness:100
      }}
      className='relative'
        >
            <CheckCircle className='text-green-600 w-24 h-24 md:w-28 md:h-28'/>
            <motion.div
            initial={{opacity:0,scale:0.6}}
            animate={{opacity:[0.3,0,0.3], scale:[1,0.6,1]}}
            transition={{repeat:Infinity,duration:2,ease:"easeInOut"}}
            className='absolute inset-0'
            >
                <div className='w-full h-full rounded-full bg-green-300 blur-2xl'/>
            </motion.div>
        </motion.div>
      <motion.h1
      initial={{opacity:0,y:30}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.4,delay:0.3}}
      className='text-3xl md:text-4xl font-bold text-green-700 mt-6 '
      >
        Order Placed Successfully
      </motion.h1>
      <motion.p
            initial={{opacity:0,y:30}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.4,delay:0.6}}
      className='text-gray-600 mt-3 text-sm md:text-base max-w-[400px]'
      >
        Thanks for shoping with us! Your order has been placed and is being processed. You can track its progress in your <span className='font-semibold text-green-700'>My Orders</span> section.
      </motion.p>

      <motion.div
             initial={{y:40,opacity:0}}
      animate={{y:[0,-10,0],opacity:1}}
      transition={{duration:2,delay:1 , repeat:Infinity, ease:'easeInOut'}}
      className='mt-10'
      >
        <Package className='w-16 h-16 md:w-20 md:h-20 text-green-500'/>
      </motion.div>
      <motion.div
         initial={{opacity:0,scale:0.9}}
      animate={{opacity:1,scale:1}}
      transition={{duration:0.4,delay:1.2}}
      className='mt-10'
      >
        <Link href={'/user/my-orders'}>
       
        <motion.div
        whileHover={{scale:1.04}}
        whileTap={{scale:0.93}}
        className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-8 py-2 rounded-full shadow-lg transition-all'
        >
            Go to My Orders <ArrowRight className='mt-1'/>
        </motion.div>
         </Link>
      </motion.div>
     
    </div>
  )
}

export default OrderSuccess
