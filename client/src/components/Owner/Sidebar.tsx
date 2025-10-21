import React from 'react';
import {
  PawPrint,
  XCircle,
  Menu,
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  LogOut,
} from 'lucide-react';

export type AppView = 'owner_dashboard' | 'owner_add' | 'owner_pets' | 'owner_edit';

const COLORS = {
  primaryTeal: '#00A896',
  darkAccentGreen: '#027878',
  sidebarBg: '#2C3E50',
  sidebarText: '#ECF0F1',
};

type NavItemProps = {
  view: AppView;
  label: string;
  icon: React.ReactNode;
  isSidebarOpen: boolean;
  navigate: (view: AppView) => void;
  currentView: AppView;
};

const NavItem: React.FC<NavItemProps> = ({
  view,
  label,
  icon,
  isSidebarOpen,
  navigate,
  currentView,
}) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => navigate(view)}
      className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 transform hover:scale-[1.02] ${
        isActive ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
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
    </button>
  );
};

type SidebarProps = {
  currentView: AppView;
  navigate: (view: AppView) => void;
  setIsLoggedIn: (status: boolean) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  ownerId?: string; // optional: if provided, shows in footer
};

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  navigate,
  setIsLoggedIn,
  isSidebarOpen,
  toggleSidebar,
  ownerId,
}) => {
  const sidebarWidth = isSidebarOpen ? 'w-72' : 'w-24';

  return (
    <div
      className={`flex flex-col ${sidebarWidth} h-screen fixed top-0 left-0 p-5 shadow-2xl transition-all duration-300 ease-in-out z-30`}
      style={{ backgroundColor: COLORS.sidebarBg, color: COLORS.sidebarText }}
    >
      {/* Header + Toggle */}
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
          <PawPrint className="text-3xl mr-3" style={{ color: COLORS.primaryTeal }} size={28} />
          <span className="text-2xl font-extrabold text-white whitespace-nowrap">Shelter Admin</span>
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
        <NavItem
          view="owner_dashboard"
          label="Dashboard"
          icon={<LayoutDashboard size={20} />}
          isSidebarOpen={isSidebarOpen}
          navigate={navigate}
          currentView={currentView}
        />
        <NavItem
          view="owner_add"
          label="Add New Pet"
          icon={<PlusCircle size={20} />}
          isSidebarOpen={isSidebarOpen}
          navigate={navigate}
          currentView={currentView}
        />
        <NavItem
          view="owner_pets"
          label="My Shared Pets"
          icon={<ListTodo size={20} />}
          isSidebarOpen={isSidebarOpen}
          navigate={navigate}
          currentView={currentView}
        />
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-gray-700">
        <button
          onClick={() => setIsLoggedIn(false)}
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
    </div>
  );
};

export default Sidebar;
