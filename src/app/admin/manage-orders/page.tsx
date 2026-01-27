'use client'
import AdminOrderCard from "@/components/AdminOrderCard";
import { subscribeSocketConnection } from "@/config/isSocketConnect";
import { IOrderPopulated } from "@/config/populateOrder";
import { getSocket } from "@/config/socket";
import axios from "axios";
import { ArrowLeft, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


function ManageOrders() {
  const [orders, setOrders] = useState<IOrderPopulated[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading,setLoading] = useState<boolean>(false);
  const router = useRouter();

  const getOrders = async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/admin/get-orders");
      setOrders(result.data);
      setLoading(false);
    } catch (error) {
setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket?.on("new-order", (newOrder: IOrderPopulated) => {
      setOrders((prev) => [newOrder, ...prev]);
    });
    socket.on('order-assinged',({orderId,assignedDeliveryBoy})=>(
       setOrders((prev)=>prev?.map((o)=>(
        o._id == orderId ? {...o,assignedDeliveryBoy}:o
      )))
    ))
    
    return () =>{ 
      socket.off("new-order")
      socket.off("order-assinged")
    };
  }, []);

useEffect(() => {
  const unsubscribe = subscribeSocketConnection(setIsConnected);

  return () => {
    unsubscribe?.();
  };
}, []);
if (!isConnected) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader className="animate-spin w-10 h-10 text-green-600" />
      <p className="ml-2 text-green-700 font-semibold">Connecting...</p>
    </div>
  );
}
if (isConnected && loading) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader className="animate-spin w-10 h-10 text-green-600" />
      <p className="ml-2 text-green-700 font-semibold">Loading Orders...</p>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b border-gray-500 z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 bg-gray-100 rounded-full hover:bg-green-200 active:scale-0.95 transition cursor-pointer"
          >
            <ArrowLeft size={24} className="text-green-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Manage Orders</h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-8">
        <div className="space-y-6">
          {orders?.map((order) => (
            <AdminOrderCard key={order._id?.toString()} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;
