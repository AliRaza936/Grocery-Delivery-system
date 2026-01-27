"use client"
import { Apple, Baby, Box, ChevronLeft, ChevronRight, Coffee, Cookie, CookieIcon, Flame, Heart, Home, Milk, Wheat } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import {motion} from "motion/react"
function CategoriesSlider() {
    const categories = [
  { id: 1, name: "Fruits & Vegetables", icon: Apple, color: "bg-green-100" },
  { id: 2, name: "Dairy & Eggs", icon: Milk, color: "bg-yellow-100" },
  { id: 3, name: "Breakfast Essentials", icon: CookieIcon, color: "bg-amber-100" },
  { id: 4, name: "Rice, Atta & Grains", icon: Wheat, color: "bg-orange-100" },
  { id: 5, name: "Snacks & Biscuits", icon: Cookie, color: "bg-pink-100" },
  { id: 6, name: "Spices & Masalas", icon: Flame, color: "bg-red-100" },
  { id: 7, name: "Beverages & Drinks", icon: Coffee, color: "bg-blue-100" },
  { id: 8, name: "Personal Care", icon: Heart, color: "bg-purple-100" },
  { id: 9, name: "Household Essentials", icon: Home, color: "bg-lime-100" },
  { id: 10, name: "Instant & Packaged Food", icon: Box, color: "bg-teal-100" },
  { id: 11, name: "Baby & Pet Care", icon: Baby, color: "bg-rose-100" },
];

const scrollRef = useRef<HTMLDivElement>(null)

const [showLeft,setShowLeft] = useState<Boolean>()
const [showRight,setShowRight] = useState<Boolean>()

const scroll = (direction:'left' | 'right')=>{
    if(!scrollRef.current) return
    const scrollAmount = direction=='left'?-300:300
    scrollRef.current.scrollBy({left:scrollAmount,behavior:'smooth'})
}

const checkScroll = ()=>{
    if(!scrollRef.current) return
    const {scrollLeft,scrollWidth,clientWidth} = scrollRef.current
  
    setShowLeft(scrollLeft>0)
    setShowRight(scrollLeft+clientWidth<=scrollWidth-5)
}
useEffect(()=>{
    const autoScroll =setInterval(()=>{
            if(!scrollRef.current) return
    const {scrollLeft,scrollWidth,clientWidth} = scrollRef.current
    if(scrollLeft+clientWidth>=scrollWidth-5){
         scrollRef.current.scrollTo({left:0,behavior:'smooth'})
    }else{
         scrollRef.current.scrollBy({left:300,behavior:'smooth'})
    }
    },3000)
return ()=>clearInterval(autoScroll)
},[])
useEffect(()=>{
    scrollRef.current?.addEventListener("scroll",checkScroll)
    checkScroll()
    return ()=>removeEventListener('scroll',checkScroll)
},[])
  return (
    <motion.div className='w-[90%] md:w-[80%] mx-auto mt-10 relative'
    initial={{opacity:0,y:50}}
    whileInView={{opacity:1,y:0}}
    transition={{duration:0.4}}
    viewport={{once:false,amount:0.5}}
    >
      <h2 className='text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center'      >
        🛒 Shop by category
      </h2>
      {showLeft && <button onClick={()=>scroll('left')} className='absolute left-0 top-1/2 -translate-y-1 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer'>
        <ChevronLeft className='w-6 h-6 text-green-700'/>
      </button>}
     
       <div className='flex gap-6 overflow-x-auto px-10 pb-4 scrollbar-hide scroll-smooth' ref={scrollRef}>
        {categories.map((cat)=>{
            const Icon = cat?.icon
            return <motion.div
  key={cat.id}
  className={`flex flex-col items-center justify-center rounded-2xl ${cat.color} shadow-md hover:shadow-xl transition-all cursor-pointer min-w-[110px] sm:min-w-[120px] md:min-w-[150px] lg:min-w-[180px]`}
>
  <div className="flex flex-col justify-center items-center p-3 sm:p-4 md:p-5">
    <Icon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-green-700 mb-2 sm:mb-3" />
    <p className="text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700">
      {cat.name}
    </p>
  </div>
</motion.div>
        })}
       </div>
       {showRight &&<button onClick={()=>scroll('right')} className='absolute right-0 top-1/2 -translate-y-1 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer'>
        <ChevronRight className='w-6 h-6 text-green-700'/>
      </button>}
         
    </motion.div>
  )
}

export default CategoriesSlider
