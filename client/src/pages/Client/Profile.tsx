import React, { useEffect, useState } from 'react';
import ThreeBackground from '../../components/Background/Background';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutModal from '../../components/LogoutModal';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import { API_ENDPOINTS } from '../../config/api';



// --- Configuration and Data ---

const COLORS = {
  primaryTeal: '#009688', // Main teal color
  darkAccentGreen: '#00796B', // Accent color
  backgroundLight: '#F8F9FA', // General page background
  cardBackground: '#FFFFFF', // Card background color
};

type SettingSection = 'account' | 'privacy' | 'language' | 'history';

// Mock Data Types (Minimized for this request)
interface UserActivity { id: number; title: string; date: string; status: 'Completed' | 'InProgress' | 'Pending'; type: 'Adoption' | 'Donation' | 'Volunteer'; icon: string; }

// Mock User Data for Profile Page
const mockUserActivities: UserActivity[] = [
  { id: 1, title: "Adoption Application for Max", date: "2024-10-01", status: "InProgress", type: 'Adoption', icon: 'fas fa-dog' },
  { id: 2, title: "Monthly Shelter Support Donation", date: "2024-09-15", status: "Completed", type: 'Donation', icon: 'fas fa-hand-holding-dollar' },
];

// --- SETTINGS MODULE COMPONENTS ---

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
const AccountSettingsModule: React.FC<{ user: any }> = ({ user }) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>General Account Settings</h2>

    {/* Profile Info Form */}
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4" style={{ borderColor: COLORS.primaryTeal }}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Profile Information</h3>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Username</span>
          <input type="text" value={user?.username || 'N/A'} disabled className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed p-2 border" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Full Name</span>
          <input type="text" defaultValue={user?.name || 'N/A'} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 border" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email Address</span>
          <input type="email" value={user?.email || 'N/A'} disabled className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed p-2 border" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Phone Number</span>
          <input type="tel" defaultValue={user?.phone || 'Not provided'} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 border" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Address</span>
          <input type="text" defaultValue={user?.address || 'Not provided'} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 border" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Account Role</span>
          <input type="text" value={user?.role?.toUpperCase() || 'N/A'} disabled className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed p-2 border" />
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

// Delete Account Modal
const DeleteAccountModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      setConfirmText('');
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const canDelete = confirmText === 'DELETE';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Delete Account
        </h3>

        <p className="text-center text-gray-600 mb-4">
          This action cannot be undone. All your data will be permanently deleted.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-bold text-red-600">DELETE</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
            placeholder="DELETE"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canDelete}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Forever
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Privacy and Security Module (privacy)
const PrivacySecurityModule: React.FC<{ onDeleteAccount: () => void; onChangePassword: () => void }> = ({ onDeleteAccount, onChangePassword }) => (
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
        <button onClick={onChangePassword} className="text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-2 bg-red-500 hover:bg-red-600">
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
      <button onClick={onDeleteAccount} className="text-white font-semibold py-2 px-4 rounded-lg transition duration-200 bg-red-700 hover:bg-red-800">
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

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSettingSection, setActiveSettingSection] = useState<SettingSection>('account');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(API_ENDPOINTS.deleteAccount, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        console.log('Account deleted successfully');
        setShowDeleteModal(false);
        
        // Smooth transition
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await logout();
        navigate('/', { replace: true });
      } else {
        console.error('Failed to delete account:', data.message);
        alert('Failed to delete account: ' + data.message);
      }
    } catch (error) {
      console.error('Delete account error:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const renderSettingModule = () => {
    switch (activeSettingSection) {
      case 'account':
        return <AccountSettingsModule user={user} />;
      case 'privacy':
        return <PrivacySecurityModule onDeleteAccount={() => setShowDeleteModal(true)} onChangePassword={() => setShowChangePasswordModal(true)} />;
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
        return <AccountSettingsModule user={user} />;
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <i className="fas fa-spinner fa-spin text-4xl" style={{ color: COLORS.primaryTeal }}></i>
      </div>
    );
  }

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
            
            {/* Logout Button */}
            <div 
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center space-x-3 p-3 rounded-lg transition duration-200 cursor-pointer text-red-600 hover:bg-red-50 mt-4"
            >
              <i className="fas fa-sign-out-alt w-5 h-5"></i>
              <span className="font-medium">Logout</span>
            </div>
          </div>
        </nav>

        {/* Right Content Area (Dynamic Module) */}
        <div className="lg:w-3/4">
          {renderSettingModule()}
        </div>
      </div>

      {/* Modals */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </main>
  );
};

// --- Main App Component ---

const Profile: React.FC = () => {
  useEffect(() => {
    // Load dependencies
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen font-inter" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>

      <ThreeBackground />
      <ProfilePage />
    </div>
  );
};

export default Profile;