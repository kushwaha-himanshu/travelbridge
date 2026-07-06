import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Globe, Languages, Mic, Camera, Shield, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

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
        <div className="w-full min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col lg:flex-row overflow-hidden relative font-sans">
            
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none z-0" />

            {/* Back to Home Link */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800/80 px-3.5 py-2 rounded-xl backdrop-blur-md transition-all cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>

            {/* LEFT SIDE: Brand Showcase */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative z-10 border-b lg:border-b-0 lg:border-r border-slate-850 bg-slate-900/10 backdrop-blur-xs">
                
                {/* Brand Header */}
                <div className="flex items-center gap-2.5 pt-12 lg:pt-0">
                    <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl">
                        <Globe className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">TravelBridge</span>
                </div>

                {/* Main Headline */}
                <div className="space-y-6 max-w-lg my-12 lg:my-0 text-left">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" /> Break Language Barriers
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                        Welcome Back! <br />
                        Let’s Travel <br className="hidden lg:inline" />
                        Without{' '}
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                            Barriers.
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Sign in to manage your AI itineraries, access offline dictionaries, and scan menus in real time.
                    </p>

                    {/* Compact features board */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/80">
                        <div className="flex gap-2">
                            <Languages className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-white">Text translation</p>
                                <p className="text-[10px] text-slate-500">100+ languages</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Mic className="w-4.5 h-4.5 text-sky-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-white">Voice translation</p>
                                <p className="text-[10px] text-slate-500">Bi-directional conversation</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Camera className="w-4.5 h-4.5 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-white">Camera Scanner</p>
                                <p className="text-[10px] text-slate-500">Instant menu OCR</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Shield className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-white">SOS Assistance</p>
                                <p className="text-[10px] text-slate-500">Offline local support</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer text */}
                <p className="text-[10px] text-slate-500 text-left">
                    © {new Date().getFullYear()} TravelBridge Inc. Trusted by 50,000+ travelers globally.
                </p>
            </div>

            {/* RIGHT SIDE: Glassmorphic Login Form */}
            <div className="w-full lg:w-1/2 flex justify-center items-center p-8 sm:p-12 relative z-10">
                <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between text-left space-y-6">
                    
                    <div>
                        <h2 className="text-xl font-bold text-white">Sign In</h2>
                        <p className="text-xs text-slate-500 mt-1">Enter your details to log in to TravelBridge.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        
                        {/* Email Input */}
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                disabled={authLoading || googleLoading}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@domain.com"
                                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-650 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-[10px] font-semibold text-blue-400 hover:text-blue-300"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    disabled={authLoading || googleLoading}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-650 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-50 pr-11"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="text-xs text-slate-400 select-none">Remember my email</label>
                        </div>

                        {/* Error message */}
                        {validationError && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-400 flex items-center gap-2 leading-relaxed">
                                <Shield className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                                <span>{validationError}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={authLoading || googleLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-blue-500/10 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {authLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing In...
                                </span>
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    {/* OR Separator */}
                    <div className="flex items-center gap-3 w-full my-2.5">
                        <div className="flex-1 h-[1px] bg-slate-800" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">OR</span>
                        <div className="flex-1 h-[1px] bg-slate-800" />
                    </div>

                    {/* Google Log in */}
                    <button
                        onClick={handleLoginwithGoogle}
                        disabled={authLoading || googleLoading}
                        className="w-full border border-slate-850 hover:bg-slate-800/40 text-slate-300 font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        {googleLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Connecting...
                            </span>
                        ) : (
                            <>
                                <FcGoogle className="w-4.5 h-4.5" />
                                <span>Sign In with Google</span>
                            </>
                        )}
                    </button>

                    {/* Signup link */}
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-xs text-slate-400 hover:text-slate-200 self-center"
                    >
                        New to TravelBridge? <span className="text-blue-400 font-bold hover:underline">Create Account</span>
                    </button>

                </div>
            </div>

        </div>
    );
};

export default Login;