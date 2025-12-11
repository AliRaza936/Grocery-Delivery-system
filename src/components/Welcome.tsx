"use client"
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { ArrowRight, Bike, ShoppingBasket } from 'lucide-react'

interface WelcomeProps {
  onFinish: () => void
}

function Welcome({ onFinish }: WelcomeProps) {
const [show, setShow] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShow(true); // show Welcome if first visit
    }
  }, []);

  const handleNext = () => {
    sessionStorage.setItem("hasVisited", "true");
    setShow(false);
     onFinish(); 
  };

  if (!show) return null; // hide component if not first visit


  return (
    <div className='flex flex-col justify-center items-center min-h-screen text-center p-6   bg-linear-to-b from-green-100 to-white '>
      <motion.div
      initial={{
        opacity:0,
        y:-10
        
      }}
      animate={{
        opacity:1,
        y:0
      }}
      transition={{
        duration:0.6,
        
      }}
      className='flex items-center gap-3'
      >
       <ShoppingBasket className='w-10 h-10 text-green-600'/>
       <h1 className='text-4xl md:text:5xl font-extrabold text-green-700'>Grocify</h1>
        </motion.div>
        <motion.p

        initial={{
        opacity:0,
        y:10
        
      }}
      animate={{
        opacity:1,
        y:0
      }}
      transition={{
        duration:0.6,
        delay:0.3,
        
      }}
        className='mt-4 text-gray-700 text-lg md:text-xl max-w-lg'
        >
          Your one-stop shop for all your grocery needs. Fresh, fast, and delivered to your doorstep.
        </motion.p>

        <motion.div
        initial={{
        opacity:0,
        scale:0.9
        
      }}
      animate={{
        opacity:1,
        scale:1
      }}
      transition={{
        duration:0.6,
        delay:0.6,
        
      }}
        className='flex item-center justify-center  mt-10'
        >
         <ShoppingBasket className='w-24 h-24  md:w-32 text-green-600 drop-shadow-md'/>
         <Bike className='w-24 h-24  md:w-32 text-orange-500 drop-shadow-md'/>
        </motion.div>

        <motion.button
        initial={{
        opacity:0,
        y:20
        
      }}
      animate={{
        opacity:1,
        y:0
      }}
      transition={{
        duration:0.6,
        delay:0.8,
        
      }}
        className='inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md  transition-all duration-200 cursor-pointer mt-10'
onClick={handleNext}
      
        >
            Next
            <ArrowRight/>
        </motion.button>


    
    </div>
  )
}

export default Welcome
