import React, { useState } from 'react';
import { PawPrint, Info, Upload, Image as ImageIcon, XCircle, Heart, MapPin, Scale, PlusCircle } from 'lucide-react'; // Added new icons

const COLORS = {
  primaryTeal: '#00A896',
  darkAccentGreen: '#027878',
  chartGreen: '#2ECC71', // For success indicators
  chartOrange: '#F39C12', // For warning/pending
};

// --- Interfaces (Unchanged) ---
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

// --- Reusable Component: Form Section Header ---
const SectionHeader: React.FC<{ title: string; icon: React.ReactNode; color: string }> = ({
  title,
  icon,
  color,
}) => (
  <h3
    className="text-xl font-bold border-b pb-2 mb-4 flex items-center"
    style={{ color: COLORS.darkAccentGreen }}
  >
    <div className="mr-2 p-1 rounded-full" style={{ color: color }}>
      {icon}
    </div>
    {title}
  </h3>
);

const AddPet: React.FC<AddNewPetFormProps> = ({ navigate, addPet }) => {
  const initialFormState: Omit<Pet, 'id' | 'ownerId' | 'imageTexts'> = {
    name: '',
    type: 'Dog',
    breed: '',
    age: 0,
    location: 'Baku',
    status: 'Available',
    description: '',
    temperament: [],
    health: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // --- Handlers (Slightly simplified/reused) ---

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    
    // Handle number input from a string input field
    const finalValue = type === 'number' ? Number(value) : value;
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous URL object before creating a new one
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl); 
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      handleRemoveImage(); // Clear if no file selected
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPet: Omit<Pet, 'id' | 'ownerId'> = {
      ...formData,
      age: Number(formData.age), // Ensure age is a number
      // Generate placeholder text based on whether an image was provided
      imageTexts: imageFile 
        ? [`${formData.name} Photo - ${imageFile.name}`]
        : [`${formData.name} Default Image`],
    };

    addPet(newPet);

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    
    // Optionally navigate back to the pet list or dashboard
    navigate('owner_pets');
  };

  // --- CSS Classes ---
  const inputClasses =
    'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-teal-500/50 transition duration-200 shadow-sm placeholder:text-gray-400';
  
  // Custom classes for the file input label to make it look like a button/drop zone
  const fileInputClasses = `flex flex-col items-center justify-center text-center h-48 p-4 border-4 border-dashed rounded-xl cursor-pointer transition duration-300 transform ${
    imageFile ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-lg' : 'border-gray-300 hover:border-teal-400 hover:bg-gray-100 text-gray-500'
  }`;

  return (
    <div
      className="bg-white p-10 rounded-2xl shadow-2xl space-y-8 border-t-8"
      style={{ borderColor: COLORS.primaryTeal }}
    >
      <h1
        className="text-4xl font-extrabold pb-3 mb-4 border-b-4 border-gray-200 flex items-center"
        style={{ color: COLORS.darkAccentGreen }}
      >
        <PlusCircle className="mr-3" size={32} /> List a New Pet for Adoption
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* === COLUMN 1: BASIC DETAILS === */}
        <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 space-y-6 shadow-md">
          <SectionHeader title="Basic Pet Information" icon={<PawPrint size={20} />} color={COLORS.primaryTeal} />

          <label className="block">
            <span className="text-gray-700 font-medium mb-1 block">Pet Name:</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClasses}
              placeholder="e.g., Max or Whiskers"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium mb-1 block">Type:</span>
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
            <span className="text-gray-700 font-medium mb-1 block">Breed:</span>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
              className={inputClasses}
              placeholder="e.g., Golden Retriever, Siamese"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-gray-700 font-medium mb-1 block">Age (Years):</span>
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
              <span className="text-gray-700 font-medium mb-1 block">Location:</span>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className={`${inputClasses} pl-10`}
                  placeholder="e.g., Baku, New York"
                />
              </div>
            </label>
          </div>
        </div>

        {/* === COLUMN 2: MEDIA UPLOAD === */}
        <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 space-y-6 shadow-md">
          <SectionHeader title="Pet Imagery (Required)" icon={<ImageIcon size={20} />} color={COLORS.chartGreen} />

          <div className="block">
            {imagePreviewUrl ? (
              // Image Preview state
              <div className="relative border-4 border-teal-500 rounded-xl p-3 bg-white shadow-xl group">
                <img
                  src={imagePreviewUrl}
                  alt="Pet Preview"
                  className="w-full h-40 object-cover rounded-lg transition duration-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 p-2 m-2 text-white bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100"
                  aria-label="Remove image"
                >
                  <XCircle size={20} />
                </button>
                <p className="text-sm text-gray-600 mt-2 text-center truncate font-medium">
                  File: {imageFile?.name}
                </p>
              </div>
            ) : (
              // File Input state (Drop Zone)
              <label className={fileInputClasses}>
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required // Make the image upload required
                />
                <Upload size={30} className="mb-2" />
                <span className="text-lg font-semibold">Click or Drag Image Here</span>
                <p className="text-sm mt-1">JPEG, PNG, or GIF up to 5MB.</p>
              </label>
            )}
            
            <label className="block mt-4">
              <span className="text-gray-700 font-medium block mb-1">Status:</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className={`${inputClasses} bg-white`}
              >
                <option value="Available">Available (Ready for Adoption)</option>
                <option value="Pending">Pending (Application in Review)</option>
                <option value="Adopted">Adopted (Listing Complete)</option>
              </select>
            </label>

          </div>
        </div>

        {/* === COLUMN 3: HEALTH & DESCRIPTION === */}
        <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 space-y-6 shadow-md">
          <SectionHeader title="Health & Temperament" icon={<Heart size={20} />} color={COLORS.chartOrange} />

          <label className="block">
            <span className="text-gray-700 font-medium mb-1 block">Description:</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className={inputClasses}
              placeholder="Provide a detailed, compelling description of the pet's personality and needs."
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium mb-1 block">Health Information:</span>
            <div className="relative">
                <Scale size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <textarea
                  name="health"
                  value={formData.health}
                  onChange={handleChange}
                  required
                  rows={2}
                  className={`${inputClasses} pl-10`}
                  placeholder="e.g., Fully vaccinated, Neutered, Special diet (Allergies)"
                />
            </div>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium mb-1 block">Temperament (Comma-Separated):</span>
            <textarea
              name="temperament"
              value={formData.temperament.join(', ')}
              onChange={handleTemperamentChange}
              rows={2}
              className={inputClasses}
              placeholder="e.g., Friendly, Playful, Good with kids"
            />
             <p className="text-xs text-gray-500 mt-1 italic">Separate traits with commas (e.g., Calm, Curious, Loud).</p>
          </label>
        </div>

        {/* === SUBMIT BUTTON (Spans all columns) === */}
        <div className="lg:col-span-3 pt-4">
          <button
            type="submit"
            className="w-full text-white font-extrabold py-5 text-2xl rounded-2xl shadow-xl transition duration-300 transform hover:scale-[1.005] hover:shadow-2xl flex items-center justify-center tracking-wide"
            style={{ backgroundColor: COLORS.darkAccentGreen }}
          >
            <PawPrint className="mr-3" size={24} /> Submit & Activate Pet Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPet;