'use client'

import LiveMap from '@/components/LiveMap'
import { getSocket } from '@/config/socket'
import { IUser } from '@/models/user.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import mongoose from 'mongoose'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'



interface Location {
  latitude: number
  longitude: number
}

interface IOrder {
  _id?: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  totalAmount: number
  paymentMethod: 'cod' | 'online'
  address: {
    latitude: number
    longitude: number
  }
  assignedDeliveryBoy?: IUser
  status: 'pending' | 'out of delivery' | 'delivered'
}



function TrackOrder() {
  const { orderId } = useParams<{ orderId: string }>()
  const router = useRouter()

  const [order, setOrder] = useState<IOrder | null>(null)

  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  })

  const [deliveryLocation, setDeliveryLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  })


  const getOrder = async () => {
    try {
      const { data } = await axios.get(`/api/user/get-order/${orderId}`)

      setOrder(data)


      setUserLocation({
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      })


      if (data.assignedDeliveryBoy?.location) {
        setDeliveryLocation({
          latitude:
            data.assignedDeliveryBoy.location.coordinates?.[1] ??
            data.assignedDeliveryBoy.location.latitude,
          longitude:
            data.assignedDeliveryBoy.location.coordinates?.[0] ??
            data.assignedDeliveryBoy.location.longitude,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (orderId) getOrder()
  }, [orderId])

  useEffect(() => {
    const socket = getSocket()
   
    socket.on('update-deliveryboy-location', (data)=>{
      setDeliveryLocation({
        latitude:data.location.coordinates?.[1] ?? data.location.latitude,
        longitude:data.location.coordinates?.[0] ?? data.location.longitude,
      })
    })

    return () => {
      socket.off('update-deliveryboy-location')
    }
  }, [order])


  return (
    <div className="w-full min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto pb-24">


        <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-50">
          <button
            onClick={() => router.back()}
            className="p-2 bg-green-100 rounded-full"
          >
            <ArrowLeft className="text-green-700" size={20} />
          </button>

          <div>
            <h2 className="text-xl font-bold">Track Order</h2>
            <p className="text-sm text-gray-600">
              Order #{order?._id?.toString().slice(-6)}{' '}
              <span className="text-green-700 font-semibold">
                {order?.status}
              </span>
            </p>
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="rounded-3xl overflow-hidden border shadow">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryLocation}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrder
