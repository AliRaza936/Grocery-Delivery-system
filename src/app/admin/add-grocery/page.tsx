"use client"
import { ArrowLeft, Loader2, PlusCircle, Upload } from "lucide-react";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";
import {motion} from 'motion/react'
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";



 const categories = [
  { id: 1, label: "Fruits & Vegetables", value: "fruits-vegetables" },
  { id: 2, label: "Dairy & Eggs", value: "dairy-eggs" },
  { id: 3, label: "Breakfast Essentials", value: "breakfast-essentials" },
  { id: 4, label: "Rice, Atta & Grains", value: "rice-atta-and-grains" },
  { id: 5, label: "Snacks & Biscuits", value: "snacks-and-biscuits" },
  { id: 6, label: "Spices & Masalas", value: "spices-and-masalas" },
  { id: 7, label: "Beverages & Drinks", value: "beverages-and-drinks" },
  { id: 8, label: "Personal Care", value: "personal-care" },
  { id: 9, label: "Household Essentials", value: "household-essentials" },
  { id: 10, label: "Instant & Packaged Food", value: "instant-packaged-food" },
  { id: 11, label: "Baby & Pet Care", value: "baby-pet-care" },
]

        const units = ["kg","g","liter","ml","piece","pack"] 
function AddGrocery() {
  const [name,setName] = useState("")
  const [category,setCategory] = useState("")
  const [slug,setSlug] = useState("")
  const [unit,setUnit] = useState("")
  const [price,setPrice] = useState("")
  const [preview,setPreview] = useState<string|null>()
  const [backendImage,setBackendImage] = useState<File|null>()
const {data:session} = useSession()
  const [loading,setLoading] = useState(false)

const handleImageChange = (e:ChangeEvent<HTMLInputElement>)=>{
  const files = e.target.files
  if(!files || files.length == 0) return

  const file = files[0]
  setBackendImage(file)
  setPreview(URL.createObjectURL(file))
}

const handleSubmit = async(e:FormEvent)=>{
  e.preventDefault()

if(session?.user?.role !== "admin" ){
   toast.error("You are not authorized to perform this action")
  return
}
if(!name || !category || !price || !unit){
  toast.error("Please fill all the required fields")
  return
}
if(!backendImage){
  toast.error("Please upload an image for the grocery item")
  return
}
  try {
    const formData = new FormData()
    formData.append('name',name)
    formData.append('category',category)
    formData.append("slug", slug)
    formData.append('price',price)
    formData.append('unit',unit)

    if(backendImage){

      formData.append('image',backendImage)
    }
    setLoading(true)
    let result = await axios.post("/api/admin/add-grocery",formData)
      toast.success("Grocery item added successfully")

    setLoading(false)
  } catch (error) {
    
    toast.error("Something went wrong. Please try again.")
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white py-16 px-4 relative">
      <Link href={"/"} className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all">
        <ArrowLeft className="w-5 h-5 "/>
        <span className="hidden md:flex">Back to home</span>
       
      </Link>

    <motion.div
    initial={{y:20,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:0.4}}
    className="bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 p-8"
    >

      <div className="flex flex-col items-center mb-8 ">
        <div className="flex items-center gap-3">
          <PlusCircle className="text-green-600 w-8 h-8 "/>
          <h1 className="font-semibold text-gray-800 text-xl">Add Your Grocery</h1>
        </div>
        <p className="text-gray-500 text-sm mt-2 text-center">Fill out the details below to add a new grocery item.</p>

      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 w-full">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                Grocery Name <span className="text-red-500">*</span>
              </label>
              <input type="text" id="name" placeholder="eg: Sweets,Milk ..." className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all" 
              onChange={(e)=>setName(e.target.value)}
              value={name}
              />
            </div>
            <div className="grid grid-cols-1  sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="" className="block text-gray-700 font-medium mb-1">Category <span className="text-red-500">*</span></label>
                <select name="Category" value={category} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white " onChange={(e) => {
    const selected = categories.find(
      c => c.label === e.target.value
    )
    setCategory(selected?.label || "")
    setSlug(selected?.value || "")
  }} >
                  <option value="">Select Category</option>
                  {categories.map(cat=>(
                    <option key={cat.id} value={cat.label} className="">{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                     <label htmlFor="" className="block text-gray-700 font-medium mb-1">Unit<span className="text-red-500">*</span></label>
                <select name="Units" value={unit} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white " 
                onChange={(e)=>setUnit(e.target.value)}
                >
                  <option value="">Select Units</option>
                  {units.map(unit=>(
                    <option key={unit} value={unit} >{unit}</option>
                  ))}
                </select>
              </div>
            </div>
             <div>
              <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input type="text" id="price" placeholder="eg: 120" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
              onChange={(e)=>setPrice(e.target.value)}
              value={price}
              />
            </div>

             <div className="flex flex-col sm:flex-row  items-center gap-5">
              <label htmlFor="image" className="cursor-pointer flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold border border-green-200 rounded-xl px-6 py-3 hover:green-100 transition-all w-full sm:w-auto">
              <Upload className="w-5 h-5"/>  Upload image
              </label>
              <input type="file" accept="image/*" hidden id="image"
              onChange={handleImageChange}
              
              />
              {
                preview && <Image src={preview} width={100} height={100} alt="image" className="rounded-xl shadow-md border border-gray-200 object-cover "/>
              }
            </div>

            <motion.button
            disabled={loading}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.9 }}
  className="mt-4 w-full bg-linear-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer"
>
  {loading?<Loader2 className="animate-spin" />:"Add Grocery"}
 
</motion.button>

        </div>

      </form>

    </motion.div>

    </div>
  );
}

export default AddGrocery;
