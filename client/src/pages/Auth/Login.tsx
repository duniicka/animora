import React, { useRef, useEffect, useState } from 'react';
import ThreeBackground from '../../components/Background/Background';
import { Link } from 'react-router';
// Declaration for THREE.js global object access (for TypeScript)
declare global {
  interface Window {
    THREE: any;
  }
}

// --- Configuration and Data ---

const COLORS = {
  primaryTeal: '#009688',
  accentOrange: '#FF8A65',
  backgroundLight: '#F8F9FA', // General page and 3D floor color
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

const FormField: React.FC<{ label: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, type, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition duration-150"
      style={{ ['--tw-ring-color' as any]: COLORS.primaryTeal, ['--tw-border-color' as any]: COLORS.primaryTeal } as React.CSSProperties}
    />
  </div>
);

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login Attempt:', { email, password });
    // TODO: Login API call goes here
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6">
      <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: COLORS.primaryTeal }}>
        Log In
      </h3>
      <FormField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <FormField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button
        type="submit"
        className="w-full text-white font-bold py-3 mt-4 rounded-xl shadow-md transition duration-300 transform hover:scale-[1.01] hover:shadow-lg"
        style={{ backgroundColor: COLORS.primaryTeal }}
      >
        Log In
      </button>

      <Link to={"/auth/forgot-password"} className="block text-center mt-4 text-sm hover:underline" style={{ color: COLORS.primaryTeal }}>
      Forgot Password?</Link>
    </form>
  );
};



// --- Main App Component ---

const App: React.FC = () => {
  // State to manage which view is active: true for Login, false for Sign-up
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="text-gray-800 relative" style={{ fontFamily: 'Inter, sans-serif' }}>
      <ThreeBackground />

      {/* Content Wrapper: Ensures content stays above 3D background and is centered */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">

        {/* Main Authentication Card */}
        <div
          className="max-w-xl w-full mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 transition duration-500"
        >
          <div className="mb-8 flex justify-between items-center">
            <Logo />
            <Link to="/" className="text-gray-500 hover:text-gray-800 transition duration-150">Go to Homepage</Link>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center" style={{ color: COLORS.primaryTeal }}>
             Welcome Back to Animora
          </h2>

          {/* Dynamic Form Display */}
          <div className="max-w-md mx-auto w-full">
            <LoginForm />
          </div>

          <p className="block text-center mt-4 text-sm text-gray-500">
            Don't have an account yet?{" "}
            <Link
              to="/auth/register"
              className="text-[#009688] hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default App;
