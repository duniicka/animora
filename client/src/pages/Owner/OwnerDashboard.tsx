import React, { useMemo } from 'react';
import {
  ListTodo,
  CheckCircle,
  Hourglass,
  Home,
  PlusCircle,
  BarChart2,
  PieChart,
  MapPin,
  Heart,
  Calendar,
  Zap,
  Tag,
  Clock,
  User,
} from 'lucide-react';
import { Link } from 'react-router';

// --- Types and Interfaces (Unchanged) ---
type AppView = 'owner_dashboard' | 'owner_add' | 'owner_pets' | 'owner_edit';

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

// --- Colors (Unchanged) ---
const COLORS = {
  primaryTeal: '#00A896',
  darkAccentGreen: '#027878',
  cardBackground: '#FFFFFF',
  backgroundLight: '#F5F7FA',
  chartBlue: '#3498DB', // Dog/Adopted
  chartOrange: '#F39C12', // Cat/Pending
  chartGreen: '#2ECC71', // Rabbit/Available
  chartPurple: '#9B59B6', // Bird
  chartRed: '#E74C3C',
  chartGray: '#BDC3C7',
};

// --- DAIMI DEMO DATALARI ---

// Bu data massiv boş olsa belə istifadə olunacaq.
const DEFAULT_DEMO_PETS: Pet[] = [
  { id: 1, name: 'Buster', type: 'Dog', breed: 'Lab', age: 3, location: 'New York', status: 'Available', imageTexts: [], description: '', temperament: [], health: 'Healthy', ownerId: 'demo' },
  { id: 2, name: 'Mittens', type: 'Cat', breed: 'Siamese', age: 1, location: 'Los Angeles', status: 'Pending', imageTexts: [], description: '', temperament: [], health: 'Vaccinated', ownerId: 'demo' },
  { id: 3, name: 'Tweety', type: 'Bird', breed: 'Canary', age: 2, location: 'Dallas-Austin Hub', status: 'Adopted', imageTexts: [], description: '', temperament: [], health: 'Healthy', ownerId: 'demo' },
  { id: 4, name: 'Hoppy', type: 'Rabbit', breed: 'Holland Lop', age: 0, location: 'Regional Suburb', status: 'Available', imageTexts: [], description: '', temperament: [], health: 'Healthy', ownerId: 'demo' },
  { id: 5, name: 'Shadow', type: 'Cat', breed: 'Persian', age: 5, location: 'New York', status: 'Available', imageTexts: [], description: '', temperament: [], health: 'Healthy', ownerId: 'demo' },
];

