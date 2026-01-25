'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, Building, Circle, CreditCard, CreditCardIcon, Home, Loader2, Locate, LocateFixed, Map, MapPin, Navigation, Phone, SearchCodeIcon, Truck, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L,{ LatLngExpression, } from 'leaflet'
import "leaflet/dist/leaflet.css"

import axios from 'axios'

import { clearCart } from '@/redux/cartSlice'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'

const CheckoutMap = dynamic(()=>import("@/components/CheckoutMap"),{ssr:false})

function Checkout() {
  const router = useRouter()
  const dispatch = useDispatch()
const {userData,loading} = useSelector((state:RootState)=>state.user)
console.log(loading)
const {subTotal,finalTotal,deliveryfee,cartData} = useSelector((state:RootState)=>state.cart)


const [address,setAddress] = useState({
  fullName:"",
  mobile :"" ,
  city:"",
  state:"",
  pincode:"",
  fullAddress:""
})
const [searchQuery,setSearchQuery] = useState('')

const [position,setPosition] = useState<[number,number] | null>(null)
const [searchloading ,setsearchloading] = useState(false)
const [paymentMethod,setPaymentMethod] = useState<'cod' | 'online'>('cod')
const [fixedPosLoading,setFixedPosLoading] = useState(false)
const [placeOrderLoading,setPlaceOrderLoading] = useState(false)
const [orderPlaced, setOrderPlaced] = useState(false);


useEffect(()=>{
  if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition((pos)=>{
      const {latitude,longitude} = pos.coords
      setPosition([latitude,longitude])
    },(err)=>{console.log('location error',err)},{enableHighAccuracy:true,maximumAge:0,timeout:10000})
  }
},[])
useEffect(()=>{
if(userData){
  setAddress((pre)=>({...pre,fullName:userData.name || ''}))
  setAddress((pre)=>({...pre,mobile:userData.mobile || ''}))

}
},[userData])


