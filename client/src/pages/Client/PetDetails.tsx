import React from 'react';
import ThreeBackground from '../../components/Background/Background';
// Types used for page redirection (as in App.tsx)
type Page = 'pets' | 'adoption' | 'about' | 'profile' | 'login' | 'notFound';

// Color constants used by the component (as in App.tsx)
const COLORS = {
  primaryTeal: '#009688', // Main teal color
  darkAccentGreen: '#00796B', // Accent color
  cardBackground: '#FFFFFF', // Card background color
  backgroundLight: '#F8F9FA', // General background color
};

// Pet Data Type (Structure expected from your list)
interface Pet {
  id: number;
  name: string;
  type: 'Dog' | 'Cat' | 'Bird' | 'Rabbit';
  breed: string;
  age: number;
  location: string;
  status: 'Available' | 'Pending';
  imageTexts: string[]; // Updated for multiple images
  description: string;
  temperament: string[];
  health: string;
  // adoptionFee removed as requested
}

// Fully detailed mock pet object for demonstration
const MockPet: Pet = {
  id: 1,
  name: "Cücə (Chick)",
  type: "Cat",
  breed: "Scottish Fold",
  age: 1,
  location: "Baku, Narimanov",
  status: "Available",
  imageTexts: ["Cute+Cat+1", "Playful+Cat+2", "Sleeping+Cat+3", "Cat+Profile"], // Multiple image placeholders
  description: "Cücə is a very friendly and playful cat. She loves spending time with people and always wants to be cuddled. She gets along well with other cats but has not been introduced to dogs yet. She can stay alone at home and is fully litter trained.",
  temperament: ["Friendly", "Playful", "Cuddly", "Calm"],
  health: "All vaccinations are up-to-date, and she is spayed/neutered. Completely healthy.",
  // adoptionFee removed as requested
};

// --- PET DETAIL COMPONENT ---

