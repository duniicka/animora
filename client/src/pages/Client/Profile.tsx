import React, { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken,
  signOut
} from 'firebase/auth';
import ThreeBackground from '../../components/Background/Background';
import { auth } from '../../lib/firebase';

// Declaration for THREE.js global object access (for TypeScript)
declare global {
  interface Window {
    THREE: any;
  }
}

// Global Variables (Mandatory for Canvas Environment)
const initialAuthToken =
  typeof window !== 'undefined' && (window as any).__initial_auth_token !== undefined
    ? (window as any).__initial_auth_token
    : null;

// --- Configuration and Data ---

const COLORS = {
  primaryTeal: '#009688', // Main teal color
  darkAccentGreen: '#00796B', // Accent color
  backgroundLight: '#F8F9FA', // General page background
  cardBackground: '#FFFFFF', // Card background color
};

type Page = 'pets' | 'adoption' | 'about' | 'profile' | 'login';
type SettingSection = 'account' | 'privacy' | 'language' | 'history';

// Mock Data Types (Minimized for this request)
interface UserActivity { id: number; title: string; date: string; status: 'Completed' | 'InProgress' | 'Pending'; type: 'Adoption' | 'Donation' | 'Volunteer'; icon: string; }

// Mock User Data for Profile Page
const mockUserActivities: UserActivity[] = [
  { id: 1, title: "Adoption Application for Max", date: "2024-10-01", status: "InProgress", type: 'Adoption', icon: 'fas fa-dog' },
  { id: 2, title: "Monthly Shelter Support Donation", date: "2024-09-15", status: "Completed", type: 'Donation', icon: 'fas fa-hand-holding-dollar' },
];

// --- Reusable Components ---

const Logo: React.FC = () => (
  <a href="#" className="flex items-center space-x-2">
    <svg className="w-8 h-8" style={{ color: COLORS.primaryTeal }} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11 20.85c-1.5-.7-2.6-1.5-3.6-2.5a6.5 6.5 0 0 1-1.3-1.6 4.3 4.3 0 0 1-.7-1.4c-.2-.6-.3-1.3-.3-2a4.4 4.4 0 0 1 1-3.2 5 5 0 0 1 3.5-1.5c.6 0 1.2.1 1.8.3.6.2 1.1.5 1.6.8a5 5 0 0 1 1.6-1.6c.5-.3 1.1-.6 1.7-.8.6-.2 1.2-.3 1.8-.3a5 5 0 0 1 3.5 1.5 4.4 4.4 0 0 1 1 3.2c0 .7-.1 1.4-.3 2a6.5 6.5 0 0 1-1.3 1.6c-1 .9-2.1 1.8-3.6 2.5a3.8 3.8 0 0 1-3.5 0zM12 2a4 4 0 0 1 4 4c0 1.6-1.4 3-4 3S8 7.6 8 6a4 4 0 0 1 4-4z" />
    </svg>
    <span className="text-2xl font-extrabold tracking-tight" style={{ color: COLORS.primaryTeal }}>Paws & Purpose</span>
  </a>
);

// --- SETTINGS MODULE COMPONENTS (New) ---

const SettingToggle: React.FC<{ label: string, description: string, defaultChecked: boolean }> = ({ label, description, defaultChecked }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);
  return (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col pr-4">
        <span className="text-md font-medium text-gray-800">{label}</span>
        <span className="text-sm text-gray-500">{description}</span>
      </div>
      <label className="inline-flex items-center cursor-pointer ml-4">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          className="form-checkbox h-5 w-5 text-teal-600"
        />
      </label>
    </div>
  );
};

// 1. General Account Settings (settings)
const AccountSettingsModule: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>General Account Settings</h2>

    {/* Profile Info Form */}
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4" style={{ borderColor: COLORS.primaryTeal }}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Profile Information</h3>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Full Name</span>
          <input type="text" defaultValue="Guest User" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 border" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email Address</span>
          <input type="email" defaultValue="anon.user@paws.az" disabled className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed p-2 border" />
        </label>
        <button className="text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-2 hover:opacity-90" style={{ backgroundColor: COLORS.primaryTeal }}>
          Save Changes
        </button>
      </div>
    </div>

    {/* Notifications */}
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4" style={{ borderColor: COLORS.primaryTeal }}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Notification Preferences</h3>
      <div className="space-y-2">
        <SettingToggle label="Email Updates" description="Receive news and site updates via email." defaultChecked={true} />
        <SettingToggle label="Activity Alerts" description="Get instant alerts for pet adoption status changes." defaultChecked={true} />
        <SettingToggle label="Newsletter" description="Receive our monthly animal welfare newsletter." defaultChecked={false} />
      </div>
    </div>
  </div>
);

