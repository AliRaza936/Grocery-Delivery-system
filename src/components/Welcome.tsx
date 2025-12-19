"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Bike, ShoppingBasket } from "lucide-react";

interface WelcomeProps {
  onFinish: () => void;
}

function Welcome({ onFinish }: WelcomeProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShow(true);
      document.body.style.overflow = "hidden"; // 🔒 lock scroll
    }

    return () => {
      document.body.style.overflow = "auto"; // 🔓 unlock scroll
    };
  }, []);

  const handleNext = () => {
    sessionStorage.setItem("hasVisited", "true");
    setShow(false);
    document.body.style.overflow = "auto";
    onFinish();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-9999 bg-linear-to-b from-green-100 via-white to-green-50 flex items-center justify-center">
      <div className="text-center px-6 max-w-xl w-full">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3"
        >
          <ShoppingBasket className="w-12 h-12 text-green-600" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 tracking-wide">
            Grocify
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-5 text-gray-700 text-lg md:text-xl leading-relaxed"
        >
          Your one-stop shop for all your grocery needs.  
          <span className="font-semibold text-green-700">
            {" "}Fresh, fast, delivered.
          </span>
        </motion.p>

        {/* Icons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center items-center gap-8 mt-12"
        >
          <ShoppingBasket className="w-24 h-24 md:w-28 text-green-600 drop-shadow-lg" />
          <Bike className="w-24 h-24 md:w-28 text-orange-500 drop-shadow-lg" />
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          onClick={handleNext}
          className="mt-14 inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </motion.button>

      </div>
    </div>
  );
}

export default Welcome;
