
import { auth } from '@/auth'
import EditRoleMobile from '@/components/EditRoleMobile'
import HomeWrapper from '@/components/HomeWrapper'
import Nav from '@/components/Nav'
import Welcome from '@/components/Welcome'
import dbConnect from '@/config/db'
import User from '@/models/user.model'
import { redirect } from 'next/navigation'
import React from 'react'


const Home = async () => {

  await dbConnect()
  let session  = await auth()
  const user =  await User.findById(session?.user?.id)

  if(user){
     const inCompleteProfile = !user?.mobile || !user?.role || (!user.mobile && user.role === 'user')
  if(inCompleteProfile){
    return <EditRoleMobile/>
  }
  }
 

  const plainUser = JSON.parse(JSON.stringify(user))

  return (
    <>
       <HomeWrapper user={plainUser}/>
    </>
  )
}

export default Home
