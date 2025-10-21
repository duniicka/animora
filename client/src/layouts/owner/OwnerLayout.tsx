import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Owner/Sidebar";
import { useState, useCallback } from "react";

const OwnerLayout = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(v => !v), []);
  const setIsLoggedInHandler = useCallback((value: boolean) => setIsLoggedIn(value), []);

  return (
    <>
      <Sidebar
        currentView={ currentView as any }
        navigate={navigate}
        setIsLoggedIn={setIsLoggedInHandler}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <Outlet />
    </>
  );
};

export default OwnerLayout;