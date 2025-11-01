import Sidebar from "../../components/Admin/Sidebar";
import { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(v => !v), []);
  const setIsLoggedInHandler = useCallback((value: boolean) => setIsLoggedIn(value), []);

  return (
    <>
      <Sidebar
        currentView={currentView as any}
        setIsLoggedIn={setIsLoggedInHandler}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div
        className={`flex-grow p-10 transition-all duration-300 ${
          isSidebarOpen ? 'ml-72' : 'ml-24'
        }`}
      >
        <Outlet /> {/* Your routed pages will render here */}
      </div>
    </>
  );
};

export default AdminLayout;