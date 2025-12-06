import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Save, MessageSquare, ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

// --- Interface Definitions ---
export interface Pet {
  id: string;
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

// --- Color Constants ---
const COLORS = {
  primaryTeal: '#00A896',
  darkAccentGreen: '#027878',
  redAlert: '#E74C3C',
  successGreen: '#2ECC71',
};

// --- Mock Toast Component ---
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const ToastNotification: React.FC<{ toasts: Toast[] }> = ({ toasts }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-2xl flex items-center min-w-[250px] transition-all duration-300 transform ${
            toast.type === 'success' 
              ? 'bg-white border-l-4 border-l-successGreen text-gray-800'
              : 'bg-white border-l-4 border-l-redAlert text-gray-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={20} className="text-successGreen mr-3" />
          ) : (
            <XCircle size={20} className="text-redAlert mr-3" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

// --- Confirmation Modal ---
const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: 'save' | 'delete';
}> = ({ isOpen, onClose, onConfirm, title, message, type }) => {
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
        className={`relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 ${type === 'delete' ? 'bg-red-100' : 'bg-teal-100'} rounded-full flex items-center justify-center`}>
            {type === 'delete' ? (
              <Trash2 className={`w-8 h-8 ${type === 'delete' ? 'text-red-500' : 'text-teal-500'}`} />
            ) : (
              <Save className={`w-8 h-8 text-teal-500`} />
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {title}
        </h3>

        <p className="text-center text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 ${type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'} text-white font-semibold rounded-xl transition-all duration-200`}
          >
            Yes, {type === 'delete' ? 'Delete' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- EditPet Component ---
const EditPet: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<Pet>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const pet = formData as Pet;

  // Fetch pet data
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:5000/api/pets/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setFormData({
            id: data.pet._id,
            name: data.pet.name,
            type: data.pet.type,
            breed: data.pet.breed,
            age: data.pet.age,
            location: data.pet.location,
            status: data.pet.status,
            description: data.pet.description,
            temperament: data.pet.temperament || [],
            health: data.pet.health,
            imageTexts: [data.pet.imageUrl || `${data.pet.name}+${data.pet.type}`],
            ownerId: data.pet.ownerId
          });
        } else {
          addToast('Failed to fetch pet details', 'error');
          setTimeout(() => navigate('/owner/my-pets'), 2000);
        }
      } catch (error) {
        console.error('Fetch pet error:', error);
        addToast('Failed to fetch pet details', 'error');
        setTimeout(() => navigate('/owner/my-pets'), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPet();
    }
  }, [id, navigate]);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const toastId = Date.now();
    const newToast: Toast = { id: toastId, message, type };
    
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 3000);
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setShowSaveModal(false);
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/pets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          breed: formData.breed,
          age: formData.age,
          location: formData.location,
          status: formData.status,
          description: formData.description,
          temperament: formData.temperament,
          health: formData.health
        })
      });

      const data = await response.json();

      if (data.success) {
        addToast('Pet details updated successfully!', 'success');
        setTimeout(() => {
          navigate('/owner/my-pets');
        }, 1000);
      } else {
        addToast('Failed to update pet: ' + data.message, 'error');
      }
    } catch (error) {
      console.error('Update pet error:', error);
      addToast('Failed to update pet. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/pets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        addToast(`${pet.name} has been deleted.`, 'error');
        setTimeout(() => {
          navigate('/owner/my-pets');
        }, 1000);
      } else {
        addToast('Failed to delete pet: ' + data.message, 'error');
      }
    } catch (error) {
      console.error('Delete pet error:', error);
      addToast('Failed to delete pet. Please try again.', 'error');
    }
  };

  // --- Style Helpers ---
  const getStatusStyle = (status: Pet['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-700 border-green-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-400';
      case 'Adopted':
        return 'bg-blue-100 text-blue-700 border-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-400';
    }
  };

  const StatBox: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-md font-semibold text-gray-800">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: COLORS.primaryTeal }}></div>
          <p className="text-gray-600 font-semibold">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet.name) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-600">Pet not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <ToastNotification toasts={toasts} />

      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        {/* Back Button */}
        <button
          onClick={() => navigate('/owner/my-pets')}
          className="flex items-center text-lg font-semibold text-gray-600 hover:text-gray-900 transition duration-200"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Pet List
        </button>

        <h1 className="text-3xl font-extrabold" style={{ color: COLORS.darkAccentGreen }}>
          <Edit size={28} className="inline mr-2" /> Edit Pet: {pet.name}
        </h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setShowSaveModal(true); }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. Pet Image and Stats Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="h-72 overflow-hidden rounded-2xl relative shadow-xl border-t-8"
            style={{ borderColor: COLORS.primaryTeal }}
          >
            <img 
              src={
                pet.imageTexts?.[0] && pet.imageTexts[0].startsWith('http')
                  ? pet.imageTexts[0]
                  : `https://placehold.co/400x288/${COLORS.primaryTeal.substring(1)}/FFFFFF?text=${(pet.imageTexts?.[0] || `${pet.name}+${pet.type}`).replace(/\s/g, '+')}`
              }
              alt={pet.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = `https://placehold.co/400x288/${COLORS.primaryTeal.substring(1)}/FFFFFF?text=${(pet.imageTexts?.[0] || `${pet.name}+${pet.type}`).replace(/\s/g, '+')}`;
              }}
            />
            <div
              className={`absolute top-4 right-4 text-sm font-bold px-4 py-2 rounded-xl border-2 shadow-lg ${getStatusStyle(pet.status)}`}
            >
              {pet.status}
            </div>
          </div>

          {/* Key Details Box */}
          <div className="bg-white p-5 rounded-xl shadow-lg space-y-4">
            <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-2">Key Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="Type" value={pet.type} />
              <StatBox label="Breed" value={pet.breed} />
              <StatBox label="Age" value={`${pet.age} years`} />
              <StatBox label="Location" value={pet.location} />
            </div>
          </div>

          {/* Chat Button */}
          <button
            onClick={(e) => { e.preventDefault(); navigate('/owner/chat'); }}
            className="w-full py-3 rounded-xl font-semibold transition duration-200 bg-teal-100 text-teal-700 hover:bg-teal-200 border border-teal-400 flex items-center justify-center shadow-md"
          >
            <MessageSquare size={18} className="mr-2" /> View Inquiries
          </button>
        </div>

        {/* 2. Edit Form Panel */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold" style={{ color: COLORS.darkAccentGreen }}>General Information</h3>

          {/* Status Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Adoption Status</label>
            <select
              name="status"
              value={pet.status}
              onChange={handleFormChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 shadow-sm"
            >
              <option value="Available">Available</option>
              <option value="Pending">Pending (Under review)</option>
              <option value="Adopted">Adopted (Finalized)</option>
            </select>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Pet Name</label>
            <input
              type="text"
              name="name"
              value={pet.name}
              onChange={handleFormChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 shadow-sm"
              required
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Description</label>
            <textarea
              name="description"
              value={pet.description}
              onChange={handleFormChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 shadow-sm"
              placeholder="Provide detailed information about the pet."
              required
            />
          </div>

          {/* Health Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Health Notes (Vaccinations/Spay)</label>
            <input
              type="text"
              name="health"
              value={pet.health}
              onChange={handleFormChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 shadow-sm"
              placeholder="Vaccinated, Spayed/Neutered, etc."
            />
          </div>

          {/* Temperament Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Temperament (Comma-separated)</label>
            <input
              type="text"
              name="temperament"
              value={Array.isArray(pet.temperament) ? pet.temperament.join(', ') : pet.temperament || ''}
              onChange={e => setFormData(prev => ({ ...prev, temperament: e.target.value.split(',').map(t => t.trim()) }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 shadow-sm"
              placeholder="Friendly, Playful, Good with kids"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <button
              type="submit"
              disabled={isSaving}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition duration-200 transform hover:scale-[1.01] flex items-center justify-center ${
                isSaving ? 'bg-gray-500 cursor-not-allowed' : 'hover:opacity-95'
              }`}
              style={{ backgroundColor: isSaving ? '' : COLORS.darkAccentGreen }}
            >
              {isSaving ? (
                <RefreshCw size={18} className="mr-2 animate-spin" />
              ) : (
                <Save size={18} className="mr-2" />
              )}
              {isSaving ? 'Saving Changes...' : 'Save All Changes'}
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              disabled={isSaving}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition duration-200 flex items-center justify-center ${
                isSaving ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-red-700'
              }`}
              style={{ backgroundColor: isSaving ? '' : COLORS.redAlert }}
            >
              <Trash2 size={18} className="mr-2" /> Permanently Delete Pet
            </button>
          </div>
        </div>
      </form>

      {/* Modals */}
      <ConfirmModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleSaveChanges}
        title="Save Changes?"
        message="Are you sure you want to save these changes to the pet listing?"
        type="save"
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Pet?"
        message={`Are you sure you want to permanently delete ${pet.name}? This action cannot be undone.`}
        type="delete"
      />
    </div>
  );
};

export default EditPet;
