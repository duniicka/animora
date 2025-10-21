import React, { useMemo } from 'react';
import { ListTodo, CheckCircle, Hourglass, Home, PlusCircle } from 'lucide-react';

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

const COLORS = {
  primaryTeal: '#00A896',
  darkAccentGreen: '#027878',
  cardBackground: '#FFFFFF',
  backgroundLight: '#F5F7FA',
  chartBlue: '#3498DB',
  chartOrange: '#F39C12',
  chartGreen: '#2ECC71',
};

const StatCard: React.FC<{
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}> = ({ title, value, color, icon }) => (
  <div
    className="bg-white p-6 rounded-2xl shadow-xl transition duration-300 hover:shadow-2xl hover:scale-[1.02] border-t-4"
    style={{ borderColor: color }}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-semibold uppercase text-gray-500">{title}</p>
        <p className="text-4xl font-extrabold text-gray-900 mt-2">{value}</p>
      </div>
      <div className="text-5xl opacity-20" style={{ color }}>{icon}</div>
    </div>
  </div>
);

const OwnerDashboard: React.FC<{
  pets: Pet[];
  navigate: (view: AppView) => void;
  currentOwnerId: string; // pass the logged-in owner id
}> = ({ pets, navigate, currentOwnerId }) => {
  // Filter only this owner's pets
  const ownerPets = pets.filter(p => p.ownerId === currentOwnerId);

  const totalShared = ownerPets.length;
  const availableCount = ownerPets.filter(p => p.status === 'Available').length;
  const pendingCount = ownerPets.filter(p => p.status === 'Pending').length;
  const adoptedCount = ownerPets.filter(p => p.status === 'Adopted').length;

  // Distribution by type
  const petTypeCounts = React.useMemo(() => {
    const counts = ownerPets.reduce((acc, pet) => {
      acc[pet.type] = (acc[pet.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  }, [ownerPets]);

  const maxCount = Math.max(...Object.values(petTypeCounts || {}), 1);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Dog':
        return COLORS.chartBlue;
      case 'Cat':
        return COLORS.chartOrange;
      case 'Rabbit':
        return COLORS.chartGreen;
      default:
        return COLORS.primaryTeal; // Bird or any other
    }
  };

  return (
    <div className="space-y-10">
      <h1
        className="text-4xl font-extrabold pb-3 mb-6 border-b-4 border-gray-200"
        style={{ color: COLORS.darkAccentGreen }}
      >
        Welcome to your Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          title="Total Shared"
          value={totalShared}
          color={COLORS.primaryTeal}
          // <ListTodo size={50} />
          icon={React.createElement((() => null) as any) /* replace with <ListTodo size={50}/> */}
        />
        <StatCard
          title="Available"
          value={availableCount}
          color={COLORS.chartGreen}
          // <CheckCircle size={50} />
          icon={React.createElement((() => null) as any) /* replace with <CheckCircle size={50}/> */}
        />
        <StatCard
          title="Pending"
          value={pendingCount}
          color={COLORS.chartOrange}
          // <Hourglass size={50} />
          icon={React.createElement((() => null) as any) /* replace with <Hourglass size={50}/> */}
        />
        <StatCard
          title="Adopted"
          value={adoptedCount}
          color={COLORS.chartBlue}
          // <Home size={50} />
          icon={React.createElement((() => null) as any) /* replace with <Home size={50}/> */}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Type Distribution */}
        <div
          className="bg-white p-8 rounded-2xl shadow-xl space-y-6 lg:col-span-2 border-t-4"
          style={{ borderColor: COLORS.darkAccentGreen }}
        >
          <h3 className="text-2xl font-bold border-b pb-3" style={{ color: COLORS.primaryTeal }}>
            Pet Type Distribution
          </h3>
          <p className="text-sm text-gray-500">
            Current distribution of your shared pets by type (Total: {totalShared}).
          </p>

          <div className="space-y-6 pt-2">
            {Object.keys(petTypeCounts).length > 0 ? (
              Object.entries(petTypeCounts).map(([type, count]) => (
                <div key={type}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-800">{type}</span>
                    <span className="font-extrabold text-lg">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                    <div
                      className="h-4 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                        backgroundColor: getTypeColor(type),
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No pets yet.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
          <h3 className="text-2xl font-bold border-b pb-3" style={{ color: COLORS.primaryTeal }}>
            Quick Actions
          </h3>
          <div className="space-y-4 flex-grow flex flex-col justify-center">
            <button
              className="w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg transition duration-300 hover:bg-teal-700 flex items-center justify-center text-lg transform hover:scale-[1.01]"
              style={{ backgroundColor: COLORS.darkAccentGreen }}
              title="Add New Pet"
            >
              {/* <PlusCircle className="mr-2" size={20} /> */}
              Add New Pet
            </button>

            <button
              className="w-full text-gray-800 font-bold py-4 px-6 rounded-xl shadow-md transition duration-300 border-2 hover:bg-gray-100 flex items-center justify-center text-lg transform hover:scale-[1.01]"
              style={{ borderColor: COLORS.primaryTeal }}
              title="View My Pets"
            >
              {/* <ListTodo className="mr-2" size={20} /> */}
              View My Pets ({totalShared})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
