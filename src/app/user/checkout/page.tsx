'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, Building, CreditCard, CreditCardIcon, Home, Loader2, Locate, LocateFixed, Map, MapPin, Navigation, Phone, SearchCodeIcon, Truck, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L,{ LatLngExpression, } from 'leaflet'
import "leaflet/dist/leaflet.css"

import axios from 'axios'
import { OpenStreetMapProvider } from 'leaflet-geosearch'


const markerIcon = new L.Icon({
  iconUrl:"https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize:[40,40],
  iconAnchor:[20,40]
})
function Checkout() {
  const router = useRouter()
const {userData} = useSelector((state:RootState)=>state.user)
const {subTotal,finalTotal,deliveryfee} = useSelector((state:RootState)=>state.cart)


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

const DragableMarker:React.FC = ()=>{
  const map = useMap()
  useEffect(()=>{
map.setView(position as LatLngExpression,15, {animate:true})
  },[position,map])
return  <Marker  icon={markerIcon} position={position as LatLngExpression} draggable={true}
                          eventHandlers={{
                            dragend:(e:L.LeafletEvent)=>{
                              const marker = e.target as L.Marker
                             const {lat,lng} = marker.getLatLng()
                             setPosition([lat,lng])
                            }
                          }}
                          > 
                           
                          </Marker>
}

useEffect(()=>{
  const fetchAddress = async()=>{
    if(!position){
      return 
    }
try {
  const result = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`)
  console.log(result.data)
   setAddress((pre)=>({...pre,city:result.data.address.city || '',state:result.data.address.state ||"",pincode:result.data.address.postcode ||"",fullAddress:result.data.display_name ||"" }))
  //  setAddress((pre)=>({...pre,state:result.data.address.state }))
  //  setAddress((pre)=>({...pre,pincode:result.data.address.postcode }))
  //  setAddress((pre)=>({...pre,fullAddress:result.data.display_name }))
} catch (error) {
  console.log(error)
}
  }
  fetchAddress()
},[position])

const handleSearchQuery = async()=>{
  if(!searchQuery){
    return
  }
  setsearchloading(true)
  const provider = new OpenStreetMapProvider()
  const results = await provider.search({ query:searchQuery});
  console.log(results)
  if(results ){
setsearchloading(false)
if(results.length>0){

  setPosition([results[0].y,results[0].x])
}
  }
}
const handleCurrentLocation = ()=>{
  if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition((pos)=>{
      const {latitude,longitude} = pos.coords
      setPosition([latitude,longitude])
    },(err)=>{console.log('location error',err)},{enableHighAccuracy:true,maximumAge:0,timeout:30000})
  }
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
                            <input type="text" value={address.fullName} placeholder='Full Nmae' onChange={(e)=>setAddress((pre)=>({...pre,fullName:e.target.value }))} className='pl-10 w-full border border-gray-300  rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-green-400'/>
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
                    <button  className='bg-green-600 text-white px-5 h-[45px] rounded-lg hover:green-700 transition-all font-medium cursor-pointer' onClick={handleSearchQuery}>{searchloading?<Loader2 size={16} className='animate-spin '/>:"Search"}</button>
                  </div>
                  <div className='relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-300 shadow-inner'>
                    {
                      position && 
                        <MapContainer center={position as LatLngExpression} zoom={13} scrollWheelZoom={true}
                         className='w-full h-full'
                         >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                         <DragableMarker/>
                        </MapContainer>
                    }
                    <motion.button onClick={handleCurrentLocation}
                    whileTap={{scale:0.93}}
                     className='absolute bottom-4 right-4 bg-green-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-999 cursor-pointer'>
                      <LocateFixed/>
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
              <motion.button whileTap={{scale:0.93}} className=' w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold cursor-pointer'>
                        {paymentMethod === 'cod' ? "Place Order" : 'Pay & Place Order'}
              </motion.button>
            </motion.div>
      </div>
    </div>
  )
}

export default Checkout
