// import React from 'react'
// import signupImg from '../assets/signup-bg-img.png'
// import { FcGoogle } from "react-icons/fc";
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
//   const navigate = useNavigate();


//   return (
//     <div className='w-full h-screen flex '>
//     {/*left side */}
    
//          <div className='w-[50%] h-screen flex flex-col   bg-cover bg-right bg-no-repeat  '
//          style={{ backgroundImage: `url(${signupImg})` }}> 
          
//          <div className='px-2 py-2'>
//          <h3 className='text-2xl font-semibold text-black py-2 px-2'> 🌐 Travel Bridge</h3><br />
//           <h1 className='text-3xl font-bold text-black px-2'>Create Your Account ✈ </h1>
//           <p className='text-lg text-gray-700 px-2'> join Travel Bridge and explore</p>
//           <p className='text-lg text-gray-700 px-2'> the World without Language Barriers</p>
//           </div> 

//          <div className="px-4 py-4 shadow-lg rounded-2xl bg-white w-[32%] h-320px mt-6 mx-3.5 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg"> 

//   <div className="space-y-2">

//     {/* Real-time translations */}
//     <div className="flex items-start gap-2">

//       <div className="w-5 h-5 rounded-xl bg-blue-100 flex items-center justify-center text-lg shrink-0">
//         🌐
//       </div>

//       <div>

//         <h3 className="text-sm font-semibold text-gray-900">
//           Real-time translations
//         </h3>

//         <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
//           Voice, text & camera translation 
//         </p>

//       </div>

//     </div>

//     {/* Offline support */}
//     <div className="flex items-start gap-2">

//       <div className="w-5 h-5 rounded-xl bg-green-100 flex items-center justify-center text-lg shrink-0">
//         📶
//       </div>

//       <div>

//         <h3 className="text-sm font-semibold text-gray-900">
//           Offline support
//         </h3>

//         <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
//           Use essential phrases without internet
//         </p>

//       </div>

//     </div>

//     {/* Emergency assistance */}
//     <div className="flex items-start gap-2">

//       <div className="w-5 h-5 rounded-xl bg-red-100 flex items-center justify-center text-lg shrink-0">
//         🛡️
//       </div>

//       <div>

//         <h3 className="text-sm font-semibold text-gray-900">
//           Emergency assistance
//         </h3>

//         <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
//           Get help during critical situations
//         </p>

//       </div>

//     </div>

//     {/* 100+ Languages */}
//     <div className="flex items-start gap-2 ">

//       <div className="w-5 h-5 rounded-xl bg-purple-100 flex items-center justify-center text-lg shrink-0">
//         ⭐
//       </div>

//       <div>

//         <h3 className="text-sm font-semibold text-gray-900">
//           100+ Languages
//         </h3>

//         <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
//           Communicate globally 
//         </p>

//       </div>

//     </div>

//   </div>
//   </div>

//   <div className="mt-9 mx-4 w-[50%] h-100px px-2 py-2 text-center text-sm text-gray-500 shadow-sm rounded-lg bg-gray-50">
//     <h3 className="font-medium text-gray-900">
//       Trusted by Travelers Worldwide
//     </h3>
//     <p className="  text-xs text-gray-500">
//      50K+ Travelers ❤️
//     </p>

//   </div>

// </div>

//  {/*right side */}

//   <div className=' w-[50%] justify-center items-center  '>
//     <div className=' flex flex-col justify-center items-center   '>
//       <div className='text-4xl m-2'>👤</div>
//       <h1 className='text-3xl font-bold text-black px-2 '>Sign Up for <span className='text-blue-500'>Travel Bridge</span></h1>
//       <p className='text-sm text-gray-700 px-2'>Create your account to get started</p>


//     </div   >

//     <form className='flex flex-col justify-center items-center mt-4 gap-4 '>
//       <div className='flex gap-8 mx-4'>
//         <div>
//           <label htmlFor="full-name">Full Name</label>
//          <input type="text" placeholder='🙍🏻‍♀️ Enter your Full Name' className='w-70 px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
//         </div>
//         <div>
//           <label htmlFor="email">Email</label>
//           <input type="email" placeholder='✉️ Enter your Email' className='w-70 px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
//         </div>
//       </div>
//      <div className='flex flex-col w-151 mx-1'>
//       <label htmlFor="password">Password</label>
//        <input type="password" placeholder=' 🔒 Create a Strong Password' className='w-151  px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />

//         <label htmlFor="confirm-password">Confirm Password</label>
//        <input type="password" placeholder=' 🔒 Confirm your Password' className='w-151  px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
//      </div>

