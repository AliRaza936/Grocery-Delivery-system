"use client"
import { getSocket } from '@/config/socket'
import React, { useEffect } from 'react'

function GeoUpdater({userId}:{userId:string}) {
    let socket = getSocket()
  
        
        socket.emit('identity',userId)
    
    useEffect(()=>{
        if(!userId)return
            
            const watcher =  navigator.geolocation.watchPosition((pos)=>{
                const lat = pos.coords.latitude
                const lon = pos.coords.longitude
                socket.emit('updateLocation',{
                userId,
                latitude:lat,
                longitude:lon
            })
            },(error)=>{
                    console.log(error)
            },{enableHighAccuracy:true})

        return ()=>navigator.geolocation.clearWatch(watcher)
         
          
    },[userId])
  return null
}

export default GeoUpdater
