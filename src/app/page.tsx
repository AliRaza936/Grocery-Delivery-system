import { auth } from '@/auth'
import EditRoleMobile from '@/components/EditRoleMobile'
import dbConnect from '@/config/db'
import User from '@/models/user.model'
import { redirect } from 'next/navigation'
import React from 'react'


const Home = async () => {
  await dbConnect()
  let session  = await auth()
  const user =  await User.findById(session?.user?.id)
  console.log(user)
  if(!user){
   redirect('/login')
  }
  const inCompleteProfile = !user?.mobile || !user?.role || (!user.mobile && user.role === 'user')
  if(inCompleteProfile){
    return <EditRoleMobile/>
  }

  return (
    <div>
      
    </div>
  )
}

export default Home
