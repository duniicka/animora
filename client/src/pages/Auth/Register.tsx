import React, { useState } from 'react';
import ThreeBackground from '../../components/Background/Background';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from "react-icons/fc";

// --- Configuration and Data ---

const COLORS = {
  primaryTeal: '#009688',
  accentOrange: '#FF8A65',
  backgroundLight: '#F8F9FA',
};

// --- Reusable Components ---

const Logo: React.FC = () => (
  <a href="#" className="flex items-center space-x-2">
    <svg className="w-8 h-8" style={{ color: COLORS.primaryTeal }} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-10v5c0 .552.448 1 1 1s1-.448 1-1v-5c0-.552-.448-1-1-1s-1 .448-1 1zm-3.5 2h7c.276 0 .5.224.5.5s-.224.5-.5.5h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5z" />
    </svg>
    <span className="text-2xl font-extrabold tracking-tight" style={{ color: COLORS.primaryTeal }}>Animora</span>
  </a>
);

// --- Form Components ---

const FormField: React.FC<{ 
  label: string; 
  type: string; 
  name: string;
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}> = ({ label, type, name, value, onChange, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition duration-150"
      style={{ ['--tw-ring-color' as any]: COLORS.primaryTeal, ['--tw-border-color' as any]: COLORS.primaryTeal } as React.CSSProperties}
    />
  </div>
);

const RoleSelector: React.FC<{
  value: string;
  onChange: (role: string) => void;
}> = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      I want to <span className="text-red-500">*</span>
    </label>
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange('client')}
        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
          value === 'client'
            ? 'border-[#009688] bg-[#009688]/10'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex flex-col items-center">
          <svg className="w-8 h-8 mb-2" style={{ color: value === 'client' ? COLORS.primaryTeal : '#666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className={`font-semibold ${value === 'client' ? 'text-[#009688]' : 'text-gray-700'}`}>
            Adopt a Pet
          </span>
          <span className="text-xs text-gray-500 mt-1">Find your companion</span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onChange('owner')}
        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
          value === 'owner'
            ? 'border-[#009688] bg-[#009688]/10'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex flex-col items-center">
          <svg className="w-8 h-8 mb-2" style={{ color: value === 'owner' ? COLORS.primaryTeal : '#666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className={`font-semibold ${value === 'owner' ? 'text-[#009688]' : 'text-gray-700'}`}>
            Rehome a Pet
          </span>
          <span className="text-xs text-gray-500 mt-1">Find them a home</span>
        </div>
      </button>
    </div>
  </div>
);

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'client',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username || !formData.firstName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers and underscores');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          address: formData.address,
          role: formData.role,
        })
      });

      const data = await response.json();
      setLoading(false);

      if (data.success && data.requiresVerification) {
        // Redirect to verification page
        navigate('/auth/verify-email', { state: { email: formData.email } });
      } else if (!data.success) {
        setError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6">
      <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: COLORS.primaryTeal }}>
        Create Account
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <RoleSelector 
        value={formData.role}
        onChange={(role) => setFormData({ ...formData, role })}
      />

      <FormField 
        label="Username" 
        type="text" 
        name="username"
        value={formData.username} 
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField 
          label="First Name" 
          type="text" 
          name="firstName"
          value={formData.firstName} 
          onChange={handleChange}
          required
        />
        <FormField 
          label="Last Name" 
          type="text" 
          name="lastName"
          value={formData.lastName} 
          onChange={handleChange}
        />
      </div>

      <FormField 
        label="Email Address" 
        type="email" 
        name="email"
        value={formData.email} 
        onChange={handleChange}
        required
      />

      <FormField 
        label="Phone Number" 
        type="tel" 
        name="phone"
        value={formData.phone} 
        onChange={handleChange}
      />

      <FormField 
        label="Address" 
        type="text" 
        name="address"
        value={formData.address} 
        onChange={handleChange}
      />

      <FormField 
        label="Password" 
        type="password" 
        name="password"
        value={formData.password} 
        onChange={handleChange}
        required
      />

      <FormField 
        label="Confirm Password" 
        type="password" 
        name="confirmPassword"
        value={formData.confirmPassword} 
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full text-white font-bold py-3 mt-4 rounded-xl shadow-md transition duration-300 transform hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: COLORS.primaryTeal }}
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.location.href = `http://localhost:5000/auth/google`}
        className="flex items-center justify-center w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 transform hover:scale-[1.01] shadow-sm hover:shadow-md"
      >
        <FcGoogle className="mr-3 text-xl" /> 
        <span>Continue with Google</span>
      </button>
    </form>
  );
};

const Register: React.FC = () => {
  return (
    <div className="text-gray-800 relative" style={{ fontFamily: 'Inter, sans-serif' }}>
      <ThreeBackground />

      {/* Content Wrapper */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">

        {/* Main Authentication Card */}
        <div
          className="max-w-2xl w-full mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 transition duration-500"
        >
          <div className="mb-8 flex justify-between items-center">
            <Logo />
            <Link to="/" className="text-gray-500 hover:text-gray-800 transition duration-150">Go to Homepage</Link>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center" style={{ color: COLORS.primaryTeal }}>
            Join Animora Today
          </h2>

          {/* Dynamic Form Display */}
          <div className="max-w-lg mx-auto w-full">
            <RegisterForm />
          </div>

          <p className="block text-center mt-4 text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-[#009688] hover:underline font-medium"
            >
              Log In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
