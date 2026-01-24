"use client";
import { Facebook, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import mongoose from "mongoose";
import { motion } from "motion/react";
import Link from "next/link";
interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}

interface Props {
  user: IUser;
}

function Footer({ user }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-linear-to-r from-green-600 to-green-700 text-white mt-20"
    >
      <div className="w-[90%] md:w-[80%] mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-green-500/40">
        <div>
          <h2 className="text-2xl font-bold mb-3">Grocify</h2>
          <p className="text-sm text-green-100 leading-relaxed">
            Your one-stop online grocery store delivering freshness to your
            doorstep. Shop smart, eat fresh, and save more every day!
          </p>
        </div>
        {
          ( user?.role !== 'deliveryBoy')? <div>
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-green-100 text-sm">
            <li>
              <Link href={"/"} className="hover:text-white transition">
                Home
              </Link>
            </li>
             {user?.role== 'admin' ? 
              <li>
                <Link
                  href={"/admin/view-grocery"}
                  className="hover:text-white transition"
                >
                  View Groceries
                </Link>
              </li>
            :
                <li>
                <Link
                  href={"/user/cart"}
                  className="hover:text-white transition"
                >
                    Cart
                </Link>
              </li>
            
        }
            {user?.role === 'admin' ? (
  <li>
    <Link
      href={"/admin/manage-orders"}
      className="hover:text-white transition"
    >
      Manage Orders
    </Link>
  </li>
) : (
  user && ( 
    <li>
      <Link
        href={"/user/my-orders"}
        className="hover:text-white transition"
      >
        My Orders
      </Link>
    </li>
  )
)}

            {!user && (
              <li>
                <Link href={"/login"} className="hover:text-white transition">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
        :''
        }
       
        <div>
          <h3 className="text-xl font-semibold mb-3 ">Contact Us</h3>
          <ul className="space-y-2  text-green-100 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Faisalabad,Pakistan
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +92 0000000000
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> aliraza93644@gmail.com
            </li>
          </ul>
          <div className="flex gap-2 mt-4">
             <Link href="https://www.facebook.com/ali.jutt.364676" target="_blank">
              <Facebook className="w-5 h-5 text-gray-300 hover:text-white transition" />
            </Link>
            <Link href="https://www.linkedin.com/in/ali-raza-32074833a/" target="_blank">
              <Linkedin className="w-5 h-5 text-gray-300 hover:text-white transition" />
            </Link>
           
            <Link href="https://github.com/AliRaza936" target="_blank">
              <Github className="w-5 h-5 text-gray-300 hover:text-white transition" />
            </Link>

           
          </div>
        </div>
      </div>
      <div className="text-center py-4 text-sm text-green-100 bg-green-800/40">
         © {new Date().getFullYear()} <span>Grocify</span>. All rights reserved.
      </div>
    </motion.div>
  );
}

export default Footer;
