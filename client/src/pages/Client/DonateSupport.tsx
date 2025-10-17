import ThreeBackground from "../../components/Background/Background";

const COLORS = {
    primaryTeal: '#009688', // Main teal color (used for headers, links, primary buttons)
    darkAccentGreen: '#00796B', // Accent color (used for adopt buttons, strong highlights)
    backgroundLight: '#F8F9FA', // General page background
    cardBackground: '#FFFFFF', // Card background color
};


const DonateSupportPage: React.FC = () => (
    <>
        <ThreeBackground />
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">

            <h1 className="text-5xl font-extrabold mb-4" style={{ color: COLORS.darkAccentGreen }}>
                Donate & Support (Hədiyyə və Dəstək)
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Bu səhifə hələ hazırlanır. Çox yaxın zamanda heyvanlara necə dəstək ola biləcəyinizi görə biləcəksiniz.
            </p>
            <button
                className="text-white font-bold py-3 px-8 rounded-lg shadow-md transition hover:opacity-95 duration-300"
                style={{ backgroundColor: COLORS.primaryTeal }}
                onClick={() => console.log('Navigate to Donation Form')}
            >
                Donate Now (Placeholder)
            </button>
        </main>
    </>
);

export default DonateSupportPage