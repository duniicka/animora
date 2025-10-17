import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      {/* admin sidebar */}
      <Outlet />
    </>
  );
};

export default AdminLayout;