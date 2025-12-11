"use client";
import React, { useState } from "react";
import { motion, scale } from "motion/react";
import { ArrowRight, Bike, User } from "lucide-react";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";

function EditRoleMobile() {
  const [role, setRole] = useState([
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]);
  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
    let router = useRouter()

const handleEditRoleMobile = async () => {
    setLoading(true)
    try {
        const result = await axios.post("/api/user/edit-role-mobile",{role:selectedRole,mobile})
        setLoading(false)
        router.push('/')
    } catch (error) {
        console.log("Error updating role and mobile:", error)
        setLoading(false)
    }
}



  return (
    <div className="flex flex-col items-center min-h-screen p-6 w-full">
      <motion.h1
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>
      <div className="flex flex-col md:flex-row justify-center items-center mt-10 gap-6">
        {role.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          return (
            <motion.div
              key={role.id}
              initial={{opacity:0,y:10}}
              animate={{opacity:1,y:0}}
              transition={{duration:0.2,delay:0.2}}
              whileHover={{ scale: 0.94 }}
              onClick={() => setSelectedRole(role?.id)}
              className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border transition-all cursor-pointer
                    ${
                      isSelected
                        ? "border-green-600 bg-green-100 shadow-lg"
                        : "border-gray-300 bg-white hover:border-green-400"
                    }
                    `}
            >
              <Icon className="w-12 h-12 text-green-700 mb-4" />
              <span className="text-xl font-semibold text-gray-800">
                {role.label}
              </span>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.5,
          duration: 0.6,
        }}
        className="flex flex-col items-center  mt-10"
      >
        <label htmlFor="mobile" className="text-gray-700 font-medium mb-2">
          Enter Your Mobile No.
        </label>
        <input
          type="tel"
          id="mobile"
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
          placeholder="eg. 0000000000"
         value={mobile}
          onChange={(e)=>setMobile(e.target.value)}

        />
      </motion.div>
      <motion.button
       initial={{
        opacity:0,
        y:20
        
      }}
      animate={{
        opacity:1,
        y:0
      }}
      transition={{
        delay:0.7,
        
      }}
      disabled={!mobile || !selectedRole}
      className={`inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 w-[200px] mt-10 outline-none  cursor-pointer
        ${
            selectedRole && String(mobile).trim().length >= 10
            ? "bg-green-600 hover:bg-green-700 text-white"
            :" bg-gray-300 text-gray-500 cursor-not-allowed"
                }
        `}
        onClick={handleEditRoleMobile}
      >
        {loading ? 'Updating...':'Go to Home'}

<ArrowRight/>
      </motion.button>
    </div>
  );
}

export default EditRoleMobile;
