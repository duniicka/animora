import React, { useState } from 'react';
import ThreeBackground from '../../components/Background/Background';
import { Link } from 'react-router';
const COLORS = {
  primaryTeal: '#009688', // Main teal color 
  darkAccentGreen: '#00796B', // Accent color
  backgroundLight: '#F8F9FA', // General page background
  cardBackground: '#FFFFFF', // Card background color
};


// --- Forgot Password Component ---

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!email.includes('@') || email.length < 5) {
            setMessage("Please enter a valid email address.");
            setIsSuccess(false);
            return;
        }

        setMessage(`If ${email} is linked to an account, a password reset link has been sent. Check your inbox!`);
        setIsSuccess(true);
    };

    
    const handleReturnToLogin = () => {
        setEmail('');
        setMessage('');
        setIsSuccess(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" >
            <ThreeBackground />
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl border-t-4" 
                 style={{ borderColor: COLORS.primaryTeal }}>
                
                <h1 className="text-3xl font-extrabold mb-2 text-center" style={{ color: COLORS.darkAccentGreen }}>
                    Reset Password
                </h1>
                
                <p className="text-gray-600 mb-6 text-center">
                    Enter your email address to receive a link for resetting your password.
                </p>

                {isSuccess ? (
                    <div className="text-center bg-teal-50 border-l-4 border-teal-500 text-teal-700 p-4 rounded-lg" role="alert">
                        <p className="font-bold">Check Your Email</p>
                        <p className="text-sm">{message}</p>
                        <button
                            onClick={handleReturnToLogin}
                            className="mt-4 text-sm text-teal-700 font-semibold hover:text-teal-900 underline"
                        >
                            Return to Log In (Mock)
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Email Address</span>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => {setEmail(e.target.value); setMessage('');}}
                                placeholder="name@example.com"
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-3 border" 
                            />
                        </label>
                        
                        <button 
                            type="submit"
                            className="w-full text-white font-bold py-3 rounded-lg shadow-md transition duration-300 hover:opacity-90"
                            style={{ backgroundColor: COLORS.primaryTeal }}
                        >
                            Send Reset Link
                        </button>

                        {message && !isSuccess && (
                            <div className="text-red-600 text-sm text-center font-medium">{message}</div>
                        )}
                        
                        <div className="text-center pt-2">
                            <Link
                                to={"/auth/login"}
                                className="block text-center mt-4 text-sm hover:underline" style={{ color: COLORS.primaryTeal }}
                            >
                                Back to Log In
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
