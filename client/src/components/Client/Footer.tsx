import React from 'react';

// Rəng sxemi (App.tsx faylındakı əsas rənglərlə eynidir)
const COLORS = {
  primaryTeal: '#009688', // Əsas firuzəyi rəng
  darkAccentGreen: '#00796B', // Tünd vurğu yaşılı
  backgroundLight: '#F8F9FA', // Açıq fon
  cardBackground: '#FFFFFF', // Kart fonu
};

// Kiçik Logo Komponenti
const FooterLogo = () => (
    <div className="flex items-center space-x-2">
        {/* Paw icon */}
        <svg className="w-8 h-8" style={{ color: COLORS.primaryTeal }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 20.85c-1.5-.7-2.6-1.5-3.6-2.5a6.5 6.5 0 0 1-1.3-1.6 4.3 4.3 0 0 1-.7-1.4c-.2-.6-.3-1.3-.3-2a4.4 4.4 0 0 1 1-3.2 5 5 0 0 1 3.5-1.5c.6 0 1.2.1 1.8.3.6.2 1.1.5 1.6.8a5 5 0 0 1 1.6-1.6c.5-.3 1.1-.6 1.7-.8.6-.2 1.2-.3 1.8-.3a5 5 0 0 1 3.5 1.5 4.4 4.4 0 0 1 1 3.2c0 .7-.1 1.4-.3 2a6.5 6.5 0 0 1-1.3 1.6c-1 .9-2.1 1.8-3.6 2.5a3.8 3.8 0 0 1-3.5 0zM12 2a4 4 0 0 1 4 4c0 1.6-1.4 3-4 3S8 7.6 8 6a4 4 0 0 1 4-4z"/>
        </svg>
        <span className="text-2xl font-extrabold tracking-tight" style={{ color: COLORS.darkAccentGreen }}>Animora</span>
    </div>
);

// Əsas Altbilgi (Footer) Komponenti
const Footer = () => {
    
    // Altbilgi Naviqasiya linkləri
    const navLinks = [
        { name: "Mövcud Heyvanlar", url: "#pets" },
        { name: "Övladlığa Götürmə Prosesi", url: "#adoption" },
        { name: "Haqqımızda & Təsir", url: "#about" },
        { name: "Könüllü Olun", url: "#volunteer" },
    ];

    return (
        <footer 
            className="w-full pt-12 pb-6 text-gray-700 border-t" 
            style={{ backgroundColor: COLORS.cardBackground, borderColor: COLORS.primaryTeal + '30' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Əsas Kontent Bloku (4 Sütun) */}
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4 mb-10">
                    
                    {/* 1. Şirkət İnformasiyası */}
                    <div>
                        <FooterLogo />
                        <p className="mt-4 text-sm text-gray-500 max-w-xs">
                            Hər canlının ikinci bir şansa layiq olduğuna inanırıq. Məsuliyyətli övladlığa götürmə yolu ilə heyvanların həyatını dəyişirik.
                        </p>
                    </div>

                    {/* 2. Naviqasiya Linkləri */}
                    <div>
                        <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>
                            Sürətli Keçidlər
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

                    {/* 3. Əlaqə Məlumatları */}
                    <div>
                        <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>
                            Bizimlə Əlaqə
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center">
                                <i className="fas fa-map-marker-alt mr-2" style={{ color: COLORS.primaryTeal }}></i> 
                                Bakı, Azərbaycan
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
                    
                    {/* 4. Sosial Media */}
                    <div>
                        <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>
                            Bizi İzləyin
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
                            İndi Bağış Edin
                        </button>
                    </div>

                </div>
                
                {/* Müəllif Hüquqları Bölməsi */}
                <div className="border-t pt-4 text-center text-sm text-gray-500" style={{ borderColor: COLORS.primaryTeal + '20' }}>
                    &copy; {new Date().getFullYear()} Paws & Purpose. Bütün hüquqlar qorunur.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