//      <div className='flex items-center gap-2'>
//         <input type="checkbox" id="terms" className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500' />
//         <label htmlFor="terms" className='text-sm text-gray-500'>I agree to the <span className='text-blue-500'>Terms of Service</span> and <span className='text-blue-500'>Privacy Policy</span></label>
//       </div>
     
//       <button type="submit" className='w-151 m-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300'>Create Account ➜</button>
      
//     {/* OR Sign Up With */}
// <div className="flex items-center gap-3  w-[80%] mx-1">

//   <div className="flex-1 h-[1px] bg-gray-300"></div>

//   <p className="text-xs text-gray-500 font-medium">
//     OR
//   </p>

//   <div className="flex-1 h-[1px] bg-gray-300"></div>

// </div>

   
//       <button type="button" className='w-151 border border-gray-300 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-300'>
//         <FcGoogle size={20} />
//         Sign Up with Google
//       </button>

//       <button onClick={() => navigate('/login')} type="button" className='w-151  text-gray-700  py-2 rounded-lg '>Already have an account? <span className='text-blue-500 hover:text-blue-700'>Log In</span>
//       </button>
      
//     </form>
//   </div>
// </div>

            
        

       
      






import React from 'react'
import signupImg from '../assets/signup-bg-img.png'
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import {
  signInWithPopup
} from "firebase/auth";

import { auth, provider } from "../firebase";


