"use client";

import { RootState } from "@/redux/store";
import { Boxes, ClipboardCheck, Cross, LogOut, Menu, Package, PlusCircle, Search, ShoppingCartIcon, User, X } from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}
function Nav({ user }: { user: IUser }) {
  const [open, setOpen] = useState(false);
  const profileDropDown = React.useRef<HTMLDivElement>(null);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);  
  const {cartData} = useSelector((state:RootState)=>state?.cart)
 const searchBarRef = React.useRef<HTMLDivElement>(null);
const pathname = usePathname();

useEffect(() => {
  setSearchBarOpen(false);
}, [pathname]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
        if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node)
    ) {
      setSearchBarOpen(false);
    }
      
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  let sideBar = menuOpen ? createPortal(
    <AnimatePresence>
      <motion.div 
      initial={{x:-100,opacity:0}}
      animate={{x:0,opacity:1}}
      exit={{x:-100,opacity:0}}
      transition={{type:"spring",stiffness:100,damping:14}}
      className="fixed top-0 left-0 h-full w-[75%] sm:[60%] z-9999 bg-linear-to-b from-green-800/90 to-green-900/90 backdrop-blur-xl border-r border-green-400/20 shadow-[0_0_50px_-10px_rgba(0,255,100,0.3)] flex flex-col p-6 text-white"
      >
        <div className="flex justify-between items-center mb-2 ">
          <h1 className="font-extrabold text-2xl tracking-wide text-white/90 ">Admin Panel</h1>
          <button className="text-white/80 hover:text-red-400 text-2xl font-bold transition cursor-pointer" onClick={()=>setMenuOpen(false)}><X/></button>
        </div>
        <div className="flex items-center gap-3 p-3 mt-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all shadow-inner">
             <div
            className="relative bg-white rounded-full w-12 h-12 border-2 border-green-400/60 "
            onClick={() => setOpen((pre) => !pre)}
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt="user"
                fill
                className="object-cover rounded-full"
              />
            ) : !user ?(<User/>):(
              <div className="flex justify-center bg-green-200   w-full h-full items-center">
                <span className="text-2xl font-semibold capitalize text-gray-700">{user?.name?.charAt(0)}</span>
              </div>
            ) }
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{user?.name}</h2>
            <p className="text-xs text-green-200 capitalize tracking-wide">{user?.role}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 font-medium mt-6 ">
           <Link href={"/admin/add-grocery"} className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all">
          <PlusCircle className="w-5 h-5"/> Add Grocery
          </Link>
          <Link href={""} className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all">
          <Boxes className="w-5 h-5"/> View Grocery
          </Link>
          <Link href={"/admin/manage-orders"} className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all">
          <ClipboardCheck className="w-5 h-5"/> Manage Grocery
          </Link>

        </div>

<div className="my-5 border-t border-white/20"></div>
<div className="flex items-center gap-3 text-red-300 font-semibold mt-auto hover:bg-red-500/20 p-3 rounded-lg transition-all"
onClick={async()=>await signOut({callbackUrl:"/"})}
>
  <LogOut className="w-5 h-5 text-red-300"/>
  LogOut
</div>
      </motion.div>

    </AnimatePresence>,document.body
  ) : null

  return (
    <div className="w-[95%] z-9999 fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 ">
      <Link
        href={"/"}
        className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform"
      >
        Grocify
      </Link>
{ (!user || user?.role =="user") && <div className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg">
        {" "}
        <Search className="text-gray-500 w-5 h-5 mr-2" />{" "}
        <input
          type="text"
          placeholder="Search groceries..."
          className="w-full outline-none text-gray-700 placeholder-gray-400"
        />{" "}
      </div>}
      

      <div className="flex items-center gap-3 md:gap-6 relative ">

        {(!user || user?.role == "user")  && <>
        <div
          className="bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition md:hidden"
          onClick={() => setSearchBarOpen((pre) => !pre)}
        >
          <Search className="text-green-600 w-6 h-6" />
        </div>

        <Link
          href={"/user/cart"}
          className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition "
        >
          <ShoppingCartIcon className="text-green-600 w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow">
            {cartData?.length}
          </span>
        </Link>
        </>}
        
        {user?.role == "admin" && <>
        
        <div className="hidden md:flex items-center gap-4">
          <Link href={"/admin/add-grocery"} className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all">
          <PlusCircle className="w-5 h-5"/> Add Grocery
          </Link>
          <Link href={""} className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all">
          <Boxes className="w-5 h-5"/> View Grocery
          </Link>
          <Link href={"/admin/manage-orders"} className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all">
          <ClipboardCheck className="w-5 h-5"/> Manage Grocery
          </Link>

        </div>
        <div className="md:hidden cursor-pointer bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md" onClick={()=>setMenuOpen(pre=>!pre)}>
          <Menu className="text-green-600 w-6 h-6"/>
        </div>

        </>}

        <div className="relative" ref={profileDropDown}>
          <div
            className="bg-white rounded-full w-11 h-11 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform  cursor-pointer"
            onClick={() => setOpen((pre) => !pre)}
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt="user"
                fill
                className="object-cover rounded-full"
              />
            ) : !user ?(<User/>):(
              <div className="flex justify-center bg-green-200   w-full h-full items-center">
                <span className="text-2xl font-semibold capitalize text-gray-700">{user?.name?.charAt(0)}</span>
              </div>
            ) }
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.9,
                }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-999"
              >
                {user ? (
                  <div>
                    <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden relative">
                        {user?.image ? (
                          <Image
                            src={user.image}
                            alt="user"
                            fill
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <div className="flex justify-center ">
                            <span className="capitalize font-semibold text-xl text-gray-600">{user.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-gray-800 font-semibold">
                          {user?.name}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {user?.role}
                        </div>
                      </div>
                    </div>
                        {(!user || user?.role == "user") &&  <Link
                      href={"/user/my-orders"}
                      className="flex items-center gap-2 px-3 py-3 hover:bg-green-50 rounded-lg text-gray-700 font-medium"
                      onClick={() => setOpen(false)}
                    >
                      <Package className="w-5 h-5 text-green-600" />
                      My Orders
                    </Link>}
                    

                    <button
                      className="flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-50 rounded-lg text-gray-700 font-medium cursor-pointer"
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                    >
                      <LogOut className="w-5 h-5 text-red-600" />
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      className="flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                      onClick={() => setOpen(false)}
                    >
                      Sign In
                    </Link>
                    <div className="text-center text-gray-500 text-sm">
                      <p>if you don't have account</p>
                    </div>
                    <Link
                      href="/register"
                      className="flex items-center justify-center px-4 py-2 rounded-lg border border-green-600 text-green-600 font-medium hover:bg-green-50 transition"
                      onClick={() => setOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {searchBarOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.9,
                }}
                ref={searchBarRef}
                className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full px-4 py-2 shadow-lg flex items-center z-40"
              >
                <Search className="text-gray-500 w-5 h-5 mr-2" />
                 
                 <form className="grow">
                  

                <input
                  type="text"
                  placeholder="Search groceries..."
                  className="w-full outline-none text-gray-700 placeholder-gray-400"
                 
                />
              
                 </form>
                
                <button>
                  <X className="text-gray-500 w-5 h-5 " onClick={() => setSearchBarOpen(false)} />
                </button>
               
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
          {sideBar}
    </div>
  );
}

export default Nav;
