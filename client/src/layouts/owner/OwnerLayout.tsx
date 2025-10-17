import { Outlet } from "react-router-dom";

const OwnerLayout = () => {
  return (
    <>
      {/* owner sidebar */}
      <Outlet />
    </>
  );
};

export default OwnerLayout;