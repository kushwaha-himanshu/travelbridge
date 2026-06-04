import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

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
        <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-200 px-4'>
            {/* Card */}
            <div className='w-full max-w-md bg-white shadow-2xl rounded-3xl px-8 py-10 border border-gray-100 transition-all duration-300'>
                
                {!isSubmitted ? (
                    <>
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
                            <p className='text-gray-500 mt-3 leading-relaxed text-sm'>
                                Enter your email address to reset your password.
                            </p>
                        </div>

                        {/* Form */}
                        <form className='mt-8 flex flex-col gap-5' onSubmit={handleResetPassword}>
                            {/* Email Input */}
                            <div>
                                <label className='text-sm font-medium text-gray-700'>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled={isLoading}
                                    placeholder="Enter your Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='w-full px-4 py-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition'
                                />
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <p className="text-xs text-rose-500 font-semibold bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                                    ⚠️ {error}
                                </p>
                            )}

                            {/* Reset Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className='w-full mt-2 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center'
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    "Reset Password ➜"
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        {/* Success State Card */}
                        <div className='flex justify-center'>
                            <div className='w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl shadow-md text-emerald-600 animate-bounce'>
                                ✉️
                            </div>
                        </div>

                        <div className='text-center mt-6'>
                            <h2 className='text-3xl font-bold text-gray-900'>
                                Check Your Email
                            </h2>
                            <p className='text-gray-600 mt-4 leading-relaxed text-sm'>
                                We have sent a password reset link to <strong className="text-slate-900">{email}</strong>.
                            </p>
                            <p className='text-gray-500 mt-2 text-xs leading-relaxed'>
                                Please click the link in the email to set a new password. If you don't see it, check your spam folder.
                            </p>
                        </div>

                        <button
                            onClick={handleResetPassword}
                            disabled={isLoading}
                            className='w-full mt-8 border border-slate-200 text-slate-700 py-3 rounded-xl hover:bg-slate-50 transition-all duration-300 font-semibold text-sm flex items-center justify-center disabled:opacity-50'
                        >
                            {isLoading ? "Resending..." : "Resend Email"}
                        </button>
                    </>
                )}

                {/* Back to Login */}
                <div className='text-center mt-6'>
                    <button
                        onClick={() => navigate('/login')}
                        disabled={isLoading}
                        className='text-blue-500 hover:text-blue-700 text-sm font-semibold transition disabled:opacity-50'
                    >
                        ← Back to Login
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ForgotPassword
