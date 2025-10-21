import React, { useState } from 'react';
import { Search, Edit } from 'lucide-react';

export interface Pet {
  id: number;
  name: string;
  type: 'Dog' | 'Cat' | 'Bird' | 'Rabbit';
  breed: string;
  age: number;
  location: string;
  status: 'Available' | 'Pending' | 'Adopted';
  imageTexts: string[];
  description: string;
  temperament: string[];
  health: string;
  ownerId: string;
}

type AppView = 'owner_dashboard' | 'owner_add' | 'owner_pets' | 'owner_edit';

type MyPetsListProps = {
  pets: Pet[];
  currentOwnerId: string; // pass your logged-in owner id here
  navigateToEdit: (pet: Pet) => void;
  navigate: (view: AppView) => void;
};

const COLORS = {
  primaryTeal: '#00A896',
  darkAccentGreen: '#027878',
};

const MyPetsList: React.FC<MyPetsListProps> = ({ pets, currentOwnerId, navigateToEdit, navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const ownerPets = pets.filter(p => p.ownerId === currentOwnerId);

  const filteredPets = ownerPets.filter(pet => {
    const q = searchTerm.toLowerCase();
    return (
      pet.name.toLowerCase().includes(q) ||
      pet.breed.toLowerCase().includes(q) ||
      pet.type.toLowerCase().includes(q) ||
      pet.status.toLowerCase().includes(q) ||
      pet.location.toLowerCase().includes(q)
    );
  });

  const getStatusStyle = (status: Pet['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-green-50 text-green-700 border-green-400';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-400';
      case 'Adopted':
        return 'bg-blue-50 text-blue-700 border-blue-400';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <h1
        className="text-3xl font-extrabold pb-3 border-b-4 border-gray-200"
        style={{ color: COLORS.darkAccentGreen }}
      >
        Manage My Shared Pets
      </h1>

      {/* Search Bar */}
      <div
        className="mb-6 bg-white p-4 rounded-xl shadow-lg border-l-4"
        style={{ borderColor: COLORS.primaryTeal }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, type, breed, status, or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:ring-4 focus:ring-teal-500 transition duration-200 text-lg"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPets.length > 0 ? (
          filteredPets.map(pet => (
            <div
              key={pet.id}
              onClick={() => navigateToEdit(pet)}
              className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col transition duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer border-t-8"
              style={{ borderColor: COLORS.primaryTeal }}
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={`https://placehold.co/400x160/${COLORS.primaryTeal.substring(1)}/FFFFFF?text=${(pet.imageTexts?.[0] || `${pet.name}+${pet.type}`).replace(/\s/g, '+')}`}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-3 right-3 text-xs font-bold px-4 py-1.5 rounded-full border-2 ${getStatusStyle(
                    pet.status
                  )} shadow-md`}
                >
                  {pet.status}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-1" style={{ color: COLORS.darkAccentGreen }}>
                  {pet.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  {pet.breed} ({pet.type}) — {pet.age} years
                </p>

                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{pet.description}</p>

                <button
                  className="mt-auto w-full text-sm font-semibold py-3 rounded-xl text-white transition duration-200 transform hover:scale-[0.99] shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: COLORS.darkAccentGreen }}
                >
                  <Edit className="mr-1" size={16} /> View / Edit Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="md:col-span-4 text-center p-10 bg-white rounded-xl text-gray-500 shadow-md border-2 border-dashed border-gray-300">
            {searchTerm ? (
              <>No pets match your search: “{searchTerm}”.</>
            ) : (
              <>
                You haven’t shared any pets yet.
                <button
                  onClick={() => navigate('owner_add')}
                  className="text-teal-600 font-medium hover:underline ml-1"
                >
                  Add one now!
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default MyPetsList;
