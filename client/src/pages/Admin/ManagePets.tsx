import React, { useState, useMemo } from 'react';
import {
  ListTodo,
  Search,
  Filter,
  PlusCircle,
  Trash2,
  Edit2,
  Eye,
  ChevronUp,
  ChevronDown,
  Activity,
  Tag,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router';

// --- Types and Interfaces (taken from previous components) ---
type AppView = 'admin_dashboard' | 'admin_users' | 'admin_pets' | 'admin_settings';
type PetStatus = 'Available' | 'Pending' | 'Adopted';
type PetType = 'Dog' | 'Cat' | 'Bird' | 'Rabbit';

export interface Pet {
  id: number;
  name: string;
  type: PetType;
  breed: string;
  age: number;
  location: string;
  status: PetStatus;
  ownerId: string;
  listingDate: string; 
  applicationCount: number;
}

// --- Colors (unchanged) ---
const COLORS = {
  primaryTeal: '#00A896',
  darkAccentGreen: '#027878',
  cardBackground: '#FFFFFF',
  chartBlue: '#3498DB', 
  chartOrange: '#F39C12', 
  chartGreen: '#2ECC71', 
  chartRed: '#E74C3C',
  chartGray: '#BDC3C7',
};

// --- SIMULATED DATA ---

const ALL_DEMO_PETS: Pet[] = [
  { id: 1, name: 'Buster', type: 'Dog', breed: 'Lab', age: 3, location: 'New York', status: 'Available', ownerId: 'owner_1', listingDate: '2024-06-01', applicationCount: 8 },
  { id: 2, name: 'Mittens', type: 'Cat', breed: 'Siamese', age: 1, location: 'Los Angeles', status: 'Pending', ownerId: 'owner_2', listingDate: '2024-08-15', applicationCount: 3 },
  { id: 3, name: 'Tweety', type: 'Bird', breed: 'Canary', age: 2, location: 'Dallas Shelter', status: 'Adopted', ownerId: 'owner_1', listingDate: '2024-01-20', applicationCount: 15 },
  { id: 4, name: 'Hoppy', type: 'Rabbit', breed: 'Holland Lop', age: 0, location: 'Regional Suburb', status: 'Available', ownerId: 'owner_3', listingDate: '2024-09-10', applicationCount: 1 },
  { id: 5, name: 'Shadow', type: 'Cat', breed: 'Persian', age: 5, location: 'New York', status: 'Available', ownerId: 'owner_2', listingDate: '2024-05-01', applicationCount: 10 },
  { id: 6, name: 'Max', type: 'Dog', breed: 'German Shepherd', age: 4, location: 'Los Angeles', status: 'Adopted', ownerId: 'owner_3', listingDate: '2024-03-10', applicationCount: 20 },
  { id: 7, name: 'Luna', type: 'Dog', breed: 'Golden Retriever', age: 1, location: 'New York', status: 'Available', ownerId: 'owner_4', listingDate: '2024-10-25', applicationCount: 0 },
];

// --- Helper Functions ---
const getStatusBadge = (status: PetStatus) => {
    let color;
    switch (status) {
        case 'Available': color = COLORS.chartGreen; break;
        case 'Pending': color = COLORS.chartOrange; break;
        case 'Adopted': color = COLORS.chartBlue; break;
        default: color = COLORS.chartGray;
    }
    return (
        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
            style={{ backgroundColor: color, color: COLORS.cardBackground, opacity: 0.9 }}>
            {status}
        </span>
    );
};

// --- Main Component ---

const ManagePets: React.FC<{
  pets?: Pet[];
  navigate: (view: AppView) => void;
}> = ({ pets = ALL_DEMO_PETS, navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | PetType>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | PetStatus>('All');
  const [sortBy, setSortBy] = useState<'name' | 'listingDate' | 'applicationCount' | 'age'>('listingDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filtering and Sorting Logic
  const filteredAndSortedPets = useMemo(() => {
    let filteredList = pets;

    // Search
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filteredList = filteredList.filter(pet =>
        pet.name.toLowerCase().includes(lowerCaseSearch) ||
        pet.breed.toLowerCase().includes(lowerCaseSearch) ||
        pet.location.toLowerCase().includes(lowerCaseSearch) ||
        pet.ownerId.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Type Filter
    if (filterType !== 'All') {
      filteredList = filteredList.filter(pet => pet.type === filterType);
    }
    
    // Status Filter
    if (filterStatus !== 'All') {
        filteredList = filteredList.filter(pet => pet.status === filterStatus);
    }

    // Sorting
    filteredList.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'listingDate') {
        comparison = new Date(a.listingDate).getTime() - new Date(b.listingDate).getTime();
      } else if (sortBy === 'applicationCount') {
        comparison = a.applicationCount - b.applicationCount;
      } else if (sortBy === 'age') {
        comparison = a.age - b.age;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filteredList;
  }, [pets, searchTerm, filterType, filterStatus, sortBy, sortDirection]);

  // Sorting function
  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  // Sort Icon
  const SortIcon: React.FC<{ column: typeof sortBy }> = ({ column }) => {
    if (sortBy !== column) return <ChevronDown size={12} className="text-gray-400 ml-1 opacity-50" />;
    return sortDirection === 'asc' 
        ? <ChevronUp size={12} className="text-gray-600 ml-1" /> 
        : <ChevronDown size={12} className="text-gray-600 ml-1" />;
  };


  return (
    <div className="space-y-8 p-0">
      <h1
        className="text-4xl font-extrabold pb-3 mb-6 border-b-4 border-gray-200 flex items-center"
        style={{ color: COLORS.darkAccentGreen }}
      >
        <ListTodo className="mr-3" size={32} /> Pet Listings Management
      </h1>

      {/* --- Filter & Action Bar --- */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4" style={{ borderColor: COLORS.primaryTeal }}>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-1/3">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search: Name, Breed, Owner ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 flex items-center"><Tag size={16} className="mr-1" /> <b>Type:</b></label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'All' | PetType)}
              className="py-3 px-4 border border-gray-300 rounded-xl bg-white"
            >
              <option value="All">All Types</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
            </select>
          </div>
          
           {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 flex items-center"><Activity size={16} className="mr-1" /> <b>Status:</b></label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'All' | PetStatus)}
              className="py-3 px-4 border border-gray-300 rounded-xl bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Adopted">Adopted</option>
            </select>
          </div>

          {/* Add New Pet Button (Simulated) */}
          <button
            onClick={() => alert("New Pet Listing Form will open...")}
            className="w-full md:w-auto text-white font-bold py-3 px-6 rounded-xl shadow-md transition duration-300 hover:bg-teal-700 flex items-center justify-center text-sm"
            style={{ backgroundColor: COLORS.darkAccentGreen }}
          >
            <PlusCircle className="mr-2" size={20} />
            Add New Pet
          </button>
        </div>
      </div>

      {/* --- Pets Table --- */}
      <div className="bg-white p-8 rounded-2xl shadow-xl overflow-x-auto">
        <h3 className="text-2xl font-bold mb-6 border-b pb-3" style={{ color: COLORS.primaryTeal }}>
          Total Pet Listings: {filteredAndSortedPets.length}
        </h3>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Table Headers with Sort */}
              {[{ key: 'name', label: 'Pet Name' }, { key: 'type', label: 'Type' }, { key: 'age', label: 'Age' }, 
               { key: 'location', label: 'Location' }, { key: 'ownerId', label: 'Owner ID' }, 
               { key: 'applicationCount', label: 'Applications' }, { key: 'listingDate', label: 'Listing Date' }, 
               { key: 'status', label: 'Status' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => key !== 'type' && key !== 'location' && key !== 'ownerId' && key !== 'status' && handleSort(key as typeof sortBy)}
                  className={`px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${key !== 'type' && key !== 'location' && key !== 'ownerId' && key !== 'status' ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                >
                  <div className="flex items-center">
                    {label}
                    {key !== 'type' && key !== 'location' && key !== 'ownerId' && key !== 'status' && <SortIcon column={key as typeof sortBy} />}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedPets.map((pet) => (
              <tr key={pet.id} className="hover:bg-gray-50 transition duration-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{pet.name} ({pet.breed})</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pet.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center"><MapPin size={14} className="mr-1 text-red-400"/>{pet.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">#{pet.ownerId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pet.applicationCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(pet.listingDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(pet.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => alert(`View: ${pet.name}`)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50" title="View Details"><Eye size={18} /></button>
                  <button onClick={() => alert(`Edit: ${pet.name}`)} className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50" title="Edit"><Edit2 size={18} /></button>
                  <button onClick={() => confirm(`Are you sure you want to delete ${pet.name}'s listing?`)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50" title="Delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedPets.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <p>No pet listings found matching your search criteria.</p>
            </div>
        )}
      </div>
      
    </div>
  );
};

export default ManagePets;
