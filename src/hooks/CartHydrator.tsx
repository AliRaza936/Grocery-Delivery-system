"use client"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { hydrateCart } from "@/redux/cartSlice"

export default function CartHydrator() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(hydrateCart())
  }, [dispatch])

  return null
}