const PetDetail: React.FC<{ pet: Pet; setPage: (page: Page) => void }> = ({ pet, setPage }) => {
  // If a real pet object is not passed as a prop, use mock data
  const currentPet = pet || MockPet;

  // Small component for UI Detail Items
  const DetailItem: React.FC<{ icon: string; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg shadow-sm">
      <i className={`${icon} text-xl w-6 text-center`} style={{ color: COLORS.primaryTeal }}></i>
      <div>
        <span className="text-xs font-semibold uppercase text-gray-500 block">{label}</span>
        <span className="text-md font-bold text-gray-800">{value}</span>
      </div>
    </div>
  );

  // Simple action handler (removed alert() as per instructions)
  const handleAdoptionClick = () => {
    console.log(`Adoption application initiated for: ${currentPet.name}`);
    setPage('adoption');
  };

  return (
    <div>
      <ThreeBackground />
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => setPage('pets')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition duration-150 font-medium"
          >
            <a href="/pets">Return to Pet List</a>
          </button>
        </div>

        {/* Main Detail Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-b-8"
          style={{ borderColor: COLORS.primaryTeal }}>

          {/* Title and Status */}
          <div className="p-8 pb-4 flex justify-between items-start border-b border-gray-100">
            <h1 className="text-4xl font-extrabold" style={{ color: COLORS.darkAccentGreen }}>
              {currentPet.name}
            </h1>
            <span
              className={`text-sm font-bold uppercase px-4 py-1 rounded-full shadow-md ${currentPet.status === 'Available' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-800'}`}
            >
              {currentPet.status === 'Available' ? 'Available' : 'Pending'}
            </span>
          </div>

          {/* Main Data Grid */}
          <div className="p-8 lg:grid lg:grid-cols-3 gap-8">

            {/* Left Column: Image Gallery and Key Characteristics */}
            <div className="lg:col-span-1 space-y-6">
              {/* Main Image (First image in the array) */}
              <div className="w-full h-80 bg-gray-100 rounded-xl overflow-hidden shadow-lg border-2 border-dashed flex items-center justify-center">
                <img
                  src={`https://placehold.co/600x400/${COLORS.primaryTeal.substring(1)}/FFFFFF?text=${currentPet.imageTexts[0].replace(/\s/g, '+')}`}
                  alt={`${currentPet.name} - ${currentPet.breed} (Main Image)`}
                  className="w-full h-full object-cover"
                  onError={(e: any) => e.target.src = `https://placehold.co/600x400/ccc/333?text=Image+Not+Found`}
                />
              </div>

              {/* Image Gallery Thumbnails (Scrollable) */}
              <div className="flex space-x-3 overflow-x-auto pb-2 px-1">
                {currentPet.imageTexts.map((text, index) => (
                  <div
                    key={index}
                    // Dummy onClick for visual representation of gallery interaction
                    onClick={() => console.log(`Viewing image ${index + 1}`)}
                    className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 hover:border-teal-500 transition"
                    // Highlight the currently displayed image (first one)
                    style={{ borderColor: index === 0 ? COLORS.primaryTeal : 'transparent' }}
                  >
                    <img
                      src={`https://placehold.co/100x100/A8DADC/333?text=${text.replace(/\s/g, '+')}`}
                      alt={`${currentPet.name} photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Key Characteristics Card */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-lg border-l-4" style={{ borderColor: COLORS.darkAccentGreen }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>Key Characteristics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <DetailItem icon="fas fa-paw" label="Type" value={currentPet.type} />
                  <DetailItem icon="fas fa-ribbon" label="Breed" value={currentPet.breed} />
                  <DetailItem icon="fas fa-birthday-cake" label="Age" value={`${currentPet.age} years`} />
                  <DetailItem icon="fas fa-location-dot" label="Location" value={currentPet.location} />
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Information and Contact */}
            <div className="lg:col-span-2 mt-8 lg:mt-0 space-y-8">

              {/* Story / Description */}
              <div>
                <h2 className="text-2xl font-bold mb-3 border-b pb-2" style={{ color: COLORS.primaryTeal }}>Story and Description</h2>
                <p className="text-gray-700 leading-relaxed">{currentPet.description}</p>
              </div>

              {/* Temperament */}
              <div>
                <h2 className="text-2xl font-bold mb-3 border-b pb-2" style={{ color: COLORS.primaryTeal }}>Temperament</h2>
                <div className="flex flex-wrap gap-2">
                  {currentPet.temperament.map((t, index) => (
                    <span key={index} className="px-3 py-1 bg-teal-100 text-teal-800 font-medium rounded-full text-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Health Records */}
              <div>
                <h2 className="text-2xl font-bold mb-3 border-b pb-2" style={{ color: COLORS.primaryTeal }}>Health Records</h2>
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 text-gray-700">
                  <p className="font-semibold">{currentPet.health}</p>
                </div>
              </div>

              {/* Contact and Adoption Action Section (Replaces Fee) */}
              <div className="pt-4 border-t-2 border-dashed" style={{ borderColor: COLORS.primaryTeal }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.primaryTeal }}>Adoption & Contact</h2>
                <div className="bg-teal-50 p-6 rounded-xl shadow-inner space-y-4">
                  <p className="text-gray-700">
                    If you are interested in adopting {currentPet.name} or want to know more, please contact us.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <a href="tel:+994501234567" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium">
                      <i className="fas fa-phone-alt text-lg" style={{ color: COLORS.darkAccentGreen }}></i>
                      <span>+994 50 123 45 67</span>
                    </a>
                    <a href="mailto:adopt@petshelter.az" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium">
                      <i className="fas fa-envelope text-lg" style={{ color: COLORS.darkAccentGreen }}></i>
                      <span>adopt@petshelter.az</span>
                    </a>
                  </div>
                  <button
                    onClick={handleAdoptionClick}
                    className="w-full text-white font-bold py-3 px-8 rounded-full shadow-xl transition duration-300 transform hover:scale-[1.01] hover:shadow-2xl mt-3"
                    style={{ backgroundColor: COLORS.primaryTeal }}
                  >
                    <i className="fas fa-heart mr-2"></i> Apply to Adopt
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>

  );
};

export default PetDetail;
