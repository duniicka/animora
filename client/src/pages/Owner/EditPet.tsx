import React, { useState, useCallback } from 'react';
import { Edit, Trash2, Save, MessageSquare, ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

// --- Interface Definitions ---
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

type AppView = 'owner_dashboard' | 'owner_add' | 'owner_pets' | 'owner_edit' | 'owner_chat';

type EditPetProps = {
    setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
    navigate: (view: AppView) => void;
};

// --- Color Constants ---
const COLORS = {
    primaryTeal: '#00A896',
    darkAccentGreen: '#027878',
    redAlert: '#E74C3C',
    successGreen: '#2ECC71',
};

// --- MOCK DATA ---
const MOCK_PET: Pet = {
    id: 999,
    name: 'Rocky',
    type: 'Dog',
    breed: 'German Shepherd',
    age: 2,
    location: 'Baku, Yasamal',
    status: 'Available',
    imageTexts: ['Rocky the Shepherd'],
    description: "Rocky is an energetic, loyal, and highly intelligent two-year-old German Shepherd. He is fully house-trained and great with children, though he needs regular exercise and a yard to run in. He is searching for a loving, active family.",
    temperament: ['Loyal', 'Energetic', 'Intelligent', 'Friendly'],
    health: 'Fully vaccinated, neutered, and microchipped.',
    ownerId: 'O987',
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

// --- EditPet Component ---
const EditPet: React.FC<EditPetProps> = ({ setPets, navigate }) => {
    
    const [formData, setFormData] = useState<Partial<Pet>>(MOCK_PET);
    const [isSaving, setIsSaving] = useState(false); 
    const [toasts, setToasts] = useState<Toast[]>([]); // New state for toasts
    
    const pet = formData as Pet;

    const addToast = useCallback((message: string, type: 'success' | 'error') => {
        const id = Date.now();
        const newToast: Toast = { id, message, type };
        
        setToasts(prev => [...prev, newToast]);

        // Remove toast after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSaving) return;

        setIsSaving(true); // Start loading

        // Mock: 2 second saving period
        setTimeout(() => {
            console.log("MOCK: Changes saved for pet ID:", pet.id);
            
            // Mock: Update pet data
            setPets((prevPets: Pet[]) => prevPets.map((p: Pet) => 
                p.id === pet.id 
                    ? { ...p, ...(formData as Pet) } 
                    : p
            ));
            
            setIsSaving(false); // Stop loading

            // 1. Show Toast Notification
            addToast('Pet details updated successfully!', 'success');
            
            // 2. Navigate after a short delay (for user to see the toast)
            setTimeout(() => {
                navigate('owner_pets'); 
            }, 1000); 
            
        }, 2000); // 2 seconds
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${pet.name}? This action is permanent. (MOCK)`)) {
            
            addToast(`${pet.name} has been deleted.`, 'error');
            
            setTimeout(() => {
                navigate('owner_pets'); 
            }, 1000); 
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


    return (
        <div className="space-y-6">
            {/* Toast Container */}
            <ToastNotification toasts={toasts} /> 
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                
                {/* Back Button (Mock Navigation) */}
                <button
                    onClick={() => navigate('owner_pets')}
                    className="flex items-center text-lg font-semibold text-gray-600 hover:text-gray-900 transition duration-200"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Pet List
                </button>
                
                <h1 className="text-3xl font-extrabold" style={{ color: COLORS.darkAccentGreen }}>
                    <Edit size={28} className="inline mr-2" /> Edit Pet: {pet.name}
                </h1>
            </div>
            
            <form onSubmit={handleSaveChanges} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Pet Image and Stats Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div 
                        className="h-72 overflow-hidden rounded-2xl relative shadow-xl border-t-8"
                        style={{ borderColor: COLORS.primaryTeal }}
                    >
                        <img 
                            src={`https://placehold.co/400x288/${COLORS.primaryTeal.substring(1)}/FFFFFF?text=${(pet.imageTexts?.[0] || `${pet.name}+${pet.type}`).replace(/\s/g, '+')}`} 
                            alt={pet.name} 
                            className="w-full h-full object-cover"
                        />
                         <div
                            className={`absolute top-4 right-4 text-sm font-bold px-4 py-2 rounded-xl border-2 shadow-lg ${getStatusStyle(
                                pet.status
                            )}`}
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

                    {/* Chat Button (Mock Navigation) */}
                    <button
                         onClick={(e) => { e.preventDefault(); navigate('owner_chat'); }}
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
                    
                    {/* Temperament Input (Simple Text Input) */}
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
                            disabled={isSaving} // Disabled during saving
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition duration-200 transform hover:scale-[1.01] flex items-center justify-center ${
                                isSaving ? 'bg-gray-500 cursor-not-allowed' : 'hover:opacity-95'
                            }`}
                            style={{ backgroundColor: isSaving ? '' : COLORS.darkAccentGreen }}
                        >
                            {isSaving ? (
                                // Loading Spinner
                                <RefreshCw size={18} className="mr-2 animate-spin" />
                            ) : (
                                // Normal Icon
                                <Save size={18} className="mr-2" />
                            )}
                            {isSaving ? 'Saving Changes...' : 'Save All Changes'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isSaving} // Disabled during saving
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
        </div>
    );
};

export default EditPet;