'use client'
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBasket,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import Image from 'next/image'
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart
} from '@/redux/cartSlice'
import { useRouter } from 'next/navigation'

function CartPage() {
  const { cartData, subTotal, finalTotal, deliveryfee } = useSelector(
    (state: RootState) => state.cart
  )
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const [budget, setBudget] = React.useState<number | null>(null)
  const [showConfirm, setShowConfirm] = React.useState(false)

  React.useEffect(() => {
    const saved = localStorage.getItem('userBudget')
    setBudget(saved ? Number(saved) : null)
  }, [])

  const percentUsed = budget ? (subTotal / budget) * 100 : 0

  return (
    <div className="w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-8 mb-24 relative">
      <Link
        href="/"
        className="absolute -top-2 left-0 flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Back to home</span>
      </Link>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{duration:0.3}}
        className="text-3xl font-bold text-green-700 text-center mb-10"
      >
        🛒 Your Shopping Cart
      </motion.h2>

      {cartData.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-md">
          <ShoppingBasket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-6">
            Your cart is empty.
          </p>
          <Link
            href="/"
            className="bg-green-600 text-white px-6 py-3 rounded-full"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
          <div className="lg:col-span-2 space-y-5">
            <AnimatePresence>
              {cartData.map((item ,i)=> (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-5"
                >
                  <div className="relative w-24 h-24 bg-gray-50 rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-3"
                    />
                  </div>

                  <div className="flex-1 sm:ml-4 text-center sm:text-left">
                    <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.unit}</p>
                    <p className="text-green-700 font-bold">
                      Rs.{Number(item.price) * item.quantity}
                    </p>
                  </div>

                <div className='flex items-center justify-center sm:justify-end gap-3 mt-3 sm:mt-0 bg-gray-50 px-3 py-2 rounded-full'>
                                        <button className='bg-white p-1.5 cursor-pointer rounded-full hover:bg-green-100 transition-all border border-gray-200 ' onClick={()=>dispatch(decreaseQuantity(item?._id))}>
                                          <Minus size={14} className='text-green-700'/>
                                        </button>
                                        <span className='font-semibold text-gray-800 w-6 text-center'>{item.quantity}</span>
                                        <button  className='bg-white p-1.5 rounded-full cursor-pointer hover:bg-green-100 transition-all border border-gray-200 '
                                        onClick={()=>dispatch(increaseQuantity(item?._id))}
                                        >
                                          <Plus size={14} className='text-green-700'/></button>
                                    </div>
                
                                    <div  className='sm:ml-4 mt-3 sm:mt-0 text-red-500 hover:text-red-700 transition-all cursor-pointer' onClick={()=>dispatch(removeFromCart(item?._id))}><Trash2 size={18}/></div>
                
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

  
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 h-fit">
            <h2 className='text-lg sm:text-xl font-bold text-gray-800 mb-4 '>Order Summary</h2>
              <div className='space-y-3 text-gray-700 text-sm sm:text-base'>
                <div className='flex justify-between'>
                <span>SubTotal</span>
                <span className='text-green-700 font-semibold'>Rs.{subTotal}</span>
                </div>
                
                <div className='flex justify-between'>
                <span>Delivery Fee</span>
                <span className='text-green-700 font-semibold'>Rs.{deliveryfee}</span>
                </div>
                <hr className='my-3'/>
                <div className='flex justify-between font-bold text-lg sm:text-xl'>
                <span>Final Total</span>
                <span className='text-green-700 font-semibold'>Rs.{finalTotal}</span>
                </div>
              </div>

        
            {budget && percentUsed >= 80 && percentUsed < 100 && (
              <div className="mt-4 bg-orange-100 text-orange-700 text-sm px-4 py-3 rounded-xl">
                ⚠️ You have used {percentUsed.toFixed(0)}% of your
                budget
              </div>
            )}

            {budget && percentUsed >= 100 && (
              <div className="mt-4 bg-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
                🔴 Budget exceeded by Rs.
                {(subTotal - budget).toFixed(2)}
              </div>
            )}


            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`w-full mt-6 py-3 rounded-full font-semibold cursor-pointer
                ${
                  budget && percentUsed >= 100
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : budget && percentUsed >= 80
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }
              `}
              onClick={() => {
                if (budget && percentUsed >= 100) {
                  setShowConfirm(true)
                } else {
                  router.push('/user/checkout')
                }
              }}
            >
              Proceed to Checkout
            </motion.button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showConfirm && (
          <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <motion.div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-red-600 font-bold mb-3">
                ⚠️ Budget Exceeded
              </h3>
              <p className="text-sm mb-6">
                Do you want to continue with higher amount?
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 border border-gray-200 cursor-pointer rounded-xl py-2"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 cursor-pointer bg-red-600 text-white rounded-xl py-2"
                  onClick={() => router.push('/user/checkout')}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CartPage
