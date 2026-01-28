
import HeroSection from './HeroSection'
import CategoriesSlider from './CategoriesSlider'
import dbConnect from '@/config/db'
import Grocery, { IGrocery } from '@/models/grocery.model'
import GroceryitemCard from "@/components/GroceryItemCard"
import BudgetTracker from './BudgetTracker'
import ScrollToGroceries from './ScrollToGroceries'

async function UserDashboard({groceriesList,q}:{groceriesList:IGrocery[],q:string}) {
  await dbConnect()

  let plainGrocery = JSON.parse(JSON.stringify(groceriesList))

 const breakfastGroceries = plainGrocery.filter(
  (item: IGrocery) => item.slug === "breakfast-essentials"
);
 const fruitsAndVegetables = plainGrocery.filter(
  (item: IGrocery) => item.slug === "fruits-vegetables"
);

  return (
   <>
      <ScrollToGroceries />
      <HeroSection />
      <BudgetTracker />
      <CategoriesSlider />

      <div id="groceries-section" className="w-[90%] md:w-[80%] mx-auto mt-10">

        {q ? (

          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-green-700">
                🔍 Search Results
              </h2>
              <p className="text-gray-500 mt-2">
                Showing results for "<span className="italic">{q}</span>"
              </p>
            </div>

            {plainGrocery.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="text-6xl mb-4 animate-bounce-slow">🛒</div>
                <h3 className="text-xl font-semibold text-gray-700">
                  No groceries found
                </h3>
                <p className="text-gray-500 mt-2">Try a different keyword</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {plainGrocery.map((item:any) => (
                  <GroceryitemCard key={item._id} item={item} />
                ))}
              </div>
            )}
          </>
        ) : (

          <>
  
            <div className="text-center mb-6">
              <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold mb-2">
                Morning Picks ☀️
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                Breakfast Essentials
              </h2>
              <p className="text-gray-500 mt-1">Power up your mornings with healthy groceries</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {breakfastGroceries?.map((item:any) => (
                <GroceryitemCard key={item._id} item={item} />
              ))}
            </div>


            <div className="text-center my-6">
              <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold mb-2">
                Fresh Picks 🥝
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                Fruits & Vegetables
              </h2>
              <p className="text-gray-500 mt-1">Fresh & healthy groceries straight from farms</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {fruitsAndVegetables.map((item:any) => (
                <GroceryitemCard key={item._id} item={item} />
              ))}
            </div>

            <div className="text-center my-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2">
                🔥 Popular Grocery Items
              </h2>
              <p className="text-gray-500 mt-2">Most loved & frequently bought by customers</p>
              <div className="flex justify-center mt-3">
                <span className="w-16 h-1 bg-green-600 rounded-full"></span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {plainGrocery.map((item:any) => (
                <GroceryitemCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default UserDashboard
