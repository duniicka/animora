import React from 'react';
import ThreeBackground from '../../components/Background/Background';
// --- Configuration and Data ---

const COLORS = {
  primaryTeal: '#009688',
  accentOrange: '#FF8A65',
  backgroundLight: '#F8F9FA',
};



interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// --- Reusable Components ---


const FeatureCard: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="p-8 rounded-xl shadow-lg transition duration-300 hover:shadow-xl hover:bg-teal-50" style={{ backgroundColor: COLORS.backgroundLight }}>
    <div className="mb-4" style={{ color: COLORS.primaryTeal }}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3" style={{ color: COLORS.primaryTeal }}>{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

// --- Main App Component ---

const Home: React.FC = () => {
  return (
    <div className="text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* 3D Background Component */}
      <ThreeBackground /> 
      {/* Hero Section */}
      <main className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">

          {/* Hero Text Content */}
          <div className="lg:w-1/2">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4" style={{ color: COLORS.primaryTeal }}>
              A Loving Home Is Waiting.
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Welcome to Paws & Purpose. We connect incredible pets with compassionate people. Start your journey to unconditional love today.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a 
                    href="#" 
                    className="inline-block text-white text-xl font-bold py-4 px-8 rounded-xl shadow-2xl transition duration-300 transform hover:-translate-y-1"
                    style={{ backgroundColor: COLORS.primaryTeal }} // Hover handled via classes
                >
                    Adopt Now &rarr;
                </a>
                <a 
                    href="#" 
                    className="inline-block text-xl font-medium py-4 px-8 transition duration-300 hover:underline"
                    style={{ color: COLORS.primaryTeal }}
                >
                    Learn Our Story
                </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:w-1/2 w-full mt-10 lg:mt-0">
            <img
              src={`https://placehold.co/800x550/${COLORS.primaryTeal.substring(1)}/ffffff?text=Happy+Adopted+Dog`}
              alt="A happy dog looking at the camera, symbolizing a successful adoption."
              className="w-full h-auto object-cover rounded-2xl shadow-2xl transition duration-500 transform hover:scale-[1.01]"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.onerror = null; 
                e.currentTarget.src = `https://placehold.co/800x550/${COLORS.primaryTeal.substring(1)}/ffffff?text=Image+Loading+Error`;
              }}
            />
          </div>
        </div>
      </main>

      {/* Mission & Value Proposition Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
            Our Commitment to Every Paw
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-12">
            We believe in responsible adoption, personalized matching, and lifelong support for every family and pet we connect.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Clear & Simple Process"
              description="Our adoption steps are transparent and easy to follow, ensuring a smooth transition for both you and your new pet."
              icon={
                <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.103A.996.996 0 0012 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10c0-.38-.03-.755-.088-1.125A.998.998 0 0021.5 5h-10.5z"></path>
                </svg>
              }
            />

            <FeatureCard 
              title="Vet-Checked & Vaccinated"
              description="Every animal is thoroughly examined, treated, and loved until they are ready to join their forever home."
              icon={
                <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              }
            />

            <FeatureCard 
              title="Lifelong Resources"
              description="We don't stop caring after adoption. Access training guides, vet recommendations, and our community network."
              icon={
                <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 0a1.5 1.5 0 112.121 2.121M15 12a3 3 0 11-6 0 3 3 0 016 0zM4.536 17.464L8.072 13.928m0 0a1.5 1.5 0 10-2.121 2.121M3 12h2m14 0h2m-9 9v-2M12 5V3"></path>
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16" style={{ backgroundColor: COLORS.primaryTeal }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <h2 className="text-3xl font-bold text-white mb-6 md:mb-0">
            Ready to Meet Your New Best Friend?
          </h2>
          <a 
            href="#" 
            className="text-white text-lg font-bold py-3 px-8 rounded-full shadow-xl hover:scale-105 transition duration-300 transform"
            style={{ backgroundColor: COLORS.accentOrange }} // Hover handled via classes
          >
            View All Adoptables &rarr;
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
