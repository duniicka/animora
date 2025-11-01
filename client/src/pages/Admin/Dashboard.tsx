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
  Users,
  BookOpen,
  Trello,
  Award, // Yeni ikon: Ən yaxşı owner
  Activity,
} from 'lucide-react';
import { Link } from 'react-router';

// --- Types and Interfaces (Updated) ---
type AppView = 'admin_dashboard' | 'admin_users' | 'admin_pets' | 'admin_settings';

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

export interface UserStats {
  id: string;
  name: string;
  role: 'Admin' | 'Owner' | 'Adopter';
  listingsCount: number;
  adoptedCount: number; // Yeni: Ownerin övladlığa verdiyi pet sayı
  applicationRate: number; // Yeni: Ownerin petlərinin orta müraciət dərəcəsi
  location: string;
  isActive: boolean;
  joinDate: string;
}

// --- Colors (Dəyişmədi) ---
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

// --- SIMULYASIYA DATALARI ---

const ALL_DEMO_PETS: Pet[] = [
  { id: 1, name: 'Buster', type: 'Dog', breed: 'Lab', age: 3, location: 'New York', status: 'Available', imageTexts: [], description: '', temperament: [], health: 'Healthy', ownerId: 'owner_1' },
  { id: 2, name: 'Mittens', type: 'Cat', breed: 'Siamese', age: 1, location: 'Los Angeles', status: 'Pending', imageTexts: [], description: '', temperament: [], health: 'Vaccinated', ownerId: 'owner_2' },
  { id: 3, name: 'Tweety', type: 'Bird', breed: 'Canary', age: 2, location: 'Dallas-Austin Hub', status: 'Adopted', imageTexts: [], description: '', temperament: [], health: 'Healthy', ownerId: 'owner_1' },
  { id: 4, name: 'Hoppy', type: 'Rabbit', breed: 'Holland Lop', age: 0, location: 'Regional Suburb', status: 'Available', imageTexts: [], description: '', temperament: [], health: 'Healthy', ownerId: 'owner_3' },
  { id: 5, name: 'Shadow', type: 'Cat', breed: 'Persian', age: 5, location: 'New York', status: 'Available', imageTexts: [], description: '', temperament: [], health: 'Healthy', ownerId: 'owner_2' },
  { id: 6, name: 'Max', type: 'Dog', breed: 'German Shepherd', age: 4, location: 'Los Angeles', status: 'Adopted', imageTexts: [], description: '', temperament: [], health: 'Healthy', ownerId: 'owner_3' },
  { id: 7, name: 'Luna', type: 'Dog', breed: 'Golden Retriever', age: 1, location: 'New York', status: 'Available', imageTexts: [], description: '', temperament: [], health: 'Healthy', ownerId: 'owner_4' },
];

const ALL_DEMO_USERS: UserStats[] = [
  { id: 'admin_0', name: 'System Admin', role: 'Admin', listingsCount: 0, adoptedCount: 0, applicationRate: 0, location: 'HQ', isActive: true, joinDate: '2023-01-01' },
  { id: 'owner_1', name: 'Rescue Center A', role: 'Owner', listingsCount: 2, adoptedCount: 1, applicationRate: 0.8, location: 'New York', isActive: true, joinDate: '2023-03-15' },
  { id: 'owner_2', name: 'Private Rehoming', role: 'Owner', listingsCount: 2, adoptedCount: 0, applicationRate: 0.3, location: 'Los Angeles', isActive: true, joinDate: '2023-05-20' },
  { id: 'owner_3', name: 'Dallas Shelter', role: 'Owner', listingsCount: 2, adoptedCount: 1, applicationRate: 1.2, location: 'Dallas-Austin Hub', isActive: true, joinDate: '2023-07-01' },
  { id: 'owner_4', name: 'New Owner 1', role: 'Owner', listingsCount: 1, adoptedCount: 0, applicationRate: 0.1, location: 'Regional Suburb', isActive: false, joinDate: '2024-01-10' },
  { id: 'adopter_1', name: 'Sarah J.', role: 'Adopter', listingsCount: 0, adoptedCount: 0, applicationRate: 0, location: 'New York', isActive: true, joinDate: '2024-02-01' },
];


