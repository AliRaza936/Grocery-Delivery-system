"use client";

import LiveMap from "@/components/LiveMap";
import { getSocket } from "@/config/socket";
import { IUser } from "@/models/user.model";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ArrowLeft, Loader, Send, Sparkle } from "lucide-react";
import mongoose from "mongoose";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import { IMessage } from "@/models/message.model";

interface Location {
  latitude: number;
  longitude: number;
}

interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    latitude: number;
    longitude: number;
  };
  assignedDeliveryBoy?: IUser;
  status: "pending" | "out of delivery" | "delivered";
}

function TrackOrder() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<IOrder | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>();
  const bottomRef = React.useRef<HTMLDivElement | null>(null);
  const { userData } = useSelector((state: RootState) => state.user);
  const [suggestions,setSuggestions] = useState([])
          const [loading,setLoading] = useState(false)

  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  const [deliveryLocation, setDeliveryLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  const getOrder = async () => {
    try {
      const { data } = await axios.get(`/api/user/get-order/${orderId}`);

      setOrder(data);

      setUserLocation({
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      });

      if (data.assignedDeliveryBoy?.location) {
        setDeliveryLocation({
          latitude:
            data.assignedDeliveryBoy.location.coordinates?.[1] ??
            data.assignedDeliveryBoy.location.latitude,
          longitude:
            data.assignedDeliveryBoy.location.coordinates?.[0] ??
            data.assignedDeliveryBoy.location.longitude,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (orderId) getOrder();
  }, [orderId]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("update-deliveryboy-location", (data) => {
      setDeliveryLocation({
        latitude: data.location.coordinates?.[1] ?? data.location.latitude,
        longitude: data.location.coordinates?.[0] ?? data.location.longitude,
      });
    });

    return () => {
      socket.off("update-deliveryboy-location");
    };
  }, [order]);
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);

    socket.on("send-message", (message) => {
      if (message.roomId === orderId) {
        setMessages((prev) => [...prev!, message]);
      }
    });
    return () => {
      socket.off("send-message");
    };
  }, []);
  const sendMsg = () => {
    const socket = getSocket();

    const message = {
      roomId: orderId,
      text: newMessage,
      senderId: userData?._id,
      time: new Date().toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("send-message", message);

    setNewMessage("");
  };
  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const result = await axios.post("/api/chat/messages", {
          roomId: orderId,
        });
        setMessages(result?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllMessages();
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollTo({top:bottomRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);
  const getSuggestion = async()=>{
    setLoading(true)
    try {
      const lastMessage = messages?.filter(m=>m.senderId !==userData?._id).at(-1)
      const result = await axios.post(`/api/chat/ai-suggestion`,{message:lastMessage?.text,role:"user"})
      setSuggestions(result?.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  return (
    <div className="w-full min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto pb-24">
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b border-gray-600 shadow flex gap-3 items-center z-5000">
          <button
            onClick={() => router.back()}
            className="p-2 bg-green-100 rounded-full cursor-pointer"
          >
            <ArrowLeft className="text-green-700" size={20} />
          </button>

          <div>
            <h2 className="text-xl font-bold">Track Order</h2>
            <p className="text-sm text-gray-600">
              Order #{order?._id?.toString().slice(-6)}{" "}
              <span className="text-green-700 font-semibold">
                {order?.status}
              </span>
            </p>
          </div>
        </div>

        <div className="px-4 mt-6 space-y-4">
          <div className="rounded-3xl overflow-hidden border border-gray-500  shadow">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryLocation}
            />
          </div>

          <div className="bg-white rounded-3xl shadow-lg border p-4 h-[430px] border-gray-600 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-700 text-sm">
                Quick Replies
              </span>
            <motion.button 
          disabled={loading}
          onClick={getSuggestion}
          whileTap={{scale:0.9}}
          className='px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer'
          ><Sparkle size={14}/>{loading?<Loader className='animate-spin w-5 h-5'/>:'AI suggest'}</motion.button>
            </div>
            <div className="flex gap-2 flex-wrap mb-3 ">
              {suggestions?.map((s, i) => (
                <motion.div
                  key={i}
                  whileTap={{ scale: 0.92 }}
                  className="px-3 py-1 text-xs bg-green-50 border border-green-200 text-green-700 rounded-full cursor-pointer"
                  onClick={() => setNewMessage(s)}
                >
                  {s}
                </motion.div>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto  p-2 space-y-3 " ref={bottomRef} >
              <AnimatePresence>
                {messages?.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      msg.senderId == userData?._id!
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 max-w-[75%] rounded-2xl shadow
                ${
                  msg.senderId === userData?._id
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }
                `}
                    >
                      <p>{msg?.text}</p>
                      <p className="text-[10px] opacity-70 mt-1 text-right">
                        {msg.time.toString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex gap-2 mt-3 border-t pt-3 border-gray-600">
              <input
                type="text"
                placeholder="Type a Message..."
                className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white cursor-pointer"
                onClick={sendMsg}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;
