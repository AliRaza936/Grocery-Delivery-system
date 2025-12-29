"use client"

import { useEffect } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserData } from "@/redux/userSlice"


async function useGetMe() {
  const dispatch = useDispatch()

  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await axios.get("/api/me")
        console.log(res)
        dispatch(setUserData(res.data))
      } catch (error) {
       console.log(error)
      }
    }

    getMe()
  }, [dispatch])
}

export default useGetMe
