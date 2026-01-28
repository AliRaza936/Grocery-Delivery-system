import React from 'react'
import DeliveryBoyDashboard from './DeliveryBoyDashboard'
import { auth } from '@/auth'
import dbConnect from '@/config/db'
import Order from '@/models/order.model'

async function DeliveryBoy() {
  await dbConnect()
  const session = await auth()
  const deliveryBoyId  = session?.user?.id

  const orders = await Order.find({
    assignedDeliveryBoy:deliveryBoyId,
    deliveryOtpVerification:true,
  })

  const today = new Date().toDateString()
  const todayOrder = orders.filter((o)=>new Date(o.deliveredAt).toDateString()===today).length
  const   todayEarning = todayOrder * 120

  const totalEarning = orders.length * 120

  return (
    <>
    <DeliveryBoyDashboard earning={todayEarning} totalEarning={totalEarning}/>
    </>
  )
}

export default DeliveryBoy
