"use client"
import { useEffect } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserData, clearUser } from "@/redux/userSlice"
import { useSession } from "next-auth/react"

function useGetMe() {
  const dispatch = useDispatch()
  const { data: session, status } = useSession()

  useEffect(() => {
    const getMe = async () => {
      if (status === "loading") return 

      if (status === "unauthenticated") {
        dispatch(clearUser()) 
        return
      }
      try {
        const res = await axios.get("/api/me")
        dispatch(setUserData(res.data.user))
      } catch (error) {
        console.error("getMe error:", error)
        dispatch(clearUser()) 
      }
    }

    getMe()
  }, [status, dispatch])
}

export default useGetMe
