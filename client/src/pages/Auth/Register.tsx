import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThreeBackground from '../../components/Background/Background';
const Logo: React.FC = () => (
  <a href="#" className="flex items-center space-x-2">
    <svg className="w-8 h-8" style={{ color: COLORS.primaryTeal }} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-10v5c0 .552.448 1 1 1s1-.448 1-1v-5c0-.552-.448-1-1-1s-1 .448-1 1zm-3.5 2h7c.276 0 .5.224.5.5s-.224.5-.5.5h-7c-.276 0-.5-.224-.5-.5s-.224-.5.5-.5z" />
    </svg>
    <span className="text-2xl font-extrabold tracking-tight" style={{ color: COLORS.primaryTeal }}>Animora</span>
  </a>
);

const SignupForm: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: USER_ROLES.PET_SEEKER,
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      console.error('Passwords do not match.');
      // Show user a message that passwords do not match
      return;
    }
    console.log('Signup Attempt:', form);
    // TODO: Sign-up API call goes here
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6">
      <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: COLORS.darkAccentGreen }}>
        Create Account
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">

        {/* First Name */}
        <InputField label="First Name" name="firstName" type="text" value={form.firstName} onChange={handleChange} />

        {/* Last Name */}
        <InputField label="Last Name" name="lastName" type="text" value={form.lastName} onChange={handleChange} />

        {/* Email - Full Width */}
        <div className="md:col-span-2">
          <InputField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>

        {/* Phone */}
        <InputField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />

        {/* Role Select */}
        <InputField label="Role" name="role" type="select" value={form.role} onChange={handleChange}>
          <select name="role" id="role" value={form.role} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition duration-150" style={{ ['--tw-ring-color' as any]: COLORS.primaryTeal, ['--tw-border-color' as any]: COLORS.primaryTeal } as React.CSSProperties}>
            <option value={USER_ROLES.PET_SEEKER}>Adopt a Pet (Seeker)</option>
            <option value={USER_ROLES.PET_OWNER}>I’m a Pet Owner (Shelter/Rescue)</option>
          </select>
        </InputField>

        {/* Address - Full Width */}
        <div className="md:col-span-2">
          <InputField label="Address" name="address" type="text" value={form.address} onChange={handleChange} />
        </div>

        {/* Password */}
        <InputField label="Create Password" name="password" type="password" value={form.password} onChange={handleChange} />

        {/* Confirm Password */}
        <InputField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />

        {/* Submit Button - Full Width */}
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full text-white font-bold py-3 rounded-xl shadow-md transition duration-300 transform hover:scale-[1.01] hover:shadow-lg"
            style={{ backgroundColor: COLORS.darkAccentGreen }}
          >
            Create Account
          </button>
        </div>

      </div>

      <p className="text-center text-xs text-gray-500 mt-6">
        By registering, you agree to our Terms of Service.
      </p>
    </form>
  );
};

const COLORS = {
  primaryTeal: '#009688', // Main teal color (used for Login)
  darkAccentGreen: '#00796B', // New accent color (used for Sign Up)
  backgroundLight: '#F8F9FA', // General page and 3D floor color
};

// Define roles locally since imports are not allowed in single-file React
const USER_ROLES = {
  PET_SEEKER: 'PET_SEEKER',
  PET_OWNER: 'PET_OWNER'
};

const InputField: React.FC<{ label: string; name: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; required?: boolean; children?: React.ReactNode; }> = ({ label, name, type, value, onChange, required = true, children }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children || (
      <input
        name={name}
        id={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition duration-150"
        style={{ ['--tw-ring-color' as any]: COLORS.primaryTeal, ['--tw-border-color' as any]: COLORS.primaryTeal } as React.CSSProperties}
      />
    )}
  </div>
);

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phone: '', role: USER_ROLES.PET_SEEKER, address: ''
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirmPassword) return setErr('Passwords do not match');
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (res?.success) navigate('/');
    else setErr(res?.error || 'Registration failed');
  };

  return (
    <div className="text-gray-800 relative" style={{ fontFamily: 'Inter, sans-serif' }}>

      <ThreeBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">

        <div
          className="max-w-2xl w-full mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 transition duration-500"
        >
          <div className="mb-8 flex justify-between items-center">
            <Logo />
            <Link to={'/'} className="text-gray-500 hover:text-gray-800 transition duration-150">Go to Homepage</Link>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center" style={{ color: COLORS.primaryTeal }}>
            Start Your Adoption Journey
          </h2>

          {/* Dynamic Form Display. Max-width removed from inner div to utilize max-w-2xl fully for Signup form */}
          <div className="w-full">
            <SignupForm />
          </div>

          {/* Toggle Switch */}
          <p className="block text-center mt-4 text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-[#009688] hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}