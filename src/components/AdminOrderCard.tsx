'use client'
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Phone, Truck, User, UserCheck } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import mongoose from "mongoose";
import { IUser } from "@/models/user.model";
import { IOrderPopulated } from "@/config/populateOrder";
import { getSocket } from "@/config/socket";
import toast from "react-hot-toast";


function AdminOrderCard({ order }: { order: IOrderPopulated }) {
    const statusOptions = ['pending','out of delivery' ]
         const [expanded, setExpended] = useState(false);
          const [status,setStatus] = useState<string>(order.status)
         const 
         updateStatus = async (orderId:string,status:string)=>{
          try {
            const result = await axios.post(`/api/admin/update-order-status/${orderId}`,{status})

let availableBoys = result.data.availableBoys
            if(status == "out of delivery" &&availableBoys?.length == 0 ){
              toast.error("No delivery boy available right now. Please try again later.")
            }
            setStatus(status)
          } catch (error) {

            toast.error("Something went wrong. Please try algain.")
          }
         }
         useEffect(() => {
  setStatus(order.status)
}, [order.status])
useEffect(():any=>{
    const socket = getSocket()
    socket.on('order-status-update',(data)=>{
      if(data.orderId == order._id){
        setStatus(data.status)
      }
    })
    return ()=>socket.off('order-status-update')
  },[])
  return (
    <motion.div
      
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 ">
        <div className="space-y-1">
          <p className="text-lg font-bold flex items-center gap-2 text-green-700">
            <Package size={20} />
            Order #{order._id?.toString().slice(-6)}
          </p>
          {status !== "delivered" &&   <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
              order.paymentMethod == "cod"
                ? "bg-red-100 text-red-700 border-red-300"
                : " bg-green-100 text-green-700 border-green-300"
            }`}
          >
            {order.paymentMethod == "cod" ? "Unpaid" : "Paid"}
          </span>}
        

          <p>{new Date(order?.createdAt!).toLocaleString()}</p>
          <div className="mt-3 space-y-1 text-gray-700 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <User className="text-green-600" size={16} />
              <span>{order?.address.fullName}</span>
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <Phone className="text-green-600" size={16} />
              <span>{order?.address.mobile}</span>
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <MapPin className="text-green-600" size={16} />
              <span>{order?.address.fullAddress}</span>
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            {order?.paymentMethod == "cod" ? (
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Truck size={16} className="text-green-600" />
                Cash on Delivery
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <CreditCard size={16} className="text-green-600" />
                Online Payment
              </div>
            )}
          </div>


            {order?.assignedDeliveryBoy && <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-700 ">
                <UserCheck className="text-blue-600" size={18}/>
                <div className="font-semibold text-gray-600">
                  <p>Assinged to : <span>{order.assignedDeliveryBoy?.name.toString()}</span></p>
                  <p className="text-xs text-gray-600">📞 {order.assignedDeliveryBoy?.mobile}</p>
                </div>
              </div>
              <a href={`tel:${order.assignedDeliveryBoy.mobile}`} className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">Call</a>
              </div>}
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              status === "delivered"
                ? "bg-green-100 text-green-700"
                : status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {status}
          </span>
          {status !== 'delivered'&&
          <select
  className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium
             bg-white text-gray-700 shadow-sm
             hover:border-green-500
             focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
             transition-all duration-200"
             onChange={(e)=>updateStatus(order._id?.toString()!,e.target.value)}
             value={status}
>
  {statusOptions?.map((st) => (
    <option key={st} value={st}>{st.toUpperCase()}
    
    </option>
  ))}
</select>
          }
         
        </div>
      </div>
          <div className="border-t border-gray-200 mt-3 pt-3">
            <button
            onClick={()=>setExpended(pre=>!pre)}
            className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition cursor-pointer"
            >
                <span className="flex items-center gap-2">
                    <Package size={16} className="text-green-600"/>
                    {expanded?"Hide Order Items":`View ${order?.items?.length} Items`}
                </span>
                {expanded? <ChevronUp  className="text-green-600" size={16}/>:<ChevronDown  className="text-green-600" size={16}/>}
            </button>

            <motion.div
            initial={{height:0,opacity:0}}
            animate={{
                height:expanded ? "auto":0,
                opacity:expanded ? 1 : 0,
            }}
            transition={{
                duration:0.3
            }}
            className="overflow-hidden"
            >
                <div className="mt-3 space-y-3">
                    {order?.items.map((item,index)=>(
                        <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition"
                        >
                            <div className="flex items-center gap-3">
                                <Image src={item?.image} alt={item?.name} width={48} height={48} className=" rounded-lg object-cover border border-gray-200"/>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 ">{item?.name}</p>
                                    <p className="text-xs text-gray-500">{item?.quantity} x {item?.unit}</p>
                                   
                                </div>
                            </div>
                           <div>
                            <p className="text-sm fomt-semibold text-gray-800">Rs.{Number(item.price) * item.quantity}</p>
                           </div>

                        </div>
                    ))}

                </div>

            </motion.div>
             <div className="border-t border-gray-500 pt-3 mt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
                                <div className="flex items-center gap-2 text-gray-700 text-sm">
                                    <Truck className="text-green-600"/>
                                    <span>Delivery: <span className="text-green-700 font-bold">{status}</span> </span>
                                </div>
                                <div>
                                    Total: <span className="text-green-700 font-bold">Rs.{order?.totalAmount}</span>
                                </div>
                        </div>
            </div>
    </motion.div>
  );
}

export default AdminOrderCard;
