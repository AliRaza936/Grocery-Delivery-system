"use client"

import { useEffect } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserData, clearUser } from "@/redux/userSlice"

function useGetMe() {
  const dispatch = useDispatch()

  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await axios.get("/api/me")
        dispatch(setUserData(res.data))
      } catch (error) {
        dispatch(clearUser()) // 👈 important
      }
    }

    getMe()
  }, [dispatch])
}

export default useGetMe