useEffect(()=>{
  const fetchAddress = async()=>{
    if(!position){
      return 
    }
try {
  const result = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`)

   setAddress((pre)=>({...pre,city:result.data.address.city || '',state:result.data.address.state ||"",pincode:result.data.address.postcode ||"",fullAddress:result.data.display_name ||"" }))
  
} catch (error) {
  console.log(error)
}
  }
  fetchAddress()
},[position])

const handleSearchQuery = async()=>{
  if(!searchQuery && !position){
    return toast.error('Please allow location ')
  }
  if(!position){
    return toast.error('Please allow location ')
  }
  setsearchloading(true)
  const {OpenStreetMapProvider}= await import("leaflet-geosearch")
  const provider = new OpenStreetMapProvider()
  const results = await provider.search({ query:searchQuery});

  if(results ){
setsearchloading(false)
if(results.length>0){

  setPosition([results[0].y,results[0].x])
}
  }
}
const handleCurrentLocation = ()=>{
  
  setFixedPosLoading(true)
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((pos)=>{
      const {latitude,longitude} = pos.coords
      setPosition([latitude,longitude])
      setFixedPosLoading(false)
    },(err)=>{
      setFixedPosLoading(false)
      toast.error('Please allow location or something went wrong')
      console.log('location error',err)},{enableHighAccuracy:true,maximumAge:0,timeout:30000

      })
  }
}
useEffect(() => {
  const timer = setTimeout(() => {
    handleCurrentLocation()
  }, 1500)

  return () => clearTimeout(timer)
}, [])
const validateCheckout = () => {
  if (!address.fullName.trim()) {
    toast.error("Full Name is required");
    return false;
  }
  if (!address.mobile.trim()) {
    toast.error("Phone Number is required");
    return false;
  }
  if (!address.fullAddress.trim()) {
    toast.error("Full Address is required");
    return false;
  }
  if (!address.city.trim()) {
    toast.error("City is required");
    return false;
  }
  if (!address.state.trim()) {
    toast.error("State is required");
    return false;
  }
  if (!address.pincode.trim()) {
    toast.error("Pincode is required");
    return false;
  }
  if (!position) {
    toast.error("Please allow location or select your location on map");
    return false;
  }
  return true;
};
const handleCod = async ()=>{
    if (!validateCheckout()) return;
    if(!position) return null;
  setPlaceOrderLoading(true)
  try {
    let result = await axios.post("/api/user/order",{
      userId:userData?._id,
      items:cartData.map(item=>({
        grocery:item._id,
        name:item.name,
        price:item.price,
        quantity:item.quantity,
        image:item.image,
        unit:item.unit

      })),
      totalAmount:finalTotal,
      address:{
        fullName:address.fullName,
        mobile:address.mobile,
        city:address.city,
        pincode:address.pincode,
        fullAddress:address.fullAddress,
        latitude:position[0],
        longitude:position[1]

      },
      paymentMethod
    })
    setOrderPlaced(true)
setPlaceOrderLoading(false)
dispatch(clearCart())
router.push('/user/order-success')
    console.log(result.data)
  } catch (error) {
    console.log(error)
    setPlaceOrderLoading(false)
  }
}

 

useEffect(() => {
  if (cartData.length === 0 && !orderPlaced) {
    router.replace("/");
  }
}, [cartData, orderPlaced, router]);

if (cartData.length === 0 && !orderPlaced) return null;
  const [showLoginOverlay, setShowLoginOverlay] = useState(false)

  useEffect(() => {
    if (!loading && !userData) {
      setShowLoginOverlay(true)
    }
  }, [loading,userData])

  const handleLoginRedirect = () => {

    router.push(`/login?callbackUrl=/user/checkout`)
  }

  if (!loading && showLoginOverlay ) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-10 w-[90%] max-w-md text-center shadow-2xl"
        >
          <User className="mx-auto text-green-600" size={50} />
          <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-800">You must log in</h2>
          <p className="text-gray-600 mb-6">To place an order, please log in first.</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLoginRedirect}
            className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-all w-full"
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">

      <motion.button
    
        whileTap={{ scale: 0.97 }}
        onClick={() => router.back()}
        className="absolute left-0 top-2 flex items-center gap-2 
                   text-green-700 hover:text-green-800 font-semibold cursor-pointer"
                   
      >
        <ArrowLeft size={18} />
        <span className='hidden md:block'>Back to cart</span>
      </motion.button>
      <motion.h1
     initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{duration:0.3}}
      className='text-3xl md:text-4xl font-bold text-green-700 text-center mb-10'>
        Checkout
      </motion.h1>

      <div className='grid md:grid-cols-2 gap-8'>

            <motion.div
             initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{duration:0.3}}
            className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100'
            >
                <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 '>
                  <MapPin className='text-green-700'/> Delivery Address
                </h2>
                <div className='space-y-4'>

                  <div className='relative'>
                    <User className='absolute left-3 top-3 text-green-600' size={18}/>
                            <input type="text" value={address.fullName} placeholder='Full Name' onChange={(e)=>setAddress((pre)=>({...pre,fullName:e.target.value }))} className='pl-10 w-full border border-gray-300  rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-green-400'/>
                  </div>
                  <div className='relative'>
                    <Phone className='absolute left-3 top-3 text-green-600' size={18}/>
                            <input type="text" value={address.mobile} placeholder='Phone Number' onChange={(e)=>setAddress((pre)=>({...pre,mobile:e.target.value }))}  className='pl-10 w-full border border-gray-300  rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-green-400'/>
                  </div>
                  <div className='relative'>
                    <Home className='absolute left-3 top-3 text-green-600' size={18}/>
                            <input type="text" value={address.fullAddress} onChange={(e)=>setAddress((pre)=>({...pre,fullAddress:e.target.value}))} placeholder='Full Address'  className='pl-10 w-full border border-gray-300  rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-green-400'/>
                  </div>

                  <div className='grid grid-cols-3 gap-3'>
                           <div className='relative'>
                    <Building className='absolute left-3 top-3 text-green-600' size={18}/>
                            <input type="text" value={address.city} onChange={(e)=>setAddress((pre)=>({...pre,city:e.target.value}))} placeholder='city'  className='pl-10 w-full border border-gray-300  rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-green-400'/>
                  </div>
                           <div className='relative'>
                    <Navigation className='absolute left-3 top-3 text-green-600' size={18}/>
                            <input type="text" value={address.state} onChange={(e)=>setAddress((pre)=>({...pre,state:e.target.value}))} placeholder='state'  className='pl-10 w-full border border-gray-300  rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-green-400'/>
                  </div>
                           <div className='relative'>
                    <SearchCodeIcon className='absolute left-3 top-3 text-green-600' size={18}/>
                            <input type="text" value={address.pincode} onChange={(e)=>setAddress((pre)=>({...pre,pincode:e.target.value}))} placeholder='pincode'  className='pl-10 w-full border border-gray-300  rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-green-400'/>
                  </div>
                  </div>
                  <div className='flex flex-wrap items-center justify-center gap-2 mt-3'>
                    <input type="text" placeholder='Search city or area...' className='flex-1 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-400 outline-none ' value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                    <button  className='bg-green-600 outline-none text-white px-5 h-[45px] rounded-lg hover:green-700 transition-all font-medium cursor-pointer' onClick={handleSearchQuery}>{searchloading?<Loader2 size={16} className='animate-spin '/>:"Search"}</button>
                  </div>
                  <div className='relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-300 shadow-inner'>
                    {
                      position && 
                        <CheckoutMap position={position} setPosition={setPosition }/>
                    }
                    <motion.button onClick={handleCurrentLocation}
                    whileTap={{scale:0.93}}
                     className='absolute outline-none bottom-4 right-4 bg-green-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-999 cursor-pointer'>
                      {
                        fixedPosLoading ? <Loader2 className='animate-spin'/> : <LocateFixed/>
                      }
                     
                    </motion.button>
                     
                  </div>

                </div>
            </motion.div>
            <motion.div
             initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{duration:0.3}}
        className='bg-white rounded-2xl shaodw-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 h-fit'
            >
              <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 '><CreditCard className='text-green-600'/> Payment Method</h2>
              <div className='space-y-4 mb-6'>
                      <button 
                      // onClick={()=>setPaymentMethod('online')}
                       className={`flex items-center gap-3 w-full border border-gray-200  cursor-pointer rounded-lg p-3 transition-all
                        ${
                          paymentMethod ==='online'?'border-green-600 bg-green-50 shadow-sm':
                          'hover:bg-gray-50'
                        }
                        `}><CreditCardIcon className={`text-green-600`}/><span className='font-medium text-gray-700'>Pay Online(Not Available)</span></button>
                      <button  onClick={()=>setPaymentMethod('cod')}  className={`flex items-center gap-3 w-full border border-gray-200  cursor-pointer rounded-lg p-3 transition-all
                        ${
                          paymentMethod ==='cod'?'border-green-600 bg-green-50 shadow-sm':
                          'hover:bg-gray-50'
                        }
                        `}><Truck className={`text-green-600`}/><span className='font-medium text-gray-700'>Cash on delivery (COD)</span></button>
              </div>
              <div className='border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base'>
                <div className='flex justify-between'>
                  <span className='font-semibold '>SubTotal</span>
                  <span className='font-semibold text-green-600'>Rs.{subTotal}</span>
                </div>
                <div className='flex justify-between'>
                  <span  className='font-semibold '>Delivery Fee</span>
                  <span className='font-semibold text-green-600'>Rs.{deliveryfee}</span>
                </div>
                <div className='flex justify-between font-bold text-lg border-t pt-3'>
                  <span  className=' '>Final Total</span>
                  <span className='font-semibold text-green-600'>Rs.{finalTotal}</span>
                </div>
               
              </div>
              <motion.button whileTap={{scale:0.93}} className=' w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold cursor-pointer'
              onClick={()=>{
                if(paymentMethod == 'cod'){
                  handleCod()
                }else{
                  null
                }

              }}
              >
                {
                  placeOrderLoading ?( <Loader2 className='animate-spin flex justify-center   w-full'/>)
                  :( paymentMethod === 'cod' ? "Place Order" : 'Pay & Place Order')
                }
                       
              </motion.button>
            </motion.div>
      </div>
    </div>
  )
}

export default Checkout
