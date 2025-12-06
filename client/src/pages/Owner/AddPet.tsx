import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';
import { 
    PawPrint, 
    Info, 
    Upload, 
    Image as ImageIcon, 
    XCircle, 
    Heart, 
    MapPin, 
    Scale, 
    PlusCircle,
    Check,
    CheckCircle
} from 'lucide-react'; 

const COLORS = {
  primaryTeal: '#00A896',
  darkAccentGreen: '#027878', // Dashboard Title Color
  chartGreen: '#2ECC71',
  chartOrange: '#F39C12',
  backgroundLight: '#F5F7FA', 
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

// --- Reusable Component: Form Section Header (Dashboard style - Unchanged) ---
const SectionHeader: React.FC<{ title: string; icon: React.ReactNode; color: string }> = ({
  title,
  icon,
  color,
}) => (
  <h3
    className="text-2xl font-extrabold pb-3 mb-5 flex items-center border-b border-gray-300" 
    style={{ color: COLORS.darkAccentGreen }} 
  >
    <div className="mr-3 p-2 rounded-full shadow-lg flex-shrink-0" style={{ backgroundColor: color, color: 'white' }}>
      {icon}
    </div>
    <span className="truncate">{title}</span>
  </h3>
);

// --- Success Modal Component ---
const SuccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  petName: string;
}> = ({ isOpen, onClose, petName }) => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <h3 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Success!
        </h3>

        <p className="text-center text-gray-600 mb-6 text-lg">
          <span className="font-semibold text-green-600">{petName}</span> has been added successfully!
        </p>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-200 text-lg"
        >
          View My Pets
        </button>
      </div>
    </div>
  );
};

// --- AddPet Component ---
const AddPet: React.FC = () => {
  const navigate = useNavigate();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedPetName, setAddedPetName] = useState('');

  // --- Handlers (Unchanged) ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
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
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl); 
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      handleRemoveImage();
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('breed', formData.breed);
      formDataToSend.append('age', String(formData.age));
      formDataToSend.append('location', formData.location);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('temperament', JSON.stringify(formData.temperament));
      formDataToSend.append('health', formData.health);
      
      // Add image file if exists
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch(API_ENDPOINTS.pets, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type, browser will set it with boundary for FormData
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        console.log('Pet added successfully:', data.pet);
        
        // Clean up image preview
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
        }
        
        // Show success modal
        setAddedPetName(formData.name);
        setShowSuccessModal(true);
      } else {
        console.error('Failed to add pet:', data.message);
        alert('Failed to add pet: ' + data.message);
      }
    } catch (error) {
      console.error('Add pet error:', error);
      alert('Failed to add pet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/owner/my-pets');
  };

  // --- Dashboard-Inspired & Enhanced CSS Classes (Unchanged) ---
  const inputClasses =
    'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-teal-500/50 focus:border-teal-600 transition duration-200 shadow-inner placeholder:text-gray-400';
  
  const fileInputClasses = `flex flex-col items-center justify-center text-center h-48 p-4 border-4 border-dashed rounded-xl cursor-pointer transition duration-300 transform ${
    imageFile ? 'border-teal-500 bg-teal-100 text-teal-700 shadow-xl' : 'border-gray-300 hover:border-teal-400 hover:bg-gray-100 text-gray-500'
  }`;

  return (
    <div
      className="space-y-10"
      style={{ borderColor: COLORS.darkAccentGreen }} 
    >
      <h1
        className="text-4xl font-extrabold pb-3 mb-4 border-b-4 border-gray-200 flex items-center"
        style={{ color: COLORS.darkAccentGreen }}
      >
        <PlusCircle className="mr-3" size={32} /> List a New Pet for Adoption
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* === COLUMN 1: BASIC DETAILS - REMOVED SIDE BORDER === */}
            <div 
                className="p-6 rounded-2xl bg-gray-50 space-y-6 shadow-xl border-t-4" // Removed 'border border-gray-200'
                style={{ borderColor: COLORS.primaryTeal }}
            >
              <SectionHeader title="Basic Pet Information" icon={<PawPrint size={20} />} color={COLORS.primaryTeal} />

              <label className="block">
                <span className="text-gray-700 font-semibold mb-1 block">Pet Name:</span>
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
                <span className="text-gray-700 font-semibold mb-1 block">Type:</span>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className={`${inputClasses} appearance-none bg-white`}
                >
                  {['Dog', 'Cat', 'Bird', 'Rabbit'].map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold mb-1 block">Breed:</span>
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
                  <span className="text-gray-700 font-semibold mb-1 block">Age (Years):</span>
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
                  <span className="text-gray-700 font-semibold mb-1 block">Location:</span>
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

            {/* === COLUMN 2: MEDIA UPLOAD - REMOVED SIDE BORDER === */}
            <div 
                className="p-6 rounded-2xl bg-gray-50 space-y-6 shadow-xl border-t-4" // Removed 'border border-gray-200'
                style={{ borderColor: COLORS.chartGreen }}
            >
              <SectionHeader title="Pet Imagery & Status" icon={<ImageIcon size={20} />} color={COLORS.chartGreen} />

              <div className="block">
                {imagePreviewUrl ? (
                  // Image Preview state - High Contrast Border
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
                  // File Input state (Drop Zone) - Required Indicator
                  <label className={fileInputClasses}>
                    <input
                      type="file"
                      name="imageFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <Upload size={30} className="mb-2" />
                    <span className="text-lg font-bold">Click or Drag Image Here</span>
                    <p className="text-sm mt-1">JPEG, PNG, or GIF up to 5MB.</p>
                  </label>
                )}
                
                <label className="block mt-6">
                  <span className="text-gray-700 font-semibold mb-1 block">Listing Status:</span>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className={`${inputClasses} appearance-none bg-white`}
                  >
                    <option value="Available">Available (Ready for Adoption)</option>
                    <option value="Pending">Pending (Application in Review)</option>
                    <option value="Adopted">Adopted (Listing Complete)</option>
                  </select>
                </label>

              </div>
            </div>

            {/* === COLUMN 3: HEALTH & DESCRIPTION - REMOVED SIDE BORDER === */}
            <div 
                className="p-6 rounded-2xl bg-gray-50 space-y-6 shadow-xl border-t-4" // Removed 'border border-gray-200'
                style={{ borderColor: COLORS.chartOrange }}
            >
              <SectionHeader title="Health & Temperament" icon={<Heart size={20} />} color={COLORS.chartOrange} />

              <label className="block">
                <span className="text-gray-700 font-semibold mb-1 block">Description:</span>
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
                <span className="text-gray-700 font-semibold mb-1 block">Health Information:</span>
                <div className="relative">
                    <Scale size={18} className="absolute left-3 top-3 text-gray-400" />
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
                <span className="text-gray-700 font-semibold mb-1 block">Temperament (Comma-Separated):</span>
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
        </div>

        {/* === SUBMIT BUTTON (Spans all columns) === */}
        <div className="pt-8 lg:col-span-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white font-extrabold py-5 text-2xl rounded-2xl shadow-xl transition duration-300 transform hover:scale-[1.005] hover:shadow-2xl flex items-center justify-center tracking-wide disabled:bg-gray-400 disabled:cursor-not-allowed"
            style={{ backgroundColor: isSubmitting ? COLORS.primaryTeal : COLORS.darkAccentGreen }} 
          >
            {isSubmitting ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Listing...
                </span>
            ) : (
                <>
                    <Check className="mr-3" size={24} /> Finalize & Activate Listing
                </>
            )}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        petName={addedPetName}
      />
    </div>
  );
};

export default AddPet;