const generateDummyData = (pets: Pet[]) => {
  const petsToUse = pets.length > 0 ? pets : DEFAULT_DEMO_PETS;
  
  // 1. Core Stats
  const totalShared = petsToUse.length;
  const availableCount = petsToUse.filter(p => p.status === 'Available').length;
  const pendingCount = petsToUse.filter(p => p.status === 'Pending').length;
  const adoptedCount = petsToUse.filter(p => p.status === 'Adopted').length;

  // 2. Pet Type Counts
  const petTypeCounts = petsToUse.reduce((acc, pet) => {
    acc[pet.type] = (acc[pet.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 3. Monthly Adoption Trend (Fictional over the last 30 days)
  const monthlyAdoptions = Array(30)
    .fill(0)
    .map((_, i) => ({
      date: new Date(new Date().getTime() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      adoptions: Math.floor(Math.random() * 5) + (i > 20 ? 10 : 0),
    }));

  // 4. Location Distribution (Fictional)
  const locationCounts = petsToUse.reduce((acc, pet) => {
    const fictionalLocation = pet.location.includes('New York')
      ? 'New York Area'
      : pet.location.includes('Los Angeles')
      ? 'Los Angeles Metro'
      : pet.location.includes('Dallas-Austin Hub')
      ? 'Dallas-Austin Hub'
      : 'Regional Suburb';
    acc[fictionalLocation] = (acc[fictionalLocation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 5. Fictional Recent Applications List
  const recentApplications = [
    { id: 101, petName: 'Mittens', petId: 2, applicant: 'Sarah J.', status: 'Reviewing', date: '2 hours ago', iconColor: COLORS.chartOrange },
    { id: 102, petName: 'Buster', petId: 1, applicant: 'John P.', status: 'Approved', date: '1 day ago', iconColor: COLORS.chartGreen },
    { id: 103, petName: 'Shadow', petId: 5, applicant: 'Mike T.', status: 'Reviewing', date: '3 days ago', iconColor: COLORS.chartOrange },
    { id: 104, petName: 'Hoppy', petId: 4, applicant: 'Alice R.', status: 'Approved', date: '5 days ago', iconColor: COLORS.chartGreen },
  ].slice(0, 5); 

  // 6. Fictional Latest Listings List
  const latestListings = petsToUse
    .slice(0, 5) 
    .map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      status: p.status,
      date: `${Math.floor(Math.random() * 10) + 1} days ago`,
    }))
    .sort((a, b) => (a.id < b.id ? 1 : -1));

  return { totalShared, availableCount, pendingCount, adoptedCount, petTypeCounts, monthlyAdoptions, locationCounts, recentApplications, latestListings };
};

// --- Visual Components (unchanged from the last response as they were already detailed) ---
// (StatCard, DistributionBar, FictionalAdoptionLineChart, LocationPieChart, RecentActivityCard, LatestListingCard are all reused from the highly detailed previous version)

const getStatusColor = (status: Pet['status'] | string) => {
    switch (status) {
        case 'Available':
        case 'Approved':
            return COLORS.chartGreen;
        case 'Pending':
        case 'Reviewing':
            return COLORS.chartOrange;
        case 'Adopted':
        case 'Cancelled':
            return COLORS.chartBlue;
        default:
            return COLORS.primaryTeal;
    }
};

const StatCard: React.FC<{ title: string; value: number; color: string; icon: React.ReactNode; }> = ({ title, value, color, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-xl transition duration-300 hover:shadow-2xl hover:scale-[1.02] border-t-4" style={{ borderColor: color }}>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-sm font-semibold uppercase text-gray-500">{title}</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">{value}</p>
            </div>
            <div className="text-5xl opacity-20" style={{ color }}>{icon}</div>
        </div>
    </div>
);

const DistributionBar: React.FC<{ type: string; count: number; maxCount: number }> = ({ type, count, maxCount }) => {
    const getTypeColor = (t: string) => t === 'Dog' ? COLORS.chartBlue : t === 'Cat' ? COLORS.chartOrange : t === 'Rabbit' ? COLORS.chartGreen : COLORS.chartPurple;
    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1 text-sm">
                <span className="font-semibold">{type}</span>
                <span>{count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full" style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: getTypeColor(type) }} />
            </div>
        </div>
    );
};

const FictionalAdoptionLineChart: React.FC<{ data: { date: string; adoptions: number }[] }> = ({ data }) => {
    const chartData = data.slice(-10);
    const maxAdoptions = Math.max(...chartData.map(d => d.adoptions), 1);
    const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1)) * 100;
        const y = 100 - (d.adoptions / maxAdoptions) * 90;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-inner">
            <h4 className="text-sm font-semibold mb-3 text-gray-600 flex items-center">
                <Heart className="mr-2 text-red-500" size={16} /> Adoption Rate (Last 10 Days)
            </h4>
            <div className="h-28 relative">
                <div className="absolute top-0 w-full h-full border-l border-gray-300">
                    <div className="absolute w-full border-t border-dashed border-gray-200" style={{ top: '25%' }}></div>
                    <div className="absolute w-full border-t border-dashed border-gray-200" style={{ top: '50%' }}></div>
                    <div className="absolute w-full border-t border-dashed border-gray-200" style={{ top: '75%' }}></div>
                </div>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute top-0 left-0">
                    <polyline fill="none" stroke={COLORS.primaryTeal} strokeWidth="2" points={points} />
                    {chartData.map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 100;
                        const y = 100 - (d.adoptions / maxAdoptions) * 90;
                        return (
                            <circle key={i} cx={x} cy={y} r="1.5" fill={COLORS.darkAccentGreen}>
                                <title>{`${d.date}: ${d.adoptions} Adoptions`}</title>
                            </circle>
                        );
                    })}
                </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{chartData[0]?.date}</span>
                <span>{chartData[chartData.length - 1]?.date}</span>
            </div>
        </div>
    );
};

const LocationPieChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
    const total = Object.values(data).reduce((sum, count) => sum + count, 0);
    const colors = [COLORS.chartBlue, COLORS.chartOrange, COLORS.chartGreen, COLORS.chartPurple];

    let cumulativePercent = 0;
    const pieSegments = Object.entries(data).map(([location, count], index) => {
        const percentage = (count / total) * 100;
        const color = colors[index % colors.length];
        const segment = { color, percentage, start: cumulativePercent };
        cumulativePercent += percentage;
        return segment;
    });

    return (
        <div className="mt-6 border-t pt-6">
            <h4 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                <MapPin className="mr-2 text-red-500" size={20} /> Geographic Focus
            </h4>
            <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full flex-shrink-0" style={{ background: `conic-gradient(${pieSegments.map(s => `${s.color} ${s.start}% ${s.start + s.percentage}%`).join(', ')})`, boxShadow: '0 0 0 8px #f5f5f5 inset' }}>
                    <span className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-700">{total}</span>
                </div>
                <div className="space-y-2 flex-grow">
                    {Object.entries(data).map(([location, count], index) => (
                        <div key={location} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
                                <span className="text-sm font-medium text-gray-700">{location}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{count} ({((count / total) * 100).toFixed(1)}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const RecentActivityCard: React.FC<{ title: string; petName: string; applicant: string; status: string; date: string; iconColor: string; }> = ({ petName, applicant, status, date, iconColor }) => (
    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition duration-150 border border-gray-200">
        <div className="p-3 rounded-full mr-4" style={{ backgroundColor: iconColor, opacity: 0.1 }}>
            <Hourglass size={20} style={{ color: iconColor }} />
        </div>
        <div className="flex-grow">
            <p className="font-semibold text-gray-800 truncate">{petName} - {status}</p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
                <User size={12} className="mr-1" />{applicant}
                <Clock size={12} className="ml-4 mr-1" />{date}
            </div>
        </div>
        <Tag size={20} className="text-gray-400" />
    </div>
);

const LatestListingCard: React.FC<{ name: string; type: Pet['type']; status: Pet['status']; date: string; }> = ({ name, type, status, date }) => (
    <div className="flex justify-between items-center py-3 border-b last:border-b-0">
        <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: getStatusColor(status) }}></div>
            <span className="font-medium text-gray-800">{name}</span>
            <span className="text-xs text-gray-500 ml-2">({type})</span>
        </div>
        <div className="text-right">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full" style={{ color: getStatusColor(status), backgroundColor: getStatusColor(status), opacity: 0.1 }}>
                {status}
            </span>
            <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
    </div>
);


// --- Main Dashboard Component ---

const OwnerDashboard: React.FC<{
  pets: Pet[];
  navigate: (view: AppView) => void;
  currentOwnerId: string;
}> = ({ pets, navigate, currentOwnerId }) => {
  // 1. Filter real pets
  const realOwnerPets = pets.filter(p => p.ownerId === currentOwnerId);

  // 2. Generate Demo/Real Data
  const { 
    totalShared, 
    availableCount, 
    pendingCount, 
    adoptedCount, 
    petTypeCounts, 
    monthlyAdoptions, 
    locationCounts, 
    recentApplications, 
    latestListings 
  } = useMemo(
    // ALWAYS pass the real pets array to determine if we use the default data.
    () => generateDummyData(realOwnerPets),
    [realOwnerPets],
  );
    
  // Data for DistributionBar
  const maxCount = Math.max(...Object.values(petTypeCounts), 1);


  return (
    <div className="space-y-10">
      <h1
        className="text-4xl font-extrabold pb-3 mb-6 border-b-4 border-gray-200 flex items-center"
        style={{ color: COLORS.darkAccentGreen }}
      >
        <BarChart2 className="mr-3" size={32} /> Owner Management Dashboard
      </h1>

      {/* --- Key Performance Indicators (KPIs) --- */}
      <section>
        <h2 className="text-2xl font-bold mb-5 text-gray-700 border-b pb-2">Adoption Pipeline Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            title="Total Shared Listings"
            value={totalShared}
            color={COLORS.primaryTeal}
            icon={<ListTodo size={50} />}
          />
          <StatCard
            title="Currently Available"
            value={availableCount}
            color={COLORS.chartGreen}
            icon={<CheckCircle size={50} />}
          />
          <StatCard
            title="Pending Applications"
            value={pendingCount}
            color={COLORS.chartOrange}
            icon={<Hourglass size={50} />}
          />
          <StatCard
            title="Successfully Adopted"
            value={adoptedCount}
            color={COLORS.chartBlue}
            icon={<Home size={50} />}
          />
        </div>
      </section>

      {/* --- Charts and Quick Actions --- */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listing Distribution & Performance - Span 2 Columns (ALWAYS FULL) */}
          <div
            className="bg-white p-8 rounded-2xl shadow-xl space-y-6 lg:col-span-2 border-t-4"
            style={{ borderColor: COLORS.darkAccentGreen }}
          >
            <h3 className="text-2xl font-bold border-b pb-3 flex items-center" style={{ color: COLORS.primaryTeal }}>
              <PieChart className="mr-2" size={24} /> Listing Distribution & Performance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-700">Type Breakdown</h4>
                    {/* ALWAYS USE petTypeCounts (which now has data) */}
                    {Object.entries(petTypeCounts).map(([type, count]) => (
                            <DistributionBar key={type} type={type} count={count} maxCount={maxCount} />
                        ))
                    }
                </div>
                <div>
                    {/* ENHANCED LINE CHART (ALWAYS FULL) */}
                    <FictionalAdoptionLineChart data={monthlyAdoptions} />

                    {/* ENHANCED PIE CHART (ALWAYS FULL) */}
                    <LocationPieChart data={locationCounts} />
                </div>
            </div>
            
          </div>

          {/* Latest Listings - Span 1 Column (ALWAYS FULL) */}
          <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6 flex flex-col">
            <h3 className="text-2xl font-bold border-b pb-3" style={{ color: COLORS.primaryTeal }}>
              Latest Listings
            </h3>

            <div className="flex-grow overflow-y-auto">
              {latestListings.map(listing => (
                  <LatestListingCard key={listing.id} {...listing} />
              ))}
            </div>

            <div className="space-y-4 pt-4 mt-auto border-t">
              <Link
                to="/owner/add-pet"
                onClick={() => navigate('owner_add')}
                className="w-full text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 hover:bg-teal-700 flex items-center justify-center text-lg transform hover:scale-[1.01]"
                style={{ backgroundColor: COLORS.darkAccentGreen }}
                title="Add New Pet Profile"
              >
                <PlusCircle className="mr-3" size={20} />
                Create New Listing
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* --- Recent Activity/Applications List (ALWAYS FULL) --- */}
      <section>
        <h2 className="text-2xl font-bold mb-5 text-gray-700 border-b pb-2 flex items-center">
            <Calendar className="mr-2" size={24} /> Recent Application Activity
        </h2>
        <div 
            className="bg-white p-8 rounded-2xl shadow-xl border-t-4"
            style={{ borderColor: COLORS.chartOrange }}
        >
            <h3 className="text-xl font-bold border-b pb-3 mb-4" style={{ color: COLORS.chartOrange }}>
              Top 5 Application Pipeline Events
            </h3>
            <div className="space-y-4">
                {/* ALWAYS USE recentApplications (which now has data) */}
                {recentApplications.map(app => (
                        <RecentActivityCard
                            key={app.id}
                            title="Application Status Update"
                            petName={app.petName}
                            applicant={app.applicant}
                            status={app.status}
                            date={app.date}
                            iconColor={app.iconColor}
                        />
                    ))
                }
            </div>
            <div className="mt-6 text-center">
                <Link 
                    to="/owner/applications" 
                    className="text-sm font-semibold"
                    style={{ color: COLORS.primaryTeal }}
                >
                    View All Applications &rarr;
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default OwnerDashboard;