import React, { useState } from 'react';
import ThreeBackground from '../../components/Background/Background';
import { Link, useParams, useNavigate } from 'react-router-dom';

const COLORS = {
  primaryTeal: '#009688',
  darkAccentGreen: '#00796B',
};

const Logo: React.FC = () => (
  <a href="#" className="flex items-center space-x-2">
    <svg className="w-8 h-8" style={{ color: COLORS.primaryTeal }} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-10v5c0 .552.448 1 1 1s1-.448 1-1v-5c0-.552-.448-1-1-1s-1 .448-1 1zm-3.5 2h7c.276 0 .5.224.5.5s-.224.5-.5.5h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5z" />
    </svg>
    <span className="text-2xl font-extrabold tracking-tight" style={{ color: COLORS.primaryTeal }}>Animora</span>
  </a>
);

export const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/auth/login'), 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err: any) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-800 relative" style={{ fontFamily: 'Inter, sans-serif' }}>
      <ThreeBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="mb-8 flex justify-between items-center">
            <Logo />
            <Link to="/" className="text-gray-500 hover:text-gray-800 transition duration-150">Go to Homepage</Link>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${COLORS.primaryTeal}20` }}>
                <svg className="w-10 h-10" style={{ color: COLORS.primaryTeal }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold mb-2" style={{ color: COLORS.primaryTeal }}>
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 mb-4">
                Your password has been updated. Redirecting to login...
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-center" style={{ color: COLORS.primaryTeal }}>
                Create New Password
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                Enter your new password below
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition duration-150"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition duration-150"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-bold py-3 rounded-xl shadow-md transition duration-300 transform hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: COLORS.primaryTeal }}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/auth/login"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.primaryTeal }}
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
