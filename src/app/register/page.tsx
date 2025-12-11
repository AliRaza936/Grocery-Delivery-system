"use client"
import RegisterForm from '@/components/RegisterForm'
import Welcome from '@/components/Welcome'
import React, { useState } from 'react'

const Register = () => {
    let [step,setStep] = useState(1)
  return (
    <div>
        {step === 1 ? <Welcome nextStep={setStep}/>:<RegisterForm preStep={setStep}/>}
 
    </div>
  )
}

export default Register