// 2. Privacy and Security Module (privacy)
const PrivacySecurityModule: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>Privacy and Security</h2>

    {/* Security Features */}
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4" style={{ borderColor: COLORS.primaryTeal }}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Account Security</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-medium text-gray-700">Two-Factor Authentication (2FA)</span>
          <span className="text-red-500 font-semibold">Disabled</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-medium text-gray-700">Recent Logins</span>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View Activity Log</button>
        </div>
        <button className="text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-2 bg-red-500 hover:bg-red-600">
          Change Password
        </button>
      </div>
    </div>

    {/* Data & Sharing */}
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4" style={{ borderColor: COLORS.primaryTeal }}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Data & Sharing</h3>
      <div className="space-y-2">
        <SettingToggle label="Allow Data Sharing" description="Share anonymized data to improve pet matching algorithms." defaultChecked={false} />
        <SettingToggle label="Public Profile" description="Allow other users to view your public profile (e.g., number of adoptions)." defaultChecked={true} />
      </div>
    </div>

    {/* Delete Account */}
    <div className="bg-red-50 p-6 rounded-xl shadow-lg border-l-4 border-red-500">
      <h3 className="text-xl font-semibold mb-2 text-red-700">Danger Zone</h3>
      <p className="text-sm text-red-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
      <button className="text-white font-semibold py-2 px-4 rounded-lg transition duration-200 bg-red-700 hover:bg-red-800">
        Delete Account
      </button>
    </div>
  </div>
);

// 3. Language and Region Module (language)
const LanguageRegionModule: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>Language & Region</h2>

    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4" style={{ borderColor: COLORS.primaryTeal }}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Localization Settings</h3>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Display Language</span>
          <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 border">
            <option>English (US)</option>
            <option>Azerbaijani (AZ)</option>
            <option>Turkish (TR)</option>
            <option>Russian (RU)</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Time Zone</span>
          <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 border">
            <option>UTC+4 (Baku, Azerbaijan)</option>
            <option>UTC+3 (Istanbul, Turkey)</option>
            <option>UTC+1 (London, UK)</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Preferred Currency</span>
          <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 border">
            <option>AZN - Azerbaijani Manat</option>
            <option>USD - US Dollar</option>
            <option>EUR - Euro</option>
          </select>
        </label>

        <button className="text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-2 hover:opacity-90" style={{ backgroundColor: COLORS.primaryTeal }}>
          Update Preferences
        </button>
      </div>
    </div>
  </div>
);

const SettingSidebarLink: React.FC<{
  section: SettingSection,
  activeSection: SettingSection,
  setActiveSection: (section: SettingSection) => void,
  icon: string,
  label: string
}> = ({ section, activeSection, setActiveSection, icon, label }) => {
  const isActive = activeSection === section;
  const baseClasses = "flex items-center space-x-3 p-3 rounded-lg transition duration-200 cursor-pointer";
  const activeClasses = "text-white font-bold shadow-md";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-800";

  return (
    <div
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      style={{ backgroundColor: isActive ? COLORS.primaryTeal : COLORS.cardBackground }}
      onClick={() => setActiveSection(section)}
    >
      <i className={`${icon} w-5 h-5`}></i>
      <span className="font-medium">{label}</span>
    </div>
  );
};

