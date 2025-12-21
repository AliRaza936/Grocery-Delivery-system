"use client";

import mongoose from "mongoose";
import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, AlertTriangle, Zap } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/cartSlice";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function GroceryItemCard({ item }: { item: IGrocery }) {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData, subTotal } = useSelector(
    (state: RootState) => state.cart
  );

  const cartItem = cartData.find((i) => i._id === item._id);

  const [budget, setBudget] = React.useState<number | null>(null);

React.useEffect(() => {
  const readBudget = () => {
    const saved = localStorage.getItem("userBudget");
    setBudget(saved ? Number(saved) : null);
  };

  
  readBudget();

  window.addEventListener("budget-change", readBudget);

  window.addEventListener("storage", readBudget);

  return () => {
    window.removeEventListener("budget-change", readBudget);
    window.removeEventListener("storage", readBudget);
  };
}, []);


  const percent = budget ? (subTotal / budget) * 100 : 0;
  const isNearLimit = budget && percent >= 80 && percent < 100;
  const isOverBudget = budget && subTotal > budget;

  // const cardBorder = isOverBudget
  //   ? "border-red-400"
  //   : isNearLimit
  //   ? "border-orange-400"
  //   : "border-gray-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: false, amount: 0.3 }}
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full`}
    >

      <div className="relative w-full aspect-4/3 bg-gray-50 overflow-hidden group">
        <Image
          src={item.image}
          fill
          alt={item.name}
          sizes="(max-width:768px) 100vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-500 font-medium mb-1">
          {item.category}
        </p>

        <h3 className="font-semibold mb-auto">{item.name}</h3>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            {item.unit}
          </span>
          <span className="text-green-700 font-bold text-lg">
            Rs. {item.price}
          </span>
        </div>

     
        {budget && (
          <div className="mt-3">
            {isOverBudget && (
              <div className="flex items-center gap-2 text-red-700 bg-red-100 px-3 py-2 rounded-lg text-xs font-semibold">
                <AlertTriangle size={16} /> Over budget
              </div>
            )}

            {!isOverBudget && isNearLimit && (
              <div className="flex items-center gap-2 text-yellow-500 bg-yellow-100 px-3 py-2 rounded-lg text-xs font-semibold">
                <Zap size={16} /> Near budget limit
              </div>
            )}
          </div>
        )}

        
        {!cartItem ? (
          <motion.button
            
            whileTap={!isOverBudget ? { scale: 0.96 } : {}}
            onClick={() =>
              dispatch(addToCart({ ...item, quantity: 1 }))
            }
            className={`mt-4 flex items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-all w-full
             bg-green-600 hover:bg-green-700 text-white cursor-pointer
            `}
          >
            <ShoppingCart size={18} />
            Add to Cart
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 flex items-center justify-center bg-green-50 border border-green-200 rounded-full py-1 px-4 gap-4"
          >
            <button
              onClick={() => dispatch(decreaseQuantity(item._id))}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all cursor-pointer"
            >
              <Minus size={16} className="text-green-700" />
            </button>

            <span className="text-sm w-5 text-center font-semibold text-gray-800">
              {cartItem.quantity}
            </span>

            <button
              onClick={() => dispatch(increaseQuantity(item._id))}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all cursor-pointer"
            >
              <Plus size={16} className="text-green-700" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default GroceryItemCard;
