import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginImg from '../assets/login-page-img.jpeg'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login, loginWithGoogle, authLoading } = useAuth();
    const [email, setEmail] = useState(() => {
        return localStorage.getItem('travelbridge-remember-email') || '';
    });
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(() => {
        return !!localStorage.getItem('travelbridge-remember-email');
    });
    const [validationError, setValidationError] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setValidationError('');

        if (!email || !password) {
            setValidationError("Please enter both email and password.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setValidationError("Please enter a valid email address.");
            return;
        }

        const res = await login(email, password, rememberMe);
        if (res?.success) {
            navigate('/dashboard');
        } else if (res?.error) {
            setValidationError(res.error);
        }
    }

    const handleLoginwithGoogle = async (e) => {
        e.preventDefault();
        setGoogleLoading(true);
        setValidationError('');
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (!user) {
                setValidationError("Google Sign-In failed. No user info retrieved.");
                setGoogleLoading(false);
                return;
            }
            const email = user.email;
            const fullname = user.displayName;
            const res = await loginWithGoogle(fullname, email);
            if (res?.success) {
                navigate('/dashboard');
            } else if (res?.error) {
                setValidationError(res.error);
            }
        } catch (err) {
            console.error("Google Sign-In error:", err);
            let userFriendlyMsg = "Google Sign-In failed. Please try again.";
            if (err.code === 'auth/popup-closed-by-user') {
                userFriendlyMsg = "Login popup closed. Please try again.";
            } else if (err.code === 'auth/network-request-failed') {
                userFriendlyMsg = "Network error. Please check your internet connection.";
            }
            setValidationError(userFriendlyMsg);
        } finally {
            setGoogleLoading(false);
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

              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                disabled={authLoading || googleLoading}
                placeholder="Enter your Email"
                className='w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

            {/* Password */}
            <div>

              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>

              <div className='relative mt-2'>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  disabled={authLoading || googleLoading}
                  placeholder="Enter your Password"
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  disabled={authLoading || googleLoading}
                  className='absolute right-4 top-3 text-gray-500 disabled:opacity-50'
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
                  disabled={authLoading || googleLoading}
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
                disabled={authLoading || googleLoading}
                className='text-sm text-blue-500 hover:text-blue-700 disabled:opacity-50'
              >
                Forgot Password?
              </button>

            </div>

            {/* Validation Error */}
            {validationError && (
              <p className="text-xs text-rose-500 font-semibold bg-rose-50 border border-rose-100 rounded-lg px-3.5 py-2">
                ⚠️ {validationError}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={authLoading || googleLoading}
              className='w-full mt-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center'
              onClick={(e) => handleLogin(e)}
            >
              {authLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login ➜"
              )}
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
              disabled={authLoading || googleLoading}
              className='w-full border border-gray-300 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50'
            >
              {googleLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connecting...
                </span>
              ) : (
                <>
                  <FcGoogle size={22} />
                  Login with Google
                </>
              )}
            </button>

            {/* Signup */}
            <button
              type="button"
              disabled={authLoading || googleLoading}
              onClick={() => navigate('/signup')}
              className='w-full text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50'
            >
              If not Registered, <span className='text-blue-500'>Sign Up Here</span>
            </button>

          </form>

        </div>

      </div>

    </div>

  )
}

export default Login