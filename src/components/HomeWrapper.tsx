'use client'
import React, { useState, useEffect } from 'react'
import Welcome from './Welcome'
import Nav from './Nav'
import mongoose from 'mongoose'

interface IUser{
    _id?:mongoose.Types.ObjectId
    name: string
    email: string
    password?: string
    mobile?: string
    role:"user" | "deliveryBoy" |"admin"
    image?:string

}

interface Props {
  user: IUser 
}

const HomeWrapper = ({ user }: Props) => {
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited')
    if (hasVisited) {
      setShowNav(true)
    }
  }, [])

  const handleFinishWelcome = () => {
    setShowNav(true)
  }

  return (
    <>
      {!showNav && <Welcome onFinish={handleFinishWelcome}/>}
      {showNav && <Nav user={user} />}
    </>
  )
}

export default HomeWrapper
