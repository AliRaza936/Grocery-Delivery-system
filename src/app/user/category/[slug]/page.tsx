"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader,
  PackageOpen,
  Sparkles,
  ShoppingBasket,
  ArrowLeft,
} from "lucide-react";
import GroceryItemCard from "@/components/GroceryItemCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import HomeWrapper from "@/components/HomeWrapper";
import { motion } from "motion/react";

function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { userData } = useSelector((state: RootState) => state.user);

  const getProductsByCategory = async () => {
    try {
      const { data } = await axios.get(`/api/user/categoryProduct/${slug}`);
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) getProductsByCategory();
  }, [slug]);

  const formattedTitle = slug
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-3 bg-linear-to-br from-green-50 to-white">
        <Loader className="w-12 h-12 animate-spin text-green-600" />
        <p className="text-green-700 font-semibold tracking-wide">
          Fetching fresh items...
        </p>
      </div>
    );
  }

  return (
    <>
      <HomeWrapper user={userData} />


      <div className="relative pt-32 pb-20 overflow-hidden">


      

        <div className="relative max-w-7xl mx-auto px-4">
              <button
          onClick={() => router.back()}
          className="mb-2 flex items-center gap-2 cursor-pointer bg-white/70 backdrop-blur-md shadow-md hover:bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold z-20 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden md:inline">Back</span>
        </button>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-xl bg-white/60 border border-green-200 rounded-3xl p-8 shadow-xl"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center shadow-inner">
                <ShoppingBasket className="text-green-700 w-7 h-7" />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-green-800">
                  {formattedTitle}
                </h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-green-500" />
                  Hand-picked essentials just for you
                </p>
              </div>

              <span className="ml-auto px-4 py-1.5 rounded-full text-sm font-semibold bg-green-600 text-white shadow">
                {products.length} items
              </span>
            </div>
          </motion.div>
        </div>
      </div>


      <div className="relative max-w-7xl mx-auto px-4 pb-20">
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center py-24"
          >
            <PackageOpen className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              Nothing here yet
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              We’re restocking this category soon. Check back in a bit for
              fresh groceries.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
           className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
          >
            {products.map((item: any) => (
              <motion.div
                key={item._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <GroceryItemCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}

export default CategoryPage;
