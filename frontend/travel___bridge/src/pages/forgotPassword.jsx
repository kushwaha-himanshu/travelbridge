import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from 'framer-motion';
import { Shield, Key, Mail, Check, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setIsSubmitted(true);
        } catch (err) {
            console.error("Password reset error:", err);
            let userFriendlyMsg = "Failed to send reset email. Please try again.";
            if (err.code === 'auth/user-not-found') {
                userFriendlyMsg = "No account found with this email address.";
            } else if (err.code === 'auth/invalid-email') {
                userFriendlyMsg = "Please enter a valid email address.";
            }
            setError(userFriendlyMsg);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center relative overflow-hidden px-4 font-sans">
            
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[45%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-[-10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none z-0" />

            {/* Back to Login Link on Top Left */}
            <button
                onClick={() => navigate('/login')}
                className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800/80 px-3.5 py-2 rounded-xl backdrop-blur-md transition-all cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </button>

            {/* Glassmorphic Form Card */}
            <div className="relative w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-[32px] px-6 py-8 sm:px-8 sm:py-10 shadow-2xl z-10 text-left space-y-6">
                
                {!isSubmitted ? (
                    <>
                        {/* Header Section */}
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                <Key className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Reset Password</h2>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                    No worries! Enter your email address below and we'll dispatch a link to recover your account credentials.
                                </p>
                            </div>
                        </div>

                        {/* Reset Form */}
                        <form className="space-y-4" onSubmit={handleResetPassword}>
                            
                            {/* Email Address */}
                            <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled={isLoading}
                                    placeholder="name@domain.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-650 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                    required
                                />
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-400 flex items-center gap-2 leading-relaxed">
                                    <Shield className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-blue-500/10 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 pt-2.5"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Sending Reset Link...
                                    </span>
                                ) : (
                                    <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        {/* Success State */}
                        <div className="space-y-6 text-center">
                            
                            {/* Envelope Icon */}
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-bounce">
                                    <Mail className="w-8 h-8" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-xl font-bold text-white">Check Your Mailbox</h2>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    We have dispatched a password reset link to: <br />
                                    <strong className="text-white block mt-1.5 font-bold text-sm bg-slate-950/65 py-1.5 px-3 rounded-lg border border-slate-850 inline-block">{email}</strong>
                                </p>
                                <p className="text-[10px] text-slate-500 leading-relaxed">
                                    If it doesn't land in a few minutes, click below to reissue the email, or check your spam filter inbox.
                                </p>
                            </div>

                            {/* Resend button */}
                            <button
                                onClick={handleResetPassword}
                                disabled={isLoading}
                                className="w-full border border-slate-800 hover:bg-slate-800/40 text-slate-300 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Resending Link..." : "Resend Link"}
                            </button>
                        </div>
                    </>
                )}

                {/* Redirect back to Login anchor */}
                <div className="text-center pt-2">
                    <button
                        onClick={() => navigate('/login')}
                        disabled={isLoading}
                        className="text-xs text-slate-400 hover:text-slate-200 font-semibold"
                    >
                        ← Back to Login
                    </button>
                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;
