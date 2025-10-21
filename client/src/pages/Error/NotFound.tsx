import React from 'react';
import ThreeBackground from '../../components/Background/Background';
import { Link } from 'react-router';

const COLORS = {
    primaryTeal: '#009688', // Main teal color 
    darkAccentGreen: '#00796B', // Accent color
    backgroundLight: '#F8F9FA', // General page background
    cardBackground: '#FFFFFF', // Card background color
};
const NotFound: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => {
    return (
        <main className="relative z-10 max-w-2xl mx-auto px-4 py-20 min-h-[50vh] flex items-center justify-center">
            <ThreeBackground />
            <div className="bg-white p-10 rounded-xl shadow-2xl text-center w-full border-t-4"
                style={{ borderColor: COLORS.darkAccentGreen }}>

                {/* Playful Animated Element: Bouncing Paw Icon */}
                <div className="flex justify-center  mb-8">

                    <div className="relative flex justify-center mb-8 h-24">
                        <p
                            className="text-7xl font-extrabold text-center mx-2 animate-bounce"
                            style={{ color: COLORS.darkAccentGreen }}
                        >
                            404
                        </p>
                    </div>

                </div>

                <h1 className="text-6xl font-extrabold mb-3" style={{ color: COLORS.darkAccentGreen }}>
                    Page Lost!
                </h1>
                <p className="text-xl text-gray-700 mb-4">
                    It seems the page you were looking for has wandered off.
                </p>
                <p className="text-gray-500 mb-8">
                    Don't worry, even our pets get lost sometimes. Let's get you back on track.
                </p>

                <button
                    onClick={() => setPage('pets')}
                    className="text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-[1.03] hover:shadow-xl"
                    style={{ backgroundColor: COLORS.primaryTeal }}
                >
                    <Link to={"/"} className="fas fa-home mr-2"> Return to Homepage </Link>
                </button>
            </div>
        </main>
    );
};

export default NotFound;
