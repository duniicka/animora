import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LogoutModal from '../LogoutModal';
import {
    PawPrint,
    XCircle,
    Menu,
    LayoutDashboard,
    PlusCircle,
    ListTodo,
    LogOut,
    MessageSquare,
    Link,
    User,
} from 'lucide-react';

export type AppView = 'owner_dashboard' | 'owner_add' | 'owner_pets' | 'owner_edit' | 'owner_chat'; // Chat View tipi əlavə edildi
const Logo: React.FC = () => {
  return (
    <svg
      className="w-8 h-8"
      style={{ color: COLORS.primaryTeal }}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-10v5c0 .552.448 1 1 1s1-.448 1-1v-5c0-.552-.448-1-1-1s-1 .448-1 1zm-3.5 2h7c.276 0 .5.224.5.5s-.224.5-.5.5h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5z" />
    </svg>
  );
};

const COLORS = {
    primaryTeal: '#00A896',
    darkAccentGreen: '#027878',
    sidebarBg: '#2C3E50',
    sidebarText: '#ECF0F1',
};

type SidebarProps = {
    currentView: AppView;
    setIsLoggedIn: (status: boolean) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    ownerId?: string;
};

type NavLinkItemProps = {
    to: string;
    label: string;
    icon: React.ReactNode;
    isSidebarOpen: boolean;
    end?: boolean; 
};

const NavLinkItem: React.FC<NavLinkItemProps> = ({ to, label, icon, isSidebarOpen, end }) => {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center w-full px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 transform hover:scale-[1.02] ${
                    isActive ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`
            }
            title={!isSidebarOpen ? label : undefined}
        >
            <div
                className={`text-lg w-5 text-center flex items-center justify-center ${
                    isSidebarOpen ? 'mr-3' : ''
                }`}
            >
                {icon}
            </div>
            {isSidebarOpen && label}
        </NavLink>
    );
};


const Sidebar: React.FC<SidebarProps> = ({
    setIsLoggedIn,
    isSidebarOpen,
    toggleSidebar,
    ownerId,
}) => {
    const sidebarWidth = isSidebarOpen ? 'w-72' : 'w-24';
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        setIsLoggedIn(false);
        setShowLogoutModal(false);
        navigate('/');
    };

    return (
        <div
            className={`flex flex-col ${sidebarWidth} h-screen fixed top-0 left-0 p-5 shadow-2xl transition-all duration-300 ease-in-out z-30`}
            style={{ backgroundColor: COLORS.sidebarBg, color: COLORS.sidebarText }}
        >
            <div
                className={`flex items-center ${
                    isSidebarOpen ? 'justify-between' : 'justify-center'
                } pb-6 mb-6 border-b border-gray-700`}
            >
                <div
                    className={`flex items-center overflow-hidden transition-opacity duration-300 ${
                        isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 w-0'
                    }`}
                >
                    <Logo />
                    <span className="text-2xl font-extrabold text-white whitespace-nowrap">Animal Owner</span>
                </div>

                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-full hover:bg-gray-700 text-white flex-shrink-0 transition duration-300"
                    title={isSidebarOpen ? 'Collapse panel' : 'Expand panel'}
                >
                    {isSidebarOpen ? <XCircle size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-grow space-y-3">
                <NavLinkItem
                    to="/owner"
                    end 
                    label="Dashboard"
                    icon={<LayoutDashboard size={20} />}
                    isSidebarOpen={isSidebarOpen}
                />
                
                <NavLinkItem
                    to="/owner/chat"
                    label="Inquiries (Chat)"
                    icon={<MessageSquare size={20} />}
                    isSidebarOpen={isSidebarOpen}
                />
                {/* ------------------------------------- */}

                <NavLinkItem
                    to="/owner/add-pet"
                    label="Add New Pet"
                    icon={<PlusCircle size={20} />}
                    isSidebarOpen={isSidebarOpen}
                />
                <NavLinkItem
                    to="/owner/my-pets"
                    label="My Shared Pets"
                    icon={<ListTodo size={20} />}
                    isSidebarOpen={isSidebarOpen}
                />
                <NavLinkItem
                    to="/owner/profile"
                    label="Profile"
                    icon={<User size={20} />}
                    isSidebarOpen={isSidebarOpen}
                />
            </div>

            {/* Footer / Logout */}
            <div className="pt-4 border-t border-gray-700">
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-gray-700 transition duration-150 ${
                        isSidebarOpen ? 'justify-start' : 'justify-center'
                    }`}
                    title={!isSidebarOpen ? 'Log out' : undefined}
                >
                    <div
                        className={`text-lg w-5 text-center flex items-center justify-center ${
                            isSidebarOpen ? 'mr-3' : ''
                        }`}
                    >
                        <LogOut size={20} />
                    </div>
                    {isSidebarOpen && 'Log Out'}
                </button>

                {isSidebarOpen && ownerId && (
                    <p className="text-xs text-gray-400 mt-2 truncate">Owner ID: {ownerId}</p>
                )}
            </div>

            {/* Logout Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />
        </div>
    );
};

export default Sidebar;