import { auth } from '@/auth'
import dbConnect from '@/config/db'
import React from 'react'

const Home = async () => {
  await dbConnect()
  let session  = await auth()
  console.log(session)
  return (
    <div>
      
    </div>
  )
}

export default Home
