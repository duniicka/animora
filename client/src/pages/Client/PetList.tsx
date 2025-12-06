import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import ThreeBackground from '../../components/Background/Background';
import { Link } from 'react-router';
import { API_ENDPOINTS } from '../../config/api';
// Declaration for THREE.js global object access (for TypeScript)
declare global {
  interface Window {
    THREE: any; 
  }
}

// --- Configuration and Data ---

const COLORS = {
  primaryTeal: '#009688', // Main teal color (used for headers, links, primary buttons)
  darkAccentGreen: '#00796B', // Accent color (used for adopt buttons, strong highlights)
  backgroundLight: '#F8F9FA', // General page background
  cardBackground: '#FFFFFF', // Card background color
};

// Pet Data Interface
interface Pet {
    id: string;
    name: string;
    type: 'Dog' | 'Cat' | 'Rabbit' | 'Bird';
    breed: string;
    age: number;
    location: string;
    status: 'Available' | 'Pending' | 'Adopted';
    imageText: string;
    imageUrl?: string;
}

// --- Pet Card Component ---
const PetCard: React.FC<{ pet: Pet }> = ({ pet }) => {
    // Determine image URL - use real image if available, otherwise placeholder
    const imageUrl = pet.imageUrl && pet.imageUrl.startsWith('http')
        ? pet.imageUrl
        : `https://placehold.co/400x300/${COLORS.primaryTeal.substring(1)}/FFFFFF?text=${pet.imageText.replace(/\s/g, '+')}`;

    return (
        <div 
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
            style={{ border: `1px solid ${COLORS.primaryTeal}20` }}
        >
            <div className="relative h-48">
                <img 
                    src={imageUrl} 
                    alt={`Image of ${pet.name}`} 
                    className="w-full h-full object-cover"
                    onError={(e: any) => { 
                        e.target.onerror = null; 
                        e.target.src = `https://placehold.co/400x300/${COLORS.primaryTeal.substring(1)}/FFFFFF?text=${pet.imageText.replace(/\s/g, '+')}`;
                    }}
                />
                {pet.status === 'Pending' && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        PENDING
                    </div>
                )}
                {pet.status === 'Adopted' && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        ADOPTED
                    </div>
                )}
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-2xl font-extrabold mb-1" style={{ color: COLORS.darkAccentGreen }}>{pet.name}</h3>
                <p className="text-sm font-semibold text-gray-600 mb-2">{pet.breed} ({pet.type})</p>
                
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span><i className="fa-solid fa-clock mr-1"></i> Age: {pet.age} yrs</span>
                    <span><i className="fa-solid fa-location-dot mr-1"></i> {pet.location}</span>
                </div>

                <div className="mt-auto">
                    {pet.status === 'Available' ? (
                        <Link
                            to={`/pets/${pet.id}`}
                            className="w-full text-white font-bold p-2 rounded-lg shadow-md transition duration-300 hover:opacity-95"
                            style={{ backgroundColor: COLORS.darkAccentGreen }}
                        >
                            Adopt Me!
                        </Link>
                    ) : (
                        <button
                            className="w-full text-white font-bold p-2 rounded-lg shadow-md transition duration-300 opacity-50 cursor-not-allowed"
                            style={{ backgroundColor: COLORS.darkAccentGreen }}
                            disabled
                        >
                            Check Details
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Filters Component ---

interface Filters {
    search: string;
    type: 'All' | Pet['type'];
    location: 'All' | string;
}

const FilterPanel: React.FC<{ 
    filters: Filters, 
    setFilters: React.Dispatch<React.SetStateAction<Filters>>,
    pets: Pet[]
}> = ({ filters, setFilters, pets }) => {
    
    // Extract unique types and locations from actual pet data
    const petTypes = ['All', ...Array.from(new Set(pets.map(p => p.type)))] as ('All' | Pet['type'])[];
    const locations = ['All', ...Array.from(new Set(pets.map(p => p.location)))];

    const handleChange = (name: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg sticky top-6">
          {/* <ThreeBackground /> */}
            <h4 className="text-xl font-bold mb-4" style={{ color: COLORS.primaryTeal }}>Filter Pets</h4>
            {/* Search Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search by Name/Breed</label>
                <input
                    type="text"
                    placeholder="e.g., Golden Retriever"
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal transition duration-150"
                />
            </div>

            {/* Pet Type Select */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pet Type</label>
                <select
                    value={filters.type}
                    onChange={(e) => handleChange('type', e.target.value as 'All' | Pet['type'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal transition duration-150"
                >
                    {petTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            
            {/* Location Select */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                    value={filters.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal transition duration-150"
                >
                    {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>
            
            <button 
                onClick={() => setFilters({ search: '', type: 'All', location: 'All' })}
                className="w-full text-sm font-semibold py-2 rounded-lg transition duration-300 text-white"
                style={{ backgroundColor: COLORS.primaryTeal }}
            >
                Clear Filters
            </button>
        </div>
    );
}

// --- Main App Component (Now Pet Listing Page) ---

const PetList: React.FC = () => {
    const [filters, setFilters] = useState<Filters>({
        search: '',
        type: 'All',
        location: 'All',
    });
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch pets from API
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.pets);
                const data = await response.json();

                if (data.success) {
                    // Transform API data
                    const transformedPets = data.pets.map((pet: any) => ({
                        id: pet._id,
                        name: pet.name,
                        type: pet.type,
                        breed: pet.breed,
                        age: pet.age,
                        location: pet.location,
                        status: pet.status,
                        imageText: `${pet.name}+${pet.type}`,
                        imageUrl: pet.imageUrl
                    }));
                    
                    setPets(transformedPets);
                } else {
                    console.error('Failed to fetch pets');
                }
            } catch (error) {
                console.error('Fetch pets error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);
    
    // Filter logic memoized for performance
    const filteredPets = useMemo(() => {
        let result = pets;
        
        // 1. Filter by Pet Type
        if (filters.type !== 'All') {
            result = result.filter(pet => pet.type === filters.type);
        }
        
        // 2. Filter by Location
        if (filters.location !== 'All') {
            result = result.filter(pet => pet.location === filters.location);
        }
        
        // 3. Filter by Search term (Name or Breed)
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(pet => 
                pet.name.toLowerCase().includes(searchTerm) || 
                pet.breed.toLowerCase().includes(searchTerm)
            );
        }

        // Sort by availability (Available first) and then by name
        result.sort((a, b) => {
            if (a.status === 'Available' && b.status !== 'Available') return -1;
            if (a.status !== 'Available' && b.status === 'Available') return 1;
            return a.name.localeCompare(b.name);
        });
        
        return result;
    }, [filters, pets]);

    if (loading) {
        return (
            <div className="text-gray-800 relative min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
                <ThreeBackground />
                <div className="relative z-10 flex justify-center items-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: COLORS.primaryTeal }}></div>
                        <p className="text-gray-600 font-semibold text-lg">Loading pets...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="text-gray-800 relative " style={{ fontFamily: 'Inter, sans-serif' }}>
            <ThreeBackground /> 
            {/* Main Content Area */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-4xl font-extrabold mb-2" style={{ color: COLORS.darkAccentGreen }}>
                    Pets Available for Adoption
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Find your perfect companion from our loving animals below. ({pets.length} pets available)
                </p>

                <div className="lg:flex lg:space-x-8">
                    
                    {/* Filter Sidebar (Desktop) */}
                    <div className="lg:w-1/4 hidden lg:block">
                        <FilterPanel filters={filters} setFilters={setFilters} pets={pets} />
                    </div>

                    {/* Pets Grid */}
                    <div className="lg:w-3/4">
                        
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden mb-6">
                            <details className="bg-white rounded-xl shadow-md p-4">
                                <summary className="font-bold text-lg cursor-pointer" style={{ color: COLORS.primaryTeal }}>
                                    Filters ({filteredPets.length} results)
                                </summary>
                                <div className="pt-4">
                                    <FilterPanel filters={filters} setFilters={setFilters} pets={pets} />
                                </div>
                            </details>
                        </div>

                        <div className="text-lg font-semibold mb-4 text-gray-700">
                            Showing {filteredPets.length} pets
                        </div>

                        {filteredPets.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPets.map(pet => (
                                    <PetCard key={pet.id} pet={pet} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-10 rounded-xl text-center shadow-lg">
                                <h3 className="text-2xl font-bold" style={{ color: COLORS.primaryTeal }}>
                                    No pets found.
                                </h3>
                                <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PetList;
