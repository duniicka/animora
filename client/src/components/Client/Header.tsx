import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const COLORS = {
  primaryTeal: "#009688",
  darkAccentGreen: "#00796B",
  gray: "#6B7280",
};

const Logo: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <Link to="/" className="flex items-center space-x-2 transition duration-300">
    <svg
      className="w-8 h-8"
      style={{ color: COLORS.primaryTeal}}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-10v5c0 .552.448 1 1 1s1-.448 1-1v-5c0-.552-.448-1-1-1s-1 .448-1 1zm-3.5 2h7c.276 0 .5.224.5.5s-.224.5-.5.5h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5z" />
    </svg>
    <span
      className="text-2xl font-extrabold tracking-tight transition duration-300"
      style={{ color: COLORS.primaryTeal  }}
    >
      Animora
    </span>
  </Link>
);

const Header: React.FC = () => {
  const location = useLocation();
  const isPetsPage = location.pathname.startsWith("/pets");

  const linkBase =
    "font-medium transition duration-150 hover:text-gray-900";
  const activeStyle = { color: COLORS.primaryTeal, fontWeight: 700 as const };

  return (
    <header className="relative z-10 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo: teal yalnız /pets-də */}
        <Logo isActive={isPetsPage} />

        <nav className="space-x-4 flex items-center">
          <NavLink
            to="/pets"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "" : "text-gray-600"}`
            }
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            end
          >
            Available Pets
          </NavLink>

          <NavLink
            to="/adoption-process"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "" : "text-gray-600"}`
            }
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Adoption Process
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "" : "text-gray-600"}`
            }
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            About Us
          </NavLink>

          <a
            href="#"
            className="font-bold px-4 py-2 rounded-lg transition duration-150 text-white shadow-md hover:scale-[1.03]"
            style={{ backgroundColor: COLORS.darkAccentGreen }}
          >
            My Account
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