const generateDummyAdminData = (pets: Pet[], users: UserStats[]) => {
  const petsToUse = pets.length > 0 ? pets : ALL_DEMO_PETS;
  const usersToUse = users.length > 0 ? users : ALL_DEMO_USERS;

  // 1. Core Stats
  const totalPets = petsToUse.length;
  const totalUsers = usersToUse.length;
  const activeOwners = usersToUse.filter(u => u.role === 'Owner' && u.isActive).length;
  const totalAdopted = petsToUse.filter(p => p.status === 'Adopted').length;
  const totalOwners = usersToUse.filter(u => u.role === 'Owner').length;

  // 2. Pet Type Counts (Dəyişmədi)
  const petTypeCounts = petsToUse.reduce((acc, pet) => {
    acc[pet.type] = (acc[pet.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 3. Owner Activity Distribution (Yeni)
  const ownerActivityCounts = usersToUse
    .filter(u => u.role === 'Owner')
    .reduce((acc, owner) => {
      let status: 'High Volume' | 'Moderate' | 'Low/Inactive';
      if (owner.adoptedCount >= 1 && owner.listingsCount >= 2) {
        status = 'High Volume';
      } else if (owner.listingsCount > 0 && owner.isActive) {
        status = 'Moderate';
      } else {
        status = 'Low/Inactive';
      }
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  // 4. Top Performing Owners (Yeni)
  const topOwners = usersToUse
    .filter(u => u.role === 'Owner')
    .sort((a, b) => (b.adoptedCount * 10 + b.applicationRate) - (a.adoptedCount * 10 + a.applicationRate))
    .slice(0, 5);

  // 5. Monthly Registration Trend (Dəyişmədi)
  const monthlyRegistrations = Array(30)
    .fill(0)
    .map((_, i) => ({
      date: new Date(new Date().getTime() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      registrations: Math.floor(Math.random() * 3) + (i > 25 ? 5 : 0),
    }));


  // 6. Fictional Recent Activity List (Dəyişmədi)
  const recentActivities = [
    { id: 201, title: 'New Owner Registered', detail: 'Private Rehoming', type: 'Registration', date: '5 minutes ago', iconColor: COLORS.chartGreen },
    { id: 202, title: 'Pet Listing Updated', detail: 'Buster (ID: 1)', type: 'Pet Update', date: '2 hours ago', iconColor: COLORS.chartBlue },
    { id: 203, title: 'Application Approved', detail: 'Mittens (ID: 2)', type: 'Adoption', date: '1 day ago', iconColor: COLORS.chartOrange },
    { id: 204, title: 'New Adopter Signed Up', detail: 'Mike T. (Adopter)', type: 'Registration', date: '3 days ago', iconColor: COLORS.chartGreen },
  ].slice(0, 5);


  return { totalPets, totalUsers, activeOwners, totalAdopted, totalOwners, petTypeCounts, ownerActivityCounts, topOwners, monthlyRegistrations, recentActivities };
};

// --- Visual Components ---

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
    case 'Active':
    case 'High Volume':
      return COLORS.chartGreen;
    case 'Pending':
    case 'Moderate':
      return COLORS.chartOrange;
    case 'Adopted':
    case 'Admin':
      return COLORS.chartBlue;
    case 'Low/Inactive':
      return COLORS.chartRed;
    default:
      return COLORS.primaryTeal;
  }
};

// StatCard - Dəyişmədi
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

// Pet DistributionBar - Dəyişmədi
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

// OwnerActivityPieChart (Yeni)
const OwnerActivityPieChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  const colors = [COLORS.chartGreen, COLORS.chartOrange, COLORS.chartRed]; // High Volume, Moderate, Low/Inactive

  let cumulativePercent = 0;
  const pieSegments = Object.entries(data).map(([activity, count], index) => {
    const percentage = (count / total) * 100;
    const color = colors[index % colors.length];
    const segment = { color, percentage, start: cumulativePercent };
    cumulativePercent += percentage;
    return segment;
  });

  return (
    <div className="mt-6 border-t pt-6">
      <h4 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
        <Activity className="mr-2 text-blue-500" size={20} /> Owner Activity Level
      </h4>
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 rounded-full flex-shrink-0" style={{ background: `conic-gradient(${pieSegments.map(s => `${s.color} ${s.start}% ${s.start + s.percentage}%`).join(', ')})`, boxShadow: '0 0 0 8px #f5f5f5 inset' }}>
          <span className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-700">{total}</span>
        </div>
        <div className="space-y-2 flex-grow">
          {Object.entries(data).map(([activity, count], index) => (
            <div key={activity} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
                <span className="text-sm font-medium text-gray-700">{activity}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{count} ({((count / total) * 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// FictionalRegistrationLineChart - Dəyişmədi (User Qeydiyyat Trendi)
const FictionalRegistrationLineChart: React.FC<{ data: { date: string; registrations: number }[] }> = ({ data }) => {
    const chartData = data.slice(-10);
    const maxRegistrations = Math.max(...chartData.map(d => d.registrations), 1);
    const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1)) * 100;
        const y = 100 - (d.registrations / maxRegistrations) * 90;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-inner">
            <h4 className="text-sm font-semibold mb-3 text-gray-600 flex items-center">
                <Users className="mr-2 text-indigo-500" size={16} /> New User Registrations (Last 10 Days)
            </h4>
            <div className="h-28 relative">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute top-0 left-0">
                    <polyline fill="none" stroke={COLORS.chartPurple} strokeWidth="2" points={points} />
                    {chartData.map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 100;
                        const y = 100 - (d.registrations / maxRegistrations) * 90;
                        return (
                            <circle key={i} cx={x} cy={y} r="1.5" fill={COLORS.chartPurple}>
                                <title>{`${d.date}: ${d.registrations} Registrations`}</title>
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


// TopOwnerCard (Yeni)
const TopOwnerCard: React.FC<{ name: string; adoptedCount: number; applicationRate: number; index: number }> = ({ name, adoptedCount, applicationRate, index }) => (
    <div className={`flex items-center py-3 border-b last:border-b-0 ${index === 0 ? 'bg-yellow-50/50' : ''} hover:bg-gray-50 transition duration-100`}>
        <div className="w-8 text-center font-extrabold text-xl mr-4" style={{ color: index === 0 ? COLORS.chartOrange : COLORS.darkAccentGreen }}>#{index + 1}</div>
        <div className="flex-grow">
            <p className="font-semibold text-gray-800">{name}</p>
            <div className="text-xs text-gray-500 mt-1">
                <span className="mr-3">Adopted: **{adoptedCount}**</span>
                <span>Rate: {applicationRate.toFixed(2)}/gün</span>
            </div>
        </div>
        <div className="p-2 rounded-full" style={{ backgroundColor: COLORS.chartGreen, opacity: 0.1 }}>
            <Award size={20} style={{ color: COLORS.chartGreen }} />
        </div>
    </div>
);

// RecentActivityCard - Dəyişmədi
const RecentActivityCard: React.FC<{ title: string; detail: string; type: string; date: string; iconColor: string; }> = ({ title, detail, type, date, iconColor }) => (
  <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition duration-150 border border-gray-200">
    <div className="p-3 rounded-full mr-4" style={{ backgroundColor: iconColor, opacity: 0.1 }}>
      <Trello size={20} style={{ color: iconColor }} />
    </div>
    <div className="flex-grow">
      <p className="font-semibold text-gray-800 truncate">{title}</p>
      <div className="flex items-center text-xs text-gray-500 mt-1">
        <Zap size={12} className="mr-1" />{detail}
        <Clock size={12} className="ml-4 mr-1" />{date}
      </div>
    </div>
    <Tag size={20} className="text-gray-400" />
  </div>
);


// --- Main Admin Dashboard Component ---

const AdminDashboard: React.FC<{
  pets?: Pet[]; 
  users?: UserStats[]; 
  navigate: (view: AppView) => void;
}> = ({ pets = ALL_DEMO_PETS, users = ALL_DEMO_USERS, navigate }) => {
  
  const { 
    totalPets, 
    totalUsers, 
    activeOwners, 
    totalAdopted, 
    totalOwners,
    petTypeCounts, 
    ownerActivityCounts, 
    topOwners, 
    monthlyRegistrations, 
    recentActivities 
  } = useMemo(
    () => generateDummyAdminData(pets, users as UserStats[]),
    [pets, users],
  );
    
  const maxPetCount = Math.max(...Object.values(petTypeCounts), 1);

  return (
    <div className="space-y-10">
      <h1
        className="text-4xl font-extrabold pb-3 mb-6 border-b-4 border-gray-200 flex items-center"
        style={{ color: COLORS.darkAccentGreen }}
      >
        <BarChart2 className="mr-3" size={32} /> Admin System Overview Dashboard
      </h1>

      {/* --- Key Performance Indicators (KPIs) --- */}
      <section>
        <h2 className="text-2xl font-bold mb-5 text-gray-700 border-b pb-2">System Core Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            title="Total Pets Listed"
            value={totalPets}
            color={COLORS.primaryTeal}
            icon={<ListTodo size={50} />}
          />
          <StatCard
            title="Total Owners/Rescuers"
            value={totalOwners}
            color={COLORS.chartOrange}
            icon={<User size={50} />}
          />
          <StatCard
            title="Active Owners"
            value={activeOwners}
            color={COLORS.chartGreen}
            icon={<Hourglass size={50} />}
          />
          <StatCard
            title="Lifetime Adoptions"
            value={totalAdopted}
            color={COLORS.chartBlue}
            icon={<Home size={50} />}
          />
        </div>
      </section>

      {/* --- Owner Performance & Pet Distribution --- */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Owner & Pet Distribution - Span 2 Columns */}
          <div
            className="bg-white p-8 rounded-2xl shadow-xl space-y-6 lg:col-span-2 border-t-4"
            style={{ borderColor: COLORS.darkAccentGreen }}
          >
            <h3 className="text-2xl font-bold border-b pb-3 flex items-center" style={{ color: COLORS.primaryTeal }}>
              <PieChart className="mr-2" size={24} /> Distribution & Owner Performance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Pet Type Breakdown (All Listings)</h4>
                {Object.entries(petTypeCounts).map(([type, count]) => (
                  <DistributionBar key={type} type={type} count={count} maxCount={maxPetCount} />
                ))}
              </div>
              <div>
                {/* YENİ: OWNER FƏALİYYƏTİ ANALİZİ */}
                <OwnerActivityPieChart data={ownerActivityCounts} />
              </div>
            </div>
            
            <div className="pt-4 border-t">
                 {/* Registration Line Chart */}
                <FictionalRegistrationLineChart data={monthlyRegistrations} />
            </div>
            
          </div>

          {/* Top Owners & Quick Actions - Span 1 Column */}
          <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6 flex flex-col">
            <h3 className="text-2xl font-bold border-b pb-3" style={{ color: COLORS.primaryTeal }}>
              Top Performing Owners
            </h3>

            <div className="flex-grow overflow-y-auto">
              {/* YENİ: TOP OWNER LİSTİ */}
              {topOwners.map((owner, index) => (
                <TopOwnerCard 
                  key={owner.id} 
                  name={owner.name} 
                  adoptedCount={owner.adoptedCount}
                  applicationRate={owner.applicationRate}
                  index={index}
                />
              ))}
            </div>

            <div className="space-y-4 pt-4 mt-auto border-t">
              <Link
                to="/admin/users"
                onClick={() => navigate('admin_users')}
                className="w-full text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 hover:bg-teal-700 flex items-center justify-center text-lg transform hover:scale-[1.01]"
                style={{ backgroundColor: COLORS.darkAccentGreen }}
                title="Manage All Users"
              >
                <BookOpen className="mr-3" size={20} />
                Manage Owners & Users
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* --- Recent System Activity List (Dəyişmədi) --- */}
      <section>
        <h2 className="text-2xl font-bold mb-5 text-gray-700 border-b pb-2 flex items-center">
            <Calendar className="mr-2" size={24} /> Recent System Activity Log
        </h2>
        <div 
            className="bg-white p-8 rounded-2xl shadow-xl border-t-4"
            style={{ borderColor: COLORS.chartOrange }}
        >
            <h3 className="text-xl font-bold border-b pb-3 mb-4" style={{ color: COLORS.chartOrange }}>
              Top 4 Recent Events (Registrations, Updates, Adoptions)
            </h3>
            <div className="space-y-4">
                {recentActivities.map(activity => (
                    <RecentActivityCard
                        key={activity.id}
                        title={activity.title}
                        detail={activity.detail}
                        type={activity.type}
                        date={activity.date}
                        iconColor={activity.iconColor}
                    />
                    ))}
            </div>
            <div className="mt-6 text-center">
                <Link 
                    to="/admin/activity-log" 
                    className="text-sm font-semibold"
                    style={{ color: COLORS.primaryTeal }}
                >
                    View Full Activity Log &rarr;
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;