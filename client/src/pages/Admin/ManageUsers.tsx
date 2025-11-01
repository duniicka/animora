import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  BarChart2,
  Trash2,
  Edit2,
  Eye,
  ChevronUp,
  ChevronDown,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router';

// --- Types and Interfaces (taken from AdminDashboard) ---
type AppView = 'admin_dashboard' | 'admin_users' | 'admin_pets' | 'admin_settings';

export interface UserStats {
  id: string;
  name: string;
  role: 'Admin' | 'Owner' | 'Adopter';
  listingsCount: number;
  adoptedCount: number;
  applicationRate: number;
  location: string;
  isActive: boolean;
  joinDate: string;
}

// --- Colors (unchanged) ---
const COLORS = {
  primaryTeal: '#00A896',
  darkAccentGreen: '#027878',
  cardBackground: '#FFFFFF',
  backgroundLight: '#F5F7FA',
  chartBlue: '#3498DB', 
  chartOrange: '#F39C12', 
  chartGreen: '#2ECC71', 
  chartPurple: '#9B59B6', 
  chartRed: '#E74C3C',
  chartGray: '#BDC3C7',
};

// --- SIMULATED DATA ---

const ALL_DEMO_USERS: UserStats[] = [
  { id: 'admin_0', name: 'System Admin', role: 'Admin', listingsCount: 0, adoptedCount: 0, applicationRate: 0, location: 'HQ', isActive: true, joinDate: '2023-01-01' },
  { id: 'owner_1', name: 'Rescue Center A', role: 'Owner', listingsCount: 5, adoptedCount: 3, applicationRate: 0.8, location: 'New York', isActive: true, joinDate: '2023-03-15' },
  { id: 'owner_2', name: 'Private Rehoming', role: 'Owner', listingsCount: 2, adoptedCount: 0, applicationRate: 0.3, location: 'Los Angeles', isActive: true, joinDate: '2023-05-20' },
  { id: 'owner_3', name: 'Dallas Shelter', role: 'Owner', listingsCount: 8, adoptedCount: 4, applicationRate: 1.2, location: 'Dallas-Austin Hub', isActive: true, joinDate: '2023-07-01' },
  { id: 'owner_4', name: 'New Owner 1', role: 'Owner', listingsCount: 1, adoptedCount: 0, applicationRate: 0.1, location: 'Regional Suburb', isActive: false, joinDate: '2024-01-10' },
  { id: 'adopter_1', name: 'Sarah J.', role: 'Adopter', listingsCount: 0, adoptedCount: 1, applicationRate: 0, location: 'New York', isActive: true, joinDate: '2024-02-01' },
  { id: 'adopter_2', name: 'Mike T.', role: 'Adopter', listingsCount: 0, adoptedCount: 0, applicationRate: 0, location: 'Los Angeles', isActive: true, joinDate: '2024-04-10' },
  { id: 'owner_5', name: 'Inactive Handler', role: 'Owner', listingsCount: 0, adoptedCount: 0, applicationRate: 0, location: 'New York', isActive: false, joinDate: '2023-02-28' },
];

// --- Helper Functions ---
const getRoleColor = (role: UserStats['role'] | string) => {
    switch (role) {
        case 'Owner': return COLORS.primaryTeal;
        case 'Admin': return COLORS.chartBlue;
        case 'Adopter': return COLORS.chartOrange;
        default: return COLORS.chartGray;
    }
};

// --- Main Component ---

const ManageUsers: React.FC<{
  users?: UserStats[];
  navigate: (view: AppView) => void;
}> = ({ users = ALL_DEMO_USERS, navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'All' | UserStats['role']>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'joinDate' | 'listingsCount' | 'adoptedCount'>('joinDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filtering and Sorting Logic
  const filteredAndSortedUsers = useMemo(() => {
    let filteredList = users.filter(user => user.role !== 'Admin'); // Admins are hidden

    // Search
    if (searchTerm) {
      filteredList = filteredList.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role Filter
    if (filterRole !== 'All') {
      filteredList = filteredList.filter(user => user.role === filterRole);
    }
    
    // Status Filter
    if (filterStatus === 'Active') {
        filteredList = filteredList.filter(user => user.isActive);
    } else if (filterStatus === 'Inactive') {
        filteredList = filteredList.filter(user => !user.isActive);
    }

    // Sorting
    filteredList.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'joinDate') {
        comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
      } else if (sortBy === 'listingsCount') {
        comparison = a.listingsCount - b.listingsCount;
      } else if (sortBy === 'adoptedCount') {
        comparison = a.adoptedCount - b.adoptedCount;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filteredList;
  }, [users, searchTerm, filterRole, filterStatus, sortBy, sortDirection]);

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
        <Users className="mr-3" size={32} /> User & Owner Management
      </h1>

      {/* --- Filter & Action Bar --- */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4" style={{ borderColor: COLORS.primaryTeal }}>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-1/3">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search: Name, Location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 flex items-center"><Filter size={16} className="mr-1" /> Role:</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'All' | UserStats['role'])}
              className="py-3 px-4 border border-gray-300 rounded-xl bg-white"
            >
              <option value="All">All Roles</option>
              <option value="Owner">Owners/Rescuers</option>
              <option value="Adopter">Adopters</option>
            </select>
          </div>
          
           {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 flex items-center"><Activity size={16} className="mr-1" /> Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Active' | 'Inactive')}
              className="py-3 px-4 border border-gray-300 rounded-xl bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Add New User Button (Simulated) */}
          <button
            onClick={() => alert("New User Creation Form will open...")}
            className="w-full md:w-auto text-white font-bold py-3 px-6 rounded-xl shadow-md transition duration-300 hover:bg-teal-700 flex items-center justify-center text-sm"
            style={{ backgroundColor: COLORS.darkAccentGreen }}
          >
            <PlusCircle className="mr-2" size={20} />
            Add New User
          </button>
        </div>
      </div>

      {/* --- Users Table --- */}
      <div className="bg-white p-8 rounded-2xl shadow-xl overflow-x-auto">
        <h3 className="text-2xl font-bold mb-6 border-b pb-3" style={{ color: COLORS.primaryTeal }}>
          Total Users: {filteredAndSortedUsers.length}
        </h3>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Table Headers with Sort */}
              {[{ key: 'name', label: 'Name/Organization' }, { key: 'role', label: 'Role' }, { key: 'location', label: 'Location' }, 
               { key: 'listingsCount', label: 'Listings' }, { key: 'adoptedCount', label: 'Adopted' }, 
               { key: 'joinDate', label: 'Join Date' }, { key: 'isActive', label: 'Status' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => key !== 'role' && key !== 'location' && key !== 'isActive' && handleSort(key as typeof sortBy)}
                  className={`px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${key !== 'role' && key !== 'location' && key !== 'isActive' ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                >
                  <div className="flex items-center">
                    {label}
                    {key !== 'role' && key !== 'location' && key !== 'isActive' && <SortIcon column={key as typeof sortBy} />}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition duration-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    style={{ backgroundColor: getRoleColor(user.role), color: COLORS.cardBackground, opacity: 0.9 }}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.listingsCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{user.adoptedCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.joinDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => alert(`View: ${user.name}`)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"><Eye size={18} /></button>
                  <button onClick={() => alert(`Edit: ${user.name}`)} className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"><Edit2 size={18} /></button>
                  <button onClick={() => confirm(`Are you sure you want to delete user ${user.name}?`)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedUsers.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <p>No users found matching your search criteria.</p>
            </div>
        )}
      </div>
      
    </div>
  );
};

export default ManageUsers;
