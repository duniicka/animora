import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getRoleBasedRedirect } from '../../utils/roleRedirect';
import { useAuth } from '../../contexts/AuthContext';
import { API_ENDPOINTS } from '../../config/api';

const COLORS = {
  primaryTeal: '#009688',
};

const GoogleSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'client' | 'owner'>('client');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const token = searchParams.get('token');
      const userStr = searchParams.get('user');
      const isNewUser = searchParams.get('isNewUser') === 'true';

      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          
          // Save to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          // Refresh AuthContext state
          await refreshUser();

          if (isNewUser) {
            // Show modal for new users
            setShowModal(true);
          } else {
            // Existing user - redirect
            const redirectPath = getRoleBasedRedirect(user.role);
            navigate(redirectPath, { replace: true });
          }
        } catch (error) {
          console.error('Failed to parse user data:', error);
          navigate('/auth/login', { replace: true });
        }
      } else {
        navigate('/auth/login', { replace: true });
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, refreshUser]);

  const handleComplete = async () => {
    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers and underscores');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.completeGoogleProfile, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, role })
      });

      const data = await response.json();

      if (data.success) {
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Refresh AuthContext state
        await refreshUser();
        
        // Redirect based on role
        const redirectPath = getRoleBasedRedirect(role);
        navigate(redirectPath, { replace: true });
      } else {
        setError(data.message || 'Failed to complete profile');
      }
    } catch (err: any) {
      setError('Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Signing in with Google...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: COLORS.primaryTeal }}>
          Complete Your Profile
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Just a few more details to get started
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-3 border-2 rounded-lg transition-all ${
                  role === 'client'
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">❤️</div>
                  <div className={`font-semibold text-sm ${role === 'client' ? 'text-teal-600' : 'text-gray-700'}`}>
                    Adopt a Pet
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`p-3 border-2 rounded-lg transition-all ${
                  role === 'owner'
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🏠</div>
                  <div className={`font-semibold text-sm ${role === 'owner' ? 'text-teal-600' : 'text-gray-700'}`}>
                    Rehome a Pet
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose a Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              3+ characters, letters, numbers and underscores only
            </p>
          </div>

          <button
            onClick={handleComplete}
            disabled={loading}
            className="w-full text-white font-bold py-3 rounded-xl shadow-md transition duration-300 transform hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: COLORS.primaryTeal }}
          >
            {loading ? 'Completing...' : 'Complete Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleSuccess;
