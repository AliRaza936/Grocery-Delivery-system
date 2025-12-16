import React from 'react'
import HeroSection from './HeroSection'
import CategoriesSlider from './CategoriesSlider'
import dbConnect from '@/config/db'
import Grocery from '@/models/grocery.model'
import GroceryitemCard from "@/components/GroceryItemCard"

async function UserDashboard() {
  await dbConnect()
  const groceries = await Grocery.find({})
  let plainGrocery = JSON.parse(JSON.stringify(groceries))
  return (
    <>
     <HeroSection/>
     <CategoriesSlider/>
     <div className='w-[90%] md:w-[80%] mx-auto mt-10'>
        <h2 className='text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center'>Popular Grocery Items</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
           {
      plainGrocery.map((item:any)=>(
        <GroceryitemCard  key={item._id} item={item}/>
      ))
     }
        </div>
     
     </div>
    
    </>
  )
}

export default UserDashboard
