import React, { useEffect, useState } from 'react';
import { getMyPets } from '../../utils/api';

// Import or declare the Pet type
import type { Pet } from '../../utils/api';

export default function MyPets() {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => { getMyPets().then(setPets); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">My Pets</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow border border-orange-100 overflow-hidden">
            <img src={p.image} alt={p.name} className="w-full h-44 object-cover"/>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-gray-600 text-sm">{p.age} • {p.city}</p>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1 rounded-md border border-orange-200 text-orange-600 hover:bg-orange-50">Edit</button>
                <button className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}