const Signup = () => {

  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [showPassword,setShowPassword]=useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');


 
  

  const handleSignup = async(e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!fullName || !email || !password || !confirmPassword) {
      const errorMessage = "Please fill in all fields";
      console.log(errorMessage);
      setMessage(errorMessage);
      setMessageType('error');
      return;
    }

  console.log(fullName, email, password, confirmPassword);

  if (password !== confirmPassword) {
    const errorMessage = "Passwords do not match";
    console.log(errorMessage);
    setMessage(errorMessage);
    setMessageType('error');
    return;
  }


    if(!checked){
    
      const errorMessage = "Please agree to the terms and conditions";
      console.log(errorMessage);
      setMessage(errorMessage);
      setMessageType('error');
      return;
  }

    const userData ={
      fullname: fullName,
      email,
      password
    } 
    console.log(userData);
    try{
      const res = await axios.post('http://localhost:8000/api/auth/register', userData);
      console.log(res);
      if(res.status === 200){
        console.log("Signup successful");
        setMessage(res.data?.message || 'Signup successful');
        setMessageType('success');
        navigate('/dashboard');
      }

    }
    catch(err){
      
      const apiMessage = err?.response?.data?.message;
      setMessage(apiMessage || "Signup failed. Please try again.");
      setMessageType('error');
      console.log("Signup error:", apiMessage || err.message);
    }


  }

  const handleSignupwithGoogle = async (e) => {
    e.preventDefault();
    // Implement Google Sign-Up logic here
    console.log("Google Sign-Up clicked");

    const res = await signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        alert("Google Sign-Up successful");

        localStorage.setItem("isLoggedIn", true);

        localStorage.setItem("userName", user.displayName);

        localStorage.setItem("userEmail", user.email);

        navigate('/dashboard');

      })
      .catch((error) => {
        console.log(error);
        alert("Google Sign-Up failed. Please try again.");
      });
    
  }
  
 
















  return (




    <div className='w-full min-h-screen flex flex-col lg:flex-row overflow-hidden'>

      {/* LEFT SIDE */}
      <div
        className='w-full lg:w-1/2 min-h-screen flex flex-col bg-cover bg-right bg-no-repeat relative'
        style={{ backgroundImage: `url(${signupImg})` }}
      >

        {/* Heading */}
        <div className='px-4 sm:px-6 py-4'>

          <h3 className='text-2xl font-semibold text-black py-2'>
            🌐 Travel Bridge
          </h3>

          <br />

          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-black'>
            Create Your Account ✈
          </h1>

          <p className='text-lg text-gray-700 mt-3'>
            join Travel Bridge and explore
          </p>

          <p className='text-lg text-gray-700'>
            the World without Language Barriers
          </p>

        </div>

        {/* Feature Card */}
        <div className="px-4 py-4 shadow-lg rounded-2xl bg-white/60 backdrop-blur-md w-[85%] sm:w-[65%] lg:w-[32%] mt-6 mx-4">

          <div className="space-y-4">

            {/* Real-time translations */}
            <div className="flex items-start gap-3">

              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-sm shrink-0">
                🌐
              </div>

              <div>

                <h3 className="text-sm font-semibold text-gray-900">
                  Real-time translations
                </h3>

                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Voice, text & camera translation
                </p>

              </div>

            </div>

            {/* Offline support */}
            <div className="flex items-start gap-3">

              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-sm shrink-0">
                📶
              </div>

              <div>

                <h3 className="text-sm font-semibold text-gray-900">
                  Offline support
                </h3>

                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Use essential phrases without internet
                </p>

              </div>

            </div>

            {/* Emergency assistance */}
            <div className="flex items-start gap-3">

              <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-sm shrink-0">
                🛡️
              </div>

              <div>

                <h3 className="text-sm font-semibold text-gray-900">
                  Emergency assistance
                </h3>

                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Get help during critical situations
                </p>

              </div>

            </div>

            {/* 100+ Languages */}
            <div className="flex items-start gap-3">

              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-sm shrink-0">
                ⭐
              </div>

              <div>

                <h3 className="text-sm font-semibold text-gray-900">
                  100+ Languages
                </h3>

                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Communicate globally
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Trusted Box */}
        <div className="mt-8 mx-4 w-[85%] sm:w-[60%] lg:w-[50%] px-4 py-3 text-center text-sm text-gray-500 shadow-sm rounded-lg bg-gray-50">

          <h3 className="font-medium text-gray-900">
            Trusted by Travelers Worldwide
          </h3>

          <p className="text-xs text-gray-500">
            50K+ Travelers ❤️
          </p>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className='w-full lg:w-1/2 flex justify-center items-center px-4 sm:px-8 py-10 bg-white'>

        <div className='w-full max-w-[700px]'>

          {/* Top Heading */}
          <div className='flex flex-col justify-center items-center'>

            <div className='text-4xl m-2'>
              👤
            </div>

            <h1 className='text-3xl sm:text-4xl font-bold text-black text-center'>
              Sign Up for <span className='text-blue-500'>Travel Bridge</span>
            </h1>

            <p className='text-sm text-gray-700 mt-2 text-center'>
              Create your account to get started
            </p>

          </div>

          {/* FORM */}
          <form className='flex flex-col justify-center items-center mt-6 gap-4 w-full'>

            {/* Name + Email */}
            <div className='flex flex-col lg:flex-row gap-4 w-full'>

              <div className='w-full'>

                <label htmlFor="full-name">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder='🙍🏻‍♀️ Enter your Full Name'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={(e) => setFullName(e.target.value)}
                />

              </div>

              <div className='w-full'>

                <label htmlFor="email">
                  Email
                </label>

                <input
                  type="email"
                  placeholder='✉️ Enter your Email'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

            </div>

            {/* Password */}
          <div className='flex flex-col w-full gap-3'>

  <div className='w-full'>

    <label htmlFor="password">
      Password
    </label>

    <div className='relative'>

      <input
        type={showPassword ? "text" : "password"}
        placeholder=' 🔒 Create a Strong Password'
        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className='absolute right-4 top-3 text-gray-500'
      >

        {showPassword ? "🙈" : "👁️"}

      </button>

    </div>

  </div>



              <div>

                <label htmlFor="confirm-password">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder=' 🔒 Confirm your Password'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                
                />
               

              </div>

            </div>

            {/* Terms */}
            <div className='flex items-start gap-2 w-full'>

              <input
                type="checkbox"
                id="terms"
                className='w-4 h-4 mt-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                
                onChange={(e) => setChecked(!checked)}
              />

              <label htmlFor="terms" className='text-sm text-gray-500'>

                I agree to the
                <span className='text-blue-500'>
                  {" "}Terms of Service{" "}
                </span>

                and

                <span className='text-blue-500'>
                  {" "}Privacy Policy
                </span>

              </label>

            </div>

            {/* Create Account */}
            {message && (
              <p className={`w-full text-sm rounded-lg px-4 py-3 ${messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              className='w-full mt-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300'
              onClick={(e) => {handleSignup(e)}}
            >

              Create Account ➜

            </button>

            {/* OR */}
            <div className="flex items-center gap-3 w-full my-2">

              <div className="flex-1 h-[1px] bg-gray-300"></div>

              <p className="text-xs text-gray-500 font-medium">
                OR
              </p>

              <div className="flex-1 h-[1px] bg-gray-300"></div>

            </div>

            {/* Google Button */}
            <button
              onClick={(e) => handleSignupwithGoogle(e)}
              type="button"
              className='w-full border border-gray-300 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-300'
            >

              <FcGoogle size={22} />

              Sign Up with Google

            </button>

            {/* Login */}
            <button
              onClick={() => navigate('/login')}
              type="button"
              className='text-gray-700 py-2 rounded-lg'
            >

              Already have an account?
              <span className='text-blue-500 hover:text-blue-700'>
                {" "}Log In
              </span>

            </button>

          </form>

        </div>

      </div>

    </div>

  )
}

export default Signup






















    



















