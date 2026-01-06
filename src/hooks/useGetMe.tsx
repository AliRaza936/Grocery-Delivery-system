"use client"

import { useEffect } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserData } from "@/redux/userSlice"
import { useSession } from "next-auth/react"

function useGetMe() {
  const dispatch = useDispatch()
  const { data:session, status } = useSession()

  useEffect(() => {
    if (status !== "authenticated") return

    const getMe = async () => {
      try {
        const res = await axios.get("/api/me")
        dispatch(setUserData(res.data.user)) 
      } catch (error) {
        console.error("getMe error:", error)
      }
    }

    getMe()
  }, [status, dispatch]) 
}

export default useGetMe
