import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginImg from '../assets/login-page-img.jpeg'
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import {
  EmailAuthCredential,
  signInWithPopup
} from "firebase/auth";

import { auth, provider } from "../firebase";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
         if(!email || !password ){
            alert("Please enter both email and password.");
            return;
            }

            try{
                 const res=await axios.post('http://localhost:8000/api/auth/login',{
                  email,
                  password
                 },{
                  withCredentials:true
                 });
                  console.log("Login response:", res);
                  // Handle successful login (e.g., store token, redirect)
                  if(res.status===200){
                    alert("Login successful");
                    navigate('/dashboard');
                  }
            }catch(err){
                console.log("Login error:", err);
                alert("Login failed. Please check your credentials and try again.");
            }


    }

     // Implement Google Sign-In logic here
    const handleLoginwithGoogle = async (e) => {
        e.preventDefault();
      try{
        const result = await signInWithPopup(auth, provider);
        const user=result.user;
        if(!user){
          alert("Google Sign-In failed. Please try again.");
          return;
        }
        const email=user.email;
        const fullname=user.displayName;
        const res=await axios.post('http://localhost:8000/api/auth/google',{
          email,
          fullname},{
            withCredentials:true
          });
          console.log("Google Login response:", res);
          if(res.status===200){
            alert("Google Login successful");
            navigate('/dashboard');
          }
      }catch(err){
      throw new Error("Google Sign-In error:",err);
      
      }
    }



  return (
  
   

    <div className='w-full min-h-screen flex flex-col lg:flex-row overflow-hidden'>

      {/* LEFT SIDE */}
      <div
        className='w-full lg:w-1/2 min-h-screen relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50
       shadow-xl rounded-3xl'
      >

        {/* Overlay */}
        <div className='absolute inset-0 bg-white/20 backdrop-blur-[1px]'></div>

        {/* TOP CONTENT */}
        <div className='relative z-10 px-4 sm:px-6 py-6'>

          <h3 className='text-2xl font-semibold text-blue-700 py-2'>
            🌐 Travel Bridge
          </h3>

          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-black mt-8'>
            Welcome Back !
          </h1>

          <h1 className='text-gray-700 text-2xl sm:text-3xl mt-2'>
            Lets Break the Language
          </h1>

          <span className='text-blue-500 text-3xl font-semibold'>
            Barrier.
          </span>

          <p className='text-lg text-gray-700 mt-5 max-w-xl'>
            Login to your account and continue exploring the world with Travel Bridge.
          </p>

        </div>

        {/* IMAGE SECTION */}
        <div
          className='relative z-10 w-full h-[65vh] lg:h-[70vh] flex items-end justify-center px-4 sm:px-6 py-8 overflow-hidden bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: `url(${loginImg})`,
          }}
        >

          {/* Light Overlay */}
          <div className='absolute inset-0 bg-white/10'></div>

          {/* Feature Card */}
          <div className="relative z-10 px-5 py-5 shadow-xl rounded-3xl bg-white/75 backdrop-blur-md w-full max-w-4xl mb-4">

            <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 lg:gap-6">

              {/* Real-time translations */}
              <div className="flex items-center gap-3 min-w-[180px]">

                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  🌐
                </div>

                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                  Real-time translations
                </h3>

              </div>

              {/* Offline support */}
              <div className="flex items-center gap-3 min-w-[180px]">

                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  📶
                </div>

                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                  Offline support
                </h3>

              </div>

              {/* Emergency assistance */}
              <div className="flex items-center gap-3 min-w-[180px]">

                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                  🛡️
                </div>

                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                  Emergency assistance
                </h3>

              </div>

              {/* 100+ Languages */}
              <div className="flex items-center gap-3 min-w-[180px]">

                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                  ⭐
                </div>

                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                  100+ Languages
                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className='w-full  lg:w-1/2 min-h-screen flex justify-center items-center px-4 sm:px-8 py-8 bg-white shadow-xl rounded-3xl'>

        <div className='w-full max-w-[700px]   px-4 sm:px-8 py-8  bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-lg'>

          {/* Heading */}
          <div className='flex flex-col justify-center items-center'>

            <div className='text-5xl mb-4'>
              👤
            </div>

            <h1 className='text-3xl sm:text-4xl font-bold text-black text-center'>
              Log In to <span className='text-blue-500'>Travel Bridge</span>
            </h1>

            <p className='text-sm text-gray-700 mt-2 text-center'>
              Access your Account and continue exploring
            </p>

          </div>

          {/* FORM */}
          <form className='flex flex-col mt-8 gap-5 w-full'>

            {/* Email */}
            <div>

              <label htmlFor="email">
                Email
              </label>

              <input
                type="email"
                placeholder='✉️ Enter your Email'
                className='w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

            {/* Password */}
            <div>

              <label htmlFor="password">
                Password
              </label>

              <div className='relative mt-2'>

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder=' 🔒 Enter your Password'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className='absolute right-4 top-3 text-gray-500'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🔒' : '👁️'}
                </button>

              </div>

            </div>

            {/* Remember + Forgot */}
            <div className='flex items-center justify-between flex-wrap gap-3'>

              <div className='flex items-center gap-2'>

                <input
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  type="checkbox"
                  className='w-4 h-4'
                />

                <label className='text-sm text-gray-600'>
                  Remember Me
                </label>

              </div>

              <button
                onClick={() => navigate('/forgot-password')}
                type="button"
                className='text-sm text-blue-500 hover:text-blue-700'
              >
                Forgot Password?
              </button>

            </div>

            {/* Button */}
            <button
              type="submit"
              className='w-full mt-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300'
              onClick={(e) => handleLogin(e)}
            >

              Login ➜

            </button>

            {/* OR */}
            <div className="flex items-center gap-3 w-full my-2">

              <div className="flex-1 h-[1px] bg-gray-300"></div>

              <p className="text-xs text-gray-500 font-medium">
                OR
              </p>

              <div className="flex-1 h-[1px] bg-gray-300"></div>

            </div>

            {/* Google */}
            <button
              onClick={(e) => handleLoginwithGoogle(e)}
              type="button"              
              className='w-full border border-gray-300 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-300'
            >

              <FcGoogle size={22} />

              Login with Google

            </button>

            {/* Signup */}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className='w-full text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2'
            >

              If not Registered,
              <span className='text-blue-500'>
                Sign Up Here
              </span>

            </button>

          </form>

        </div>

      </div>

    </div>

  )
}

export default Login