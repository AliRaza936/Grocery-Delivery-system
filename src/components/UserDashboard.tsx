
import HeroSection from './HeroSection'
import CategoriesSlider from './CategoriesSlider'
import dbConnect from '@/config/db'
import Grocery, { IGrocery } from '@/models/grocery.model'
import GroceryitemCard from "@/components/GroceryItemCard"
import BudgetTracker from './BudgetTracker'

async function UserDashboard({groceriesList}:{groceriesList:IGrocery[]}) {
  await dbConnect()

  let plainGrocery = JSON.parse(JSON.stringify(groceriesList))
  return (
    <>
     <HeroSection/>

        <BudgetTracker

        />
     <CategoriesSlider/>
<div className="w-[90%] md:w-[80%] mx-auto mt-10">
  <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
    Popular Grocery Items
  </h2>

{plainGrocery?.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
    <div className="text-6xl mb-4 animate-bounce-slow">🛒</div>

    <h3 className="text-xl font-semibold text-gray-700">
      No groceries found
    </h3>
    <p className="text-gray-500 mt-2">
      Try searching with a different keyword
    </p>
      
  </div>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
    {plainGrocery.map((item: any) => (
      <GroceryitemCard key={item._id} item={item} />
    ))}
  </div>
)}
   </div> 
    </>
  )
}

export default UserDashboard
