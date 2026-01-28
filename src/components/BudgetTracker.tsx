"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Wallet, X, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AlertTriangle } from "lucide-react";

const QUICK_BUDGETS = [1000, 3000, 5000];

export default function BudgetTracker() {
  const { subTotal } = useSelector((state: RootState) => state.cart);

  const [budget, setBudget] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [expandFloating, setExpandFloating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("userBudget");
    if (saved) setBudget(Number(saved));
  }, []);

  useEffect(() => {
    if (budget) {
      localStorage.setItem("userBudget", String(budget));

      window.dispatchEvent(new Event("budget-change"));
    } else {
      localStorage.removeItem("userBudget");

      window.dispatchEvent(new Event("budget-change"));
    }
  }, [budget]);
  const percent = budget ? Math.min((subTotal / budget) * 100, 100) : 0;

  const remaining = budget ? Math.max(budget - subTotal, 0) : null;

  const remainingBg =
    budget && subTotal > budget
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";

  const remainingText =
    budget && subTotal > budget
      ? `You exceeded your budget by Rs. ${(subTotal - budget).toFixed(2)}!`
      : `Remaining: Rs. ${remaining?.toFixed(2)}`;
  if (!budget) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: false, amount: 0.3 }}
          className="w-[90%] md:w-[80%] mx-auto mt-10 bg-white rounded-2xl shadow-lg p-5"
        >
          <p className="font-semibold text-gray-800 text-center mb-3">
            Set Today’s Budget
          </p>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {QUICK_BUDGETS.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setShowCustom(false);
                  setCustom("");
                  setBudget(amt);
                }}
                className="py-2 rounded-xl cursor-pointer bg-green-100 text-green-700 font-semibold hover:bg-green-200"
              >
                Rs. {amt}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCustom(true)}
            className="w-[70%] cursor-pointer mx-auto flex items-center justify-center gap-2 py-2 rounded-xl border font-semibold text-gray-700 hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" /> Custom Budget
          </button>
          {showCustom && (
            <div className="mt-4 flex justify-center">
              <div
                className="
      w-full md:w-[70%]
      bg-green-0 
       
      rounded-2xl 
      p-4 
      space-y-3
    "
              >
                <input
                  type="number"
                  placeholder="Enter custom budget (Rs)"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  className="
          w-full 
          px-4 py-3 
         bg-gray-200 
          rounded-xl 
          text-center 
          font-semibold
          focus:ring-2 focus:ring-green-400
          outline-none
        "
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCustom(false);
                      setCustom("");
                    }}
                    className="
            flex-1 
            py-2.5 
            rounded-xl 
             cursor-pointer
            font-semibold 
            text-gray-600 
            hover:bg-gray-100
          "
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      setBudget(Number(custom));
                      setShowCustom(false);
                      setCustom("");
                    }}
                    disabled={!custom}
                    className="
            flex-1 
            py-2.5 
            rounded-xl 
            bg-green-600 
            text-white 
            font-semibold 
            disabled:opacity-40
            cursor-pointer
          "
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="
  fixed right-3 md:right-4 
  bottom-24 md:top-1/3 
  z-50 flex items-end
"
        ></motion.div>
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: false, amount: 0.3 }}
        className="w-[90%] md:w-[80%] mx-auto mt-10 bg-white rounded-2xl shadow-lg p-5"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-600" />
            <p className="font-semibold">Today’s Budget</p>
          </div>
          <button
            onClick={() => setBudget(null)}
            className="text-gray-400 hover:text-red-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex  gap-10">
          <p className="text-sm text-gray-600">
            Budget:{" "}
            <strong className="text-green-700">Rs. {budget.toFixed(2)}</strong>
          </p>
          <p className="text-sm text-gray-600">
            Spent: <strong>Rs. {subTotal.toFixed(2)}</strong>
          </p>
        </div>

        <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${percent}%` }}
            className={`h-full ${
              percent >= 100
                ? "bg-red-500"
                : percent >= 80
                ? "bg-orange-500"
                : "bg-green-500"
            }`}
          />
        </div>

        <motion.div
          animate={subTotal > budget ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5 }}
          className={`mt-4 p-3 rounded-xl text-center font-semibold flex items-center justify-center gap-2 ${remainingBg}`}
        >
          <div
            className=" p-2 rounded-lg text-center font-semibold flex items-center justify-center gap-2 
  ${remainingBg}"
          >
            {subTotal > budget && (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
            {remainingText}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        onMouseEnter={() => setExpandFloating(true)}
        onMouseLeave={() => setExpandFloating(false)}
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed right-4 top-1/3 z-50 flex items-end"
      >
        <div
          className="
  w-4 md:w-10 
  h-36 md:h-52 
  bg-gray-200 rounded-full 
  overflow-hidden shadow-xl 
  flex items-end
"
        >
          <motion.div
            animate={{ height: `${percent}%` }}
            className={`w-full ${
              percent >= 100
                ? "bg-red-500"
                : percent >= 80
                ? "bg-orange-500"
                : "bg-green-500"
            }`}
          />
        </div>

        {expandFloating && (
          <div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-3 md:ml-3 bg-white rounded-2xl shadow-xl p-4 w-52 relative"
            >
              <button
                onClick={() => setExpandFloating(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 md:hidden"
              >
                <X className="w-4 h-4" />
              </button>

              <p className="font-semibold text-gray-800 mb-1">
                Budget Overview
              </p>
              <p className="text-sm text-gray-600">
                Total:{" "}
                <strong className="text-green-700">
                  Rs. {budget.toFixed(2)}
                </strong>
              </p>
              <p className="text-sm text-gray-600">
                Spent: <strong>Rs. {subTotal.toFixed(2)}</strong>
              </p>

              <motion.div
                animate={subTotal > budget ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5 }}
                className={`mt-4 p-3 rounded-xl text-center  md:font-semibold  text-sm flex items-center justify-center gap-2 ${remainingBg}`}
              >
                {subTotal > budget && (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                {remainingText}
              </motion.div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
}
