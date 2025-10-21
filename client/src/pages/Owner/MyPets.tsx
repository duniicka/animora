import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Search, 
    Edit, 
    PawPrint, 
    CheckCircle, 
    Clock, 
    List, 
    XCircle,
    PlusCircle
} from 'lucide-react';

// --- Types & Constants (Enhanced) ---

type Pet = {
    id: number;
    name: string;
    type: 'Dog' | 'Cat' | 'Rabbit' | 'Bird';
    breed: string;
    age: number;
    location: string;
    status: 'Available' | 'Pending' | 'Adopted';
    imageTexts: string[];
    description: string;
    temperament: string[];
    health: string;
    ownerId: string;
};

type FilterStatus = Pet['status'] | 'All';

const COLORS = {
    primaryTeal: '#00A896', // Hover & Secondary Accent
    darkAccentGreen: '#027878', // Main Title & Primary Button
    chartGreen: '#2ECC71',     // Available / Success
    chartOrange: '#F39C12',    // Pending / Warning
    chartBlue: '#3498DB',      // Adopted
    chartRed: '#E74C3C',       // Delete
    backgroundLight: '#F5F7FA',
};

const MOCK_OWNER_ID = 'owner_shelter_123';

const MOCK_PETS: Pet[] = [
    {
        id: 1,
        name: 'Max',
        type: 'Dog',
        breed: 'Golden Retriever',
        age: 2,
        location: 'Baku',
        status: 'Available',
        imageTexts: ['Max+Dog'],
        description: 'Very friendly family dog.',
        temperament: ['Loyal', 'Energetic'],
        health: 'Healthy.',
        ownerId: MOCK_OWNER_ID,
    },
    {
        id: 2,
        name: 'Luna',
        type: 'Cat',
        breed: 'Siamese',
        age: 1,
        location: 'Ganja',
        status: 'Available',
        imageTexts: ['Luna+Cat'],
        description: 'Calm and gentle cat.',
        temperament: ['Calm', 'Playful'],
        health: 'Healthy.',
        ownerId: MOCK_OWNER_ID,
    },
    {
        id: 3,
        name: 'Rocky',
        type: 'Dog',
        breed: 'Pug',
        age: 5,
        location: 'Baku',
        status: 'Pending',
        imageTexts: ['Rocky+Pug'],
        description: 'Loves naps and snacks.',
        temperament: ['Lazy', 'Sweet'],
        health: 'Requires special diet.',
        ownerId: MOCK_OWNER_ID,
    },
    {
        id: 4,
        name: 'Oreo',
        type: 'Cat',
        breed: 'Domestic Shorthair',
        age: 3,
        location: 'Sumqayit',
        status: 'Adopted',
        imageTexts: ['Oreo+Cat'],
        description: 'Already found a home.',
        temperament: ['Independent'],
        health: 'Healthy.',
        ownerId: MOCK_OWNER_ID,
    },
    {
        id: 5,
        name: 'Kira',
        type: 'Rabbit',
        breed: 'Mini Lop',
        age: 1,
        location: 'Baku',
        status: 'Available',
        imageTexts: ['Kira+Rabbit'],
        description: 'Shy but lovely rabbit.',
        temperament: ['Shy', 'Calm'],
        health: 'Healthy.',
        ownerId: MOCK_OWNER_ID,
    },
];

// --- Status Styling Helper (Enhanced) ---
const getStatusStyle = (status: Pet['status']) => {
    switch (status) {
        case 'Available': return { 
            bg: 'bg-green-100', 
            text: 'text-green-700', 
            border: 'border-green-500', 
            icon: <CheckCircle size={16} className="mr-1" />, 
            color: COLORS.chartGreen 
        };
        case 'Pending':   return { 
            bg: 'bg-yellow-100', 
            text: 'text-yellow-700', 
            border: 'border-yellow-500', 
            icon: <Clock size={16} className="mr-1" />, 
            color: COLORS.chartOrange 
        };
        case 'Adopted':   return { 
            bg: 'bg-blue-100', 
            text: 'text-blue-700', 
            border: 'border-blue-500', 
            icon: <PawPrint size={16} className="mr-1" />, 
            color: COLORS.chartBlue 
        };
        default:          return { 
            bg: 'bg-gray-100', 
            text: 'text-gray-700', 
            border: 'border-gray-500', 
            icon: <List size={16} className="mr-1" />, 
            color: COLORS.primaryTeal 
        };
    }
};


