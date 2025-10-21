import React from 'react';
import { Link } from 'react-router';

const COLORS = {
  primaryTeal: '#009688', 
  darkAccentGreen: '#00796B', 
  backgroundLight: '#F8F9FA', 
  cardBackground: '#FFFFFF',
};

const Logo: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => (
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

const Footer = () => {
    
    const navLinks = [
        { name: "Available Animals", url: "#pets" },
        { name: "Adoption Process", url: "#adoption" },
        { name: "About Us & Impact", url: "#about" },
        { name: "Become a Volunteer", url: "#volunteer" },
    ];

    return (
        <footer 
            className="w-full pt-12 pb-6 text-gray-700 border-t" 
            style={{ backgroundColor: COLORS.cardBackground, borderColor: COLORS.primaryTeal + '30' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4 mb-10">
                    
                    <div>
                        <Logo />
                        <p className="mt-4 text-sm text-gray-500 max-w-xs">
                            We believe that every living being deserves a second chance. Through responsible adoption, we change animals' lives.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {navLinks.map(link => (
                                <li key={link.name}>
                                    <a 
                                        href={link.url} 
                                        className="hover:text-gray-900 transition duration-150"
                                        style={{ color: COLORS.primaryTeal }}
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>
                            Contact Us
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center">
                                <i className="fas fa-map-marker-alt mr-2" style={{ color: COLORS.primaryTeal }}></i> 
                                Baku, Azerbaijan
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-phone mr-2" style={{ color: COLORS.primaryTeal }}></i> 
                                +994 50 123 45 67
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-envelope mr-2" style={{ color: COLORS.primaryTeal }}></i> 
                                info@pawsandpurpose.az
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>
                            Follow Us
                        </h3>
                        <div className="flex space-x-4 text-2xl">
                            <a href="#" className="hover:opacity-75 transition duration-150" style={{ color: COLORS.primaryTeal }}>
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="#" className="hover:opacity-75 transition duration-150" style={{ color: COLORS.primaryTeal }}>
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="hover:opacity-75 transition duration-150" style={{ color: COLORS.primaryTeal }}>
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="hover:opacity-75 transition duration-150" style={{ color: COLORS.primaryTeal }}>
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div>
                        <button
                            className="mt-5 text-white font-bold px-4 py-2 rounded-lg transition duration-300 shadow-md text-sm hover:scale-[1.03]"
                            style={{ backgroundColor: COLORS.darkAccentGreen }}
                        >
                            Donate Now
                        </button>
                    </div>

                </div>
                
                <div className="border-t pt-4 text-center text-sm text-gray-500" style={{ borderColor: COLORS.primaryTeal + '20' }}>
                    &copy; {new Date().getFullYear()} Paws & Purpose. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
