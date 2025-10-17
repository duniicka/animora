import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPetById, type Pet } from '../../utils/api';

export default function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    if (id !== undefined) {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        fetchPetById(numericId).then(setPet);
      }
    }
  }, [id]);
  if (!pet) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <img src={pet.images?.[0]} alt={pet.name} className="w-full rounded-2xl shadow"/>
        <div className="grid grid-cols-2 gap-4">
          <img src={pet.images?.[1]} alt={pet.name} className="rounded-xl shadow"/>
          <img src={pet.images?.[2]} alt={pet.name} className="rounded-xl shadow"/>
        </div>
        <div className="bg-white rounded-2xl shadow border border-orange-100 p-6">
          <h2 className="text-2xl font-bold">{pet.name}</h2>
          <p className="text-gray-600 mt-2">{pet.description}</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow border border-orange-100 p-6">
          <h3 className="text-xl font-semibold mb-4">Adopt {pet.name}</h3>
          <button className="w-full px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600">Send Adoption Request</button>
        </div>
      </div>
    </div>
  );
}