const ProfilePage: React.FC<{ userId: string | null, auth: any, setPage: (page: Page) => void }> = ({ userId, auth, setPage }) => {
  const [activeSettingSection, setActiveSettingSection] = useState<SettingSection>('account');
  const [userName] = useState("Guest User");
  const [userEmail] = useState("anon.user@paws.az");

  const handleSignOut = async () => {
    if (auth) {
      try {
        await signOut(auth);
        console.log("User successfully signed out.");
        setPage('pets');
      } catch (error) {
        console.error("Sign out error:", error);
      }
    }
  };

  const isAnonymous = !userId || (auth?.currentUser?.isAnonymous ?? true);

  const renderSettingModule = () => {
    switch (activeSettingSection) {
      case 'account':
        return <AccountSettingsModule />;
      case 'privacy':
        return <PrivacySecurityModule />;
      case 'language':
        return <LanguageRegionModule />;
      case 'history':
        return (
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4" style={{ borderColor: COLORS.primaryTeal }}>
            <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>Activity History</h2>
            <p className="text-gray-600 mb-6">Review your past adoptions, donations, and volunteer activities.</p>
            <div className="space-y-4">
              {mockUserActivities.map(activity => (
                <div key={activity.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">{activity.title}</span>
                  <span className={`text-sm font-semibold ${activity.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>{activity.status}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">This section is for detailed logs and historical data.</p>
          </div>
        );
      default:
        return <AccountSettingsModule />;
    }
  };

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Settings Layout: Sidebar + Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar (Settings Navigation) */}
        <nav className="lg:w-1/4">
          <div className="bg-white p-4 rounded-xl shadow-xl space-y-1 sticky top-4">
            <h3 className="text-lg font-bold mb-2 p-2" style={{ color: COLORS.darkAccentGreen }}>My Settings</h3>
            <SettingSidebarLink
              section="account"
              activeSection={activeSettingSection}
              setActiveSection={setActiveSettingSection}
              icon="fas fa-user-circle"
              label="Account Information"
            />
            <SettingSidebarLink
              section="privacy"
              activeSection={activeSettingSection}
              setActiveSection={setActiveSettingSection}
              icon="fas fa-lock"
              label="Privacy & Security"
            />
            <SettingSidebarLink
              section="language"
              activeSection={activeSettingSection}
              setActiveSection={setActiveSettingSection}
              icon="fas fa-language"
              label="Language & Region"
            />
            <SettingSidebarLink
              section="history"
              activeSection={activeSettingSection}
              setActiveSection={setActiveSettingSection}
              icon="fas fa-history"
              label="Activity History"
            />
          </div>
        </nav>

        {/* Right Content Area (Dynamic Module) */}
        <div className="lg:w-3/4">
          {renderSettingModule()}
        </div>
      </div>
    </main>
  );
};

// --- Main App Component (Firebase logic fixed) ---

const Profile: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('profile');
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Load dependencies
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    document.head.appendChild(script);

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(auth, initialAuthToken);
            } else {
              await signInAnonymously(auth);
            }
          } catch (error) {
            console.error("Authentication failed during startup:", error);
          }
        }
        setIsAuthReady(true);
      });

      return () => {
        unsubscribe();
        document.head.removeChild(link);
        document.head.removeChild(script);
      };
    } catch (error) {
      console.error("Firebase initialization failed:", error);
    }
  }, []);

  const handleAuthClick = () => {
    if (isAuthReady) {
      setCurrentPage('profile');
    } else {
      setCurrentPage('login');
    }
  };

  const renderPage = () => {
    if (!isAuthReady) {
      return (
        <main className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-center">
          <i className="fas fa-spinner fa-spin text-4xl mb-4" style={{ color: COLORS.primaryTeal }}></i>
          <h2 className="text-xl font-semibold text-gray-700">Loading Application...</h2>
        </main>
      );
    }

    switch (currentPage) {
      case 'profile':
        return <ProfilePage userId={userId} auth={auth} setPage={setCurrentPage} />;
      // Other pages remain as placeholders for navigation context
      case 'pets':
        return <div className="p-10 text-center relative z-10"><h1 className="text-3xl font-bold">Pets Listing Page</h1><p>Navigate to Profile to see the new dashboard.</p></div>;
      case 'adoption':
        return <div className="p-10 text-center relative z-10"><h1 className="text-3xl font-bold">Adoption Process Page</h1><p>Navigate to Profile to see the new dashboard.</p></div>;
      case 'about':
        return <div className="p-10 text-center relative z-10"><h1 className="text-3xl font-bold">About Us Page</h1><p>Navigate to Profile to see the new dashboard.</p></div>;
      case 'login':
        return <div className="p-10 text-center relative z-10"><h1 className="text-3xl font-bold">Login Page</h1><p>Navigate to Profile to see the new dashboard.</p></div>;
      default:
        return <ProfilePage userId={userId} auth={auth} setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen font-inter" style={{ }}>
      {/* Load Tailwind and Inter Font */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>

      <ThreeBackground />
      {renderPage()}
    </div>
  );
};

export default Profile;
