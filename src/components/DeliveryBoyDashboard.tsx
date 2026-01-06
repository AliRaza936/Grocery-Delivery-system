'use client'
import { getSocket } from '@/config/socket'
import { IDeliveryAssignment } from '@/models/deliveryAssignment.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import LiveMap from './LiveMap'

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
 if(activeOrder && userLocation){
  return(
    <div className='p-4 pt-[120px] min-h-screen bg-gray-50'>
        <div className='max-w-3xl mx-auto'>
          <h1 className='text-2xl font-bold text-green-700 mb-2'>Active Delivery</h1>
          <p className='text-gray-600 text-sm mb-4'>Order#{activeOrder?.order?._id!.toLocaleString().slice(-6)}</p>
        </div>
        <div className='rounded-xl border shadow-lg overflow-hidden border-gray-500 mb-6'>
              <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryLocation}/>
        </div>
    </div>
  )
 }
  return (
    <div className='w-full min-h-screen bg-gray-50 p-4'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-2xl font-bold mt-[100px] mb-[30px] text-gray-800'>Delivery Assignments</h2>
        {
          assignments?.map(a=>(
           <div key={a._id} className='p-5 bg-white rounded-xl shadow mb-4 border border-gray-300'>
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
