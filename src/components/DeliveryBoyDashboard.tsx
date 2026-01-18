'use client'
import { getSocket } from '@/config/socket'
import { IDeliveryAssignment } from '@/models/deliveryAssignment.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import LiveMap from './LiveMap'
import DeliveryChat from './DeliveryChat'
import Order from '@/models/order.model'
import { Loader } from 'lucide-react'

interface Location{
  latitude:number
  longitude:number
}
function DeliveryBoyDashboard() {
  const [assignments,setassignments]  = useState<any[]>()
  const {userData} = useSelector((state:RootState)=>state.user)
  const [activeOrder,setActiveOrder] =  useState<any>(null)
  const [userLocation,setUserLoation] = useState<Location>({
    latitude:0,
    longitude:0
  })
  const [deliveryLocation,setDeliveryLocation] = useState<Location>({
    latitude:0,
    longitude:0
  })

  const [showOtpBox,setShowOtpBox] = useState(false)
  const [otp,setOtp] = useState('')
  const [otpError,setOtpError] = useState("")
  const [sendOtpLoading,setSendOtpLoading] = useState(false)
  const [verifyOtpLoading,setVerifyOtpLoading] = useState(false)
  const fetchAssignments = async()=>{
    try {
      const result = await axios.get("/api/delivery/get-assignment")

      setassignments(result?.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    const socket = getSocket()
     if(!userData?._id)return
            
            const watcher =  navigator.geolocation.watchPosition((pos)=>{
                const lat = pos.coords.latitude
                const lon = pos.coords.longitude
                setDeliveryLocation({
                  latitude:lat,
                  longitude:lon
                })
                socket.emit('updateLocation',{
                userId:userData?._id,
                latitude:lat,
                longitude:lon
            })
            },(error)=>{
                    console.log(error)
            },{enableHighAccuracy:true})

        return ()=>navigator.geolocation.clearWatch(watcher)
         
          
  },[userData?._id])

  useEffect(():any=>{
    const socket = getSocket()
    socket.on('new-assignment',(deliveryAssignment)=>{
      setassignments((prev)=>[deliveryAssignment,...prev!])
    })
    return ()=>socket.off('new-assignment')
  },[])

const handleAccept = async (id:string)=>{
  try {
    let result = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`)
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}
 const fetchCurrentOrder = async ()=>{
  try {
    const result = await axios.get('/api/delivery/current-order')
    console.log(result)
    if(result.data.active){
       setActiveOrder(result.data.assignment)
      setUserLoation({
        latitude:result.data.assignment.order.address.latitude,
        longitude:result.data.assignment.order.address.longitude,
      })
    }
   
    
  } catch (error) {
    console.log(error)
  }
 }
 useEffect(()=>{
fetchCurrentOrder()
fetchAssignments()
 },[userData])

 useEffect(()=>{
  const socket = getSocket()
  socket.on('update-deliveryboy-location',({userId,location})=>{
    setDeliveryLocation({
      latitude:location.coordinates[1],
      longitude:location.coordinates[0],
    })
  })
  return ()=>{socket.off("update-deliveryboy-location")}
 },[])
const sendOtp = async()=>{
  setSendOtpLoading(true)
  try {
    const result = await axios.post("/api/delivery/otp/send",{orderId:activeOrder.order._id})
    console.log(result.data)
  setSendOtpLoading(false)
    setShowOtpBox(true)

  } catch (error) {
    console.log(error)
  setSendOtpLoading(false)

  }
}
const verifyOtp = async()=>{
  setVerifyOtpLoading(true)
  try {
    const result = await axios.post("/api/delivery/otp/verify",{orderId:activeOrder.order._id,otp})
    console.log(result.data)
   setActiveOrder(null)
  setVerifyOtpLoading(false)
  await fetchCurrentOrder()

  } catch (error) {
    console.log(error)
    setOtpError("Otp Verification Error")
  setVerifyOtpLoading(false)

  }
}


 if(activeOrder && userLocation){
  return(
    <div className='p-4 pt-[120px] min-h-screen bg-gray-50'>
        <div className='max-w-3xl mx-auto'>
          <h1 className='text-2xl font-bold text-green-700 mb-2'>Active Delivery</h1>
          <p className='text-gray-600 text-sm mb-4'>Order#{activeOrder?.order?._id!.toLocaleString().slice(-6)}</p>
          <div className='rounded-xl border shadow-lg overflow-hidden   border-gray-500 mb-6'>
              <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryLocation}/>
        </div>
              <DeliveryChat orderId={activeOrder?.order?._id} deliveryBoyId={userData?._id!}/>

              <div className='mt-6 bg-white rounded-xl border border-gray-500 shadow p-6'>
                {
                  !activeOrder.order.deliveryOtpVerification && !showOtpBox &&(
                    <button onClick={sendOtp} className='w-full  py-4 bg-green-600 text-white rounded-lg cursor-pointer flex items-center justify-center'>
                      {sendOtpLoading?<Loader size={24} className='animate-spin text-center text-white'/>:'Mark as Delivered'}
                  
                </button>
                  )
                }

                {
                  showOtpBox &&
                  <div className='mt-4'>
                      <input type="text" className='w-full py-3 border rounded-lg text-center outline-none' placeholder='Enter Otp' maxLength={4} 
                      onChange={(e)=>setOtp(e.target.value)}
                      />
                      <button onClick={verifyOtp} className='w-full flex items-center justify-center mt-4 bg-blue-600 text-white py-3 rounded-lg cursor-pointer'> {verifyOtpLoading?<Loader size={24} className='animate-spin text-white'/>:'Verify OTP'}</button>
                      {otpError && <div className='text-red-600 mt-2'>{otpError}</div>}
                  </div>
                }
                
                {activeOrder.order.deliveryOtpVerification && <div className='text-green-700 text-center font-bold'>
                  Delivery Completed!</div>}


              </div>
        </div>

        
    </div>
  )
 }
  return (
    <div className='w-full min-h-screen bg-gray-50 p-4'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-2xl font-bold mt-[100px] mb-[30px] text-gray-800'>Delivery Assignments</h2>
        {
          assignments?.map((a,index)=>(
           <div key={index} className='p-5 bg-white rounded-xl shadow mb-4 border border-gray-300'>
            <p><b className='text-gray-800'>Order Id </b> #{a?.order?._id.slice(-6)}</p>
            <p className='text-gray-600'>{a.order.address.fullAddress}</p>

            <div className='flex gap-3 mt-4'>
                <button onClick={()=>handleAccept(a?._id)} className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg cursor-pointer'>Accept</button>
                <button className='flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg cursor-pointer'>Reject</button>
            </div>
           </div>
          ))
        }
      </div>
    </div>
  )
}

export default DeliveryBoyDashboard
