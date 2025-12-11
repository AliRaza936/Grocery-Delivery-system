'use client'
import { LogOut, Package, Search, ShoppingCartIcon, User } from 'lucide-react'
import mongoose from 'mongoose'
import { AnimatePresence, motion } from 'motion/react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
interface IUser{
    _id?:mongoose.Types.ObjectId
    name: string
    email: string
    password?: string
    mobile?: string
    role:"user" | "deliveryBoy" |"admin"
    image?:string

}
function Nav({user}:{user:IUser}) {
const [open,setOpen] = useState(false)
  return (
    <div className='w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-50'>
      <Link href={"/"} className='text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform'>
            Grocify
      </Link>

      <form className='hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg'>
      <Search className='text-gray-500 w-5 h-5 mr-2'/>
      <input type="text" placeholder='Search groceries...' className='w-full outline-none text-gray-700 placeholder-gray-400'/>
      </form>

      <div className='flex items-center gap-3 md:gap-6 relative '>
    <Link href={''} className='relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition '>
    <ShoppingCartIcon className='text-green-600 w-6 h-6'/>
    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow'>0</span>
    </Link>

    <div className='relative'>
        <div className='bg-white rounded-full w-11 h-11 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform  cursor-pointer' onClick={()=>setOpen(pre=>!pre)}>
        {user?.image?<Image src={user.image} alt='user' fill className='object-cover rounded-full'/>:<User/>}
    </div>

    <AnimatePresence>
        {
            open && <motion.div
            initial={{
                opacity:0,
                y:-10,
                scale:0.9,
            }}
            animate={{
                opacity:1,
                scale:1,
                y:0,
            }}
            transition={{
               duration:0.6
            }}
            exit={{
                 opacity:0,
                y:-10,
                scale:0.9,
            }}
                className='absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-999'
            >
                {
                    user ? <div>
                                        <div className='flex items-center gap-3 px-3 py-2 border-b border-gray-100'>
                    <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden relative'>
                         {user?.image?<Image src={user.image} alt='user' fill className='object-cover rounded-full'/>:<User/>}
                    </div>
                    <div>
                        <div className='text-gray-800 font-semibold'>{user.name}</div>
                        <div className='text-xs text-gray-500 capitalize'>{user.role}</div>
                    </div>

                </div>

                <Link href={''} className='flex items-center gap-2 px-3 py-3 hover:bg-green-50 rounded-lg text-gray-700 font-medium'
                onClick={()=>setOpen(false)}
                >
                <Package className='w-5 h-5 text-green-600'/>
                My Orders
                </Link>

                <button className='flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-50 rounded-lg text-gray-700 font-medium cursor-pointer' onClick={()=>{
                    setOpen(false)
                    signOut({callbackUrl:'/'})
                }}>
                    <LogOut className='w-5 h-5 text-red-600'/>
                    Log Out

                </button>
                    </div>:      
                      <div className='flex flex-col gap-2'>
          <Link
            href='/login'
            className='flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition'
            onClick={() => setOpen(false)}
          >
            Sign In
          </Link>
          <div className='text-center text-gray-500 text-sm'>
            <p>if you don't have account</p>
          </div>
          <Link
            href='/register'
            className='flex items-center justify-center px-4 py-2 rounded-lg border border-green-600 text-green-600 font-medium hover:bg-green-50 transition'
            onClick={() => setOpen(false)}
          >
            Sign Up
          </Link>
        </div>

                }


            </motion.div>
        }
    </AnimatePresence>
    </div>
    
      </div>
    </div>
  )
}

export default Nav
