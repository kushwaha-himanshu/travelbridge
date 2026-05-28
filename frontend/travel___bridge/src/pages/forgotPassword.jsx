import React from 'react'
import { useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../firebase";

import { useState } from "react";

const ForgotPassword = () => {
     
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleResetPassword = async (e) => {
        // Implement password reset logic here
        e.preventDefault();

        if(!email){
            alert("Please enter your email address.");
            return;
        }
         try {

    await sendPasswordResetEmail(auth, email);

    alert("Password reset email sent!");

  }
  catch(error) {

    console.log(error);

    alert(error.message);
    }
}

  return (

    <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-200 px-4'>

      {/* Card */}
      <div className='w-full max-w-md bg-white shadow-2xl rounded-3xl px-8 py-10 border border-gray-100'>

        {/* Top Icon */}
        <div className='flex justify-center'>

          <div className='w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl shadow-md'>
            🔒
          </div>

        </div>

        {/* Heading */}
        <div className='text-center mt-6'>

          <h2 className='text-3xl font-bold text-gray-900'>
            Forgot Password
          </h2>

          <p className='text-gray-500 mt-3 leading-relaxed'>
            Enter your email address to reset your password.
          </p>

        </div>

        {/* Form */}
        <form className='mt-8 flex flex-col gap-5'>

          {/* Email Input */}
          <div>

            <label className='text-sm font-medium text-gray-700'>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              placeholder='✉️ Enter your Email'
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            />

          </div>

          {/* Reset Button */}
          <button
            onClick={(e) => handleResetPassword(e)}

            type="submit"
            className='w-full mt-2 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg'
          >

            Reset Password ➜

          </button>

        </form>

        {/* Back to Login */}
        <div className='text-center mt-6'>

          <button
           onClick={()=> navigate('/login')}
           className='text-blue-500 hover:text-blue-700 text-sm font-medium transition'>

            ← Back to Login

          </button>

        </div>

      </div>

    </div>

  )
}

export default ForgotPassword
