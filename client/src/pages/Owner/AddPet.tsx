import React, { useState } from 'react';
import { PawPrint, Info, Upload } from 'lucide-react';

const COLORS = {
  primaryTeal: '#00A896',
  darkAccentGreen: '#027878',
};

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

type AddNewPetFormProps = {
  navigate: (view: string) => void;
  addPet: (pet: Omit<Pet, 'id' | 'ownerId'>) => void;
};

const AddPet: React.FC<AddNewPetFormProps> = ({ navigate, addPet }) => {
  // Local form state (imageTextSingle is only for generating placeholder image text)
  const initialFormState: Omit<Pet, 'id' | 'ownerId' | 'imageTexts'> & { imageTextSingle: string } = {
    name: '',
    type: 'Dog',
    breed: '',
    age: 0,
    location: 'Baku',
    status: 'Available',
    description: '',
    temperament: [],
    health: '',
    imageTextSingle: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemperamentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      temperament: e.target.value
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { imageTextSingle, ...rest } = formData;

    const newPet: Omit<Pet, 'id' | 'ownerId'> = {
      ...rest,
      age: Number(rest.age),
      imageTexts: imageTextSingle ? [imageTextSingle] : [`${rest.name}+${rest.type}`],
    };

    addPet(newPet);
    navigate('owner_pets');
  };

  const inputClasses =
    'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-teal-500 transition duration-200 shadow-sm';

  return (
    <div
      className="bg-white p-10 rounded-2xl shadow-2xl space-y-8 border-t-8"
      style={{ borderColor: COLORS.primaryTeal }}
    >
      <h1 className="text-3xl font-extrabold border-b pb-3" style={{ color: COLORS.darkAccentGreen }}>
        Enter New Pet Details
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Details */}
        <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 space-y-5 shadow-inner">
          <h3 className="text-xl font-bold border-b pb-2 mb-4 text-gray-700 flex items-center">
            <PawPrint className="mr-2 text-teal-600" size={20} /> Basic Details
          </h3>

          <label className="block">
            <span className="text-gray-700 font-medium">Name:</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClasses}
              placeholder="e.g., Max"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Type:</span>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className={inputClasses}
            >
              {['Dog', 'Cat', 'Bird', 'Rabbit'].map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Breed:</span>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
              className={inputClasses}
              placeholder="e.g., Golden Retriever"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-gray-700 font-medium">Age (years):</span>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                required
                className={inputClasses}
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Location:</span>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="e.g., Baku"
              />
            </label>
          </div>
        </div>

        {/* Description & Health */}
        <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 space-y-5 shadow-inner">
          <h3 className="text-xl font-bold border-b pb-2 mb-4 text-gray-700 flex items-center">
            <Info className="mr-2 text-teal-600" size={20} /> Additional Details
          </h3>

          <label className="block">
            <span className="text-gray-700 font-medium">Description:</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={2}
              className={inputClasses}
              placeholder="Short description of the pet"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Health:</span>
            <textarea
              name="health"
              value={formData.health}
              onChange={handleChange}
              required
              rows={1}
              className={inputClasses}
              placeholder="e.g., Healthy, special diet, vaccinated"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Temperament (comma-separated):</span>
            <textarea
              name="temperament"
              value={formData.temperament.join(', ')}
              onChange={handleTemperamentChange}
              rows={1}
              className={inputClasses}
              placeholder="e.g., Friendly, Playful, Calm"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-gray-700 font-medium">Status:</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className={inputClasses}
              >
                <option value="Available">Available</option>
                <option value="Pending">Pending</option>
                <option value="Adopted">Adopted</option>
              </select>
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Image text (placeholder):</span>
              <input
                type="text"
                name="imageTextSingle"
                value={formData.imageTextSingle}
                onChange={handleChange}
                placeholder="e.g., Happy Cat"
                className={inputClasses}
              />
              <p className="text-xs text-gray-500 mt-1">
                Used to generate placeholder image text.
              </p>
            </label>
          </div>
        </div>

        <div className="lg:col-span-2 pt-6">
          <button
            type="submit"
            className="w-full text-white font-bold py-4 text-xl rounded-xl shadow-xl transition duration-300 transform hover:scale-[1.005] hover:shadow-2xl flex items-center justify-center"
            style={{ backgroundColor: COLORS.primaryTeal }}
          >
            <Upload className="mr-2" size={20} /> Share Pet
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPet;