// --- MyPets Component ---

const MyPets: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');

    // 1. Data Filtering (Owner ID)
    const ownerPets = useMemo(
        () => MOCK_PETS.filter(p => p.ownerId === MOCK_OWNER_ID),
        []
    );

    // 2. Data Aggregation for Summary Panel
    const stats = useMemo(() => ({
        total: ownerPets.length,
        available: ownerPets.filter(p => p.status === 'Available').length,
        pending: ownerPets.filter(p => p.status === 'Pending').length,
        adopted: ownerPets.filter(p => p.status === 'Adopted').length,
    }), [ownerPets]);


    // 3. Final Filtering (Search Term + Status Filter)
    const filteredPets = useMemo(() => {
        let list = ownerPets;
        const q = searchTerm.toLowerCase();

        // Filter by Status
        if (filterStatus !== 'All') {
            list = list.filter(p => p.status === filterStatus);
        }

        // Filter by Search Term
        if (q) {
            list = list.filter(p =>
                [p.name, p.breed, p.type, p.status, p.location]
                    .filter(Boolean)
                    .some(val => String(val).toLowerCase().includes(q))
            );
        }
        
        return list;

    }, [ownerPets, searchTerm, filterStatus]);

    // --- Components ---

    const renderSummaryPanel = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Total Listings" 
                value={stats.total} 
                icon={<List size={24} />} 
                color={COLORS.darkAccentGreen} 
            />
            <StatCard 
                title="Ready for Adoption" 
                value={stats.available} 
                icon={<PawPrint size={24} />} 
                color={COLORS.chartGreen} 
            />
            <StatCard 
                title="Pending Applications" 
                value={stats.pending} 
                icon={<Clock size={24} />} 
                color={COLORS.chartOrange} 
            />
            <StatCard 
                title="Successfully Adopted" 
                value={stats.adopted} 
                icon={<CheckCircle size={24} />} 
                color={COLORS.chartBlue} 
            />
        </div>
    );

    const renderFilterBar = () => (
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
            
            {/* Search Input */}
            <div 
                className="relative flex-grow bg-white p-4 rounded-xl shadow-lg border-l-4"
                style={{ borderColor: COLORS.primaryTeal }}
            >
                <input
                    type="text"
                    placeholder="Search pets by name, type, breed, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:ring-4 focus:ring-teal-500/50 transition duration-200 text-lg"
                />
                <Search className="absolute left-7 top-7 text-gray-400" size={20} />
            </div>

            {/* Status Filters */}
            <div className="flex space-x-2 p-4 bg-white rounded-xl shadow-lg border-l-4" style={{ borderColor: COLORS.darkAccentGreen }}>
                {([
                    { label: 'All', status: 'All' as FilterStatus, color: COLORS.darkAccentGreen },
                    { label: 'Available', status: 'Available' as FilterStatus, color: COLORS.chartGreen },
                    { label: 'Pending', status: 'Pending' as FilterStatus, color: COLORS.chartOrange },
                    { label: 'Adopted', status: 'Adopted' as FilterStatus, color: COLORS.chartBlue },
                ]).map(({ label, status, color }) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-3 text-sm font-bold rounded-xl transition duration-200 shadow-md ${
                            filterStatus === status 
                                ? 'text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        style={{ 
                            backgroundColor: filterStatus === status ? color : undefined,
                            color: filterStatus === status ? 'white' : 'gray',
                        }}
                    >
                        {label} ({status === 'All' ? ownerPets.length : ownerPets.filter(p => p.status === status).length})
                    </button>
                ))}
            </div>
        </div>
    );
    
    // --- Main Render ---

    return (
        <div className="space-y-10">
            <h1
                className="text-4xl font-extrabold pb-3 border-b-4 border-gray-200 flex items-center"
                style={{ color: COLORS.darkAccentGreen }}
            >
                <List className="mr-3" size={32} /> Manage My Shared Pets
            </h1>

            {/* NEW FEATURE: Summary Panel */}
            {renderSummaryPanel()}
            
            {/* NEW FEATURE: Search & Filter Bar */}
            {renderFilterBar()}

            {/* Pet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPets.length > 0 ? (
                    filteredPets.map(pet => {
                        const style = getStatusStyle(pet.status);
                        const placeholderText = pet.imageTexts?.[0] || `${pet.name}+${pet.type}`;
                        
                        return (
                            <Link
                                key={pet.id}
                                // NOTE: Replace with actual edit route
                                to={`/owner/edit-pet/${pet.id}`}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col transition duration-300 hover:shadow-2xl hover:translate-y-[-2px] cursor-pointer border-t-8"
                                style={{ borderColor: style.color }} // Border color based on Status
                            >
                                <div className="h-40 overflow-hidden relative">
                                    <img
                                        src={`https://placehold.co/400x160/${style.color.substring(1)}/FFFFFF?text=${placeholderText.replace(/\s/g, '+')}`}
                                        alt={pet.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    {/* Status Badge */}
                                    <div
                                        className={`absolute top-3 right-3 text-xs font-bold px-4 py-1.5 rounded-full border-2 shadow-md flex items-center ${style.bg} ${style.text} ${style.border}`}
                                    >
                                        {style.icon} {pet.status}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-bold mb-1" style={{ color: COLORS.darkAccentGreen }}>
                                        {pet.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 font-medium">
                                        {pet.breed} ({pet.type}) — {pet.age} years
                                    </p>

                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                        {pet.description}
                                    </p>

                                    {/* Edit Button - Uses Dark Accent Green */}
                                    <div
                                        className="mt-auto w-full text-sm font-semibold py-3 rounded-xl text-white transition duration-200 transform hover:scale-[0.99] shadow-lg flex items-center justify-center"
                                        style={{ backgroundColor: COLORS.darkAccentGreen }}
                                    >
                                        <Edit className="mr-1" size={16} /> Manage Listing
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="md:col-span-4 text-center p-12 bg-white rounded-2xl text-gray-500 shadow-xl border-4 border-dashed" style={{ borderColor: COLORS.primaryTeal }}>
                        <XCircle className="mx-auto mb-4" size={40} />
                        <h3 className="text-xl font-bold mb-2">
                            {searchTerm || filterStatus !== 'All' 
                                ? `No listings found matching your criteria.`
                                : `You have no shared pets yet.`}
                        </h3>
                        {searchTerm || filterStatus !== 'All' ? (
                             <button onClick={() => { setSearchTerm(''); setFilterStatus('All'); }} className="text-teal-600 font-medium hover:underline mt-2">
                                Clear Filters
                            </button>
                        ) : (
                            <Link to="/owner/add-pet" className="text-teal-600 font-medium hover:underline">
                                Start by listing your first pet!
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- New Feature Component: Statistic Card (Dashboard Style) ---
const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({
    title,
    value,
    icon,
    color,
}) => (
    <div 
        className="bg-white p-5 rounded-xl shadow-xl border-t-4 transition duration-300 hover:shadow-2xl flex justify-between items-center"
        style={{ borderColor: color }}
    >
        <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
            <h2 className="text-4xl font-extrabold" style={{ color: COLORS.darkAccentGreen }}>
                {value}
            </h2>
        </div>
        <div className="p-3 rounded-full shadow-lg flex-shrink-0" style={{ backgroundColor: color, color: 'white' }}>
            {icon}
        </div>
    </div>
);


export default MyPets;