import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
// Assuming ThreeBackground is a component for visual effect, keeping the import for completeness
// import ThreeBackground from '../../components/Background/Background'; 
import {
    Heart, PawPrint, Home, MessageSquare, Briefcase,
    CheckCircle, List, ArrowRight
} from 'lucide-react';

// --- Global Type and Constant Definitions ---

const COLORS = {
    primaryTeal: '#009688',
    darkAccentGreen: '#00796B',
    backgroundLight: '#F8F9FA',
    formBackground: '#FFFFFF',
    submitButton: '#27AE60',
    textDark: '#2C3E50',
};

interface Pet {
    id: string;
    name: string;
    type: 'Dog' | 'Cat' | 'Bird' | 'Rabbit';
    breed: string;
    age: number;
    location: string;
    status: 'Available' | 'Pending' | 'Adopted';
    imageUrl?: string;
    imageTexts: string[];
    description: string;
    temperament: string[];
    health: string;
}

interface AdoptionForm {
    selectedPetId: string | null;
    livingSituation: 'Owner' | 'Renter';
    petExperience: string;
    reasonForAdoption: string;
}

// --- Auxiliary Components ---

// AdoptionFormSection Component
const AdoptionFormSection: React.FC<{
    selectedPet: Pet;
    formData: AdoptionForm;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    error: string | null;
}> = ({ selectedPet, formData, handleChange, handleSubmit, error }) => (
    <section id="adoption-form-section" className="pt-10">
        <h2 className="text-3xl font-bold mb-8 border-b-2 pb-2" style={{ borderColor: COLORS.primaryTeal, color: COLORS.textDark }}>
            <ArrowRight size={24} className="inline mr-3" /> 2. Adoption Application Form: {selectedPet.name}
        </h2>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border-t-8" style={{ borderColor: COLORS.darkAccentGreen }}>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 font-medium border border-red-300">
                    Error: {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Living Situation & Experience */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                        <Briefcase size={20} className="mr-2 text-teal-600" /> Your Information
                    </h3>
                    
                    {/* Living Situation */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="livingSituation" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Home size={18} />
                            <span className="ml-2">Living Situation <span className="text-red-500">*</span></span>
                        </label>
                        <select
                            id="livingSituation"
                            name="livingSituation"
                            value={formData.livingSituation}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl shadow-inner focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition duration-200"
                        >
                            <option value="Owner">Home Owner</option>
                            <option value="Renter">Renter</option>
                        </select>
                    </div>

                    {/* Pet Experience */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="petExperience" className="text-sm font-semibold text-gray-700 flex items-center">
                            <PawPrint size={18} />
                            <span className="ml-2">Previous Pet Experience <span className="text-red-500">*</span></span>
                        </label>
                        <textarea
                            id="petExperience"
                            name="petExperience"
                            value={formData.petExperience}
                            onChange={handleChange}
                            rows={4}
                            placeholder="What pets have you owned before? How did you care for them?"
                            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl shadow-inner focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition duration-200"
                            required
                        ></textarea>
                    </div>

                    {/* Reason for Adoption */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="reasonForAdoption" className="text-sm font-semibold text-gray-700 flex items-center">
                            <MessageSquare size={18} />
                            <span className="ml-2">Why do you want to adopt {selectedPet.name}? <span className="text-red-500">*</span></span>
                        </label>
                        <textarea
                            id="reasonForAdoption"
                            name="reasonForAdoption"
                            value={formData.reasonForAdoption}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Please briefly explain your motivation."
                            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl shadow-inner focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition duration-200"
                            required
                        ></textarea>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full text-white font-bold py-4 text-xl rounded-xl shadow-2xl transition duration-300 transform hover:scale-[1.005] flex items-center justify-center"
                    style={{ backgroundColor: COLORS.submitButton }}
                >
                    <Heart size={20} className="mr-3" /> Submit Application
                </button>
            </form>
        </div>
    </section>
);

// --- PET DETAIL COMPONENT ---

const PetDetail: React.FC<{ pet?: Pet; onReturn?: () => void }> = ({ pet, onReturn }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [currentPet, setCurrentPet] = useState<Pet | null>(pet || null);
    const [loading, setLoading] = useState(!pet);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<AdoptionForm>({
        selectedPetId: null,
        livingSituation: 'Owner',
        petExperience: '',
        reasonForAdoption: '',
    });
    // NEW STATE: Control visibility of the form
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Fetch pet data from API
    useEffect(() => {
        if (pet) {
            setCurrentPet(pet);
            setFormData(prev => ({ ...prev, selectedPetId: pet.id }));
            return;
        }

        const fetchPet = async () => {
            if (!id) {
                setError('Pet ID not found');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(API_ENDPOINTS.petById(id));
                const data = await response.json();

                if (data.success) {
                    const fetchedPet: Pet = {
                        id: data.pet._id,
                        name: data.pet.name,
                        type: data.pet.type,
                        breed: data.pet.breed,
                        age: data.pet.age,
                        location: data.pet.location,
                        status: data.pet.status,
                        imageUrl: data.pet.imageUrl,
                        imageTexts: [data.pet.imageUrl || `${data.pet.name}+${data.pet.type}`],
                        description: data.pet.description,
                        temperament: Array.isArray(data.pet.temperament) 
                            ? data.pet.temperament 
                            : (typeof data.pet.temperament === 'string' && data.pet.temperament 
                                ? data.pet.temperament.split(',').map((t: string) => t.trim()) 
                                : []),
                        health: data.pet.health,
                    };
                    setCurrentPet(fetchedPet);
                    setFormData(prev => ({ ...prev, selectedPetId: fetchedPet.id }));
                } else {
                    setError('Pet not found');
                }
            } catch (err) {
                console.error('Fetch pet error:', err);
                setError('Failed to load pet details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPet();
        }
    }, [id, pet]); 

    // Function to show the form and smooth scroll
    const handleAdoptClick = () => {
        if (!currentPet) return;
        
        // Check if user is logged in
        if (!user) {
            // Redirect to login page
            navigate('/auth/login');
            return;
        }
        
        setFormData(prev => ({ ...prev, selectedPetId: currentPet.id }));
        setError(null);
        console.log(`Adoption application initiated for: ${currentPet.name}`);

        // 1. Make the form visible
        setIsFormVisible(true);

        // 2. Scroll to the form section
        // Adding a slight delay ensures the scroll happens *after* the form is rendered
        setTimeout(() => {
            document.getElementById('adoption-form-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!currentPet?.id) {
            setError("Error: No pet selected for adoption.");
            return;
        }

        // --- Mock API Call ---
        console.log("Application Submitted:", formData);

        // Success simulation
        setTimeout(() => {
            setIsSubmitted(true);
        }, 1000);
    };

    // UI Detail Items
    const DetailItem: React.FC<{ icon: string; label: string; value: string | number }> = ({ icon, label, value }) => (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg shadow-sm">
            <i className={`${icon} text-xl w-6 text-center`} style={{ color: COLORS.primaryTeal }}></i>
            <div>
                <span className="text-xs font-semibold uppercase text-gray-500 block">{label}</span>
                <span className="text-md font-bold text-gray-800">{value}</span>
            </div>
        </div>
    );

    const SuccessScreen: React.FC<{ selectedPet: Pet }> = ({ selectedPet }) => (
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-screen bg-white">
            <CheckCircle size={80} className="mb-6 animate-pulse" style={{ color: COLORS.submitButton }} />
            <h1 className="text-4xl font-extrabold mb-3" style={{ color: COLORS.darkAccentGreen }}>
                Application Successfully Submitted!
            </h1>
            <p className="text-xl text-gray-700 mb-8">
                Your adoption request for **{selectedPet.name}** has been received.
            </p>
            <p className="max-w-md text-gray-500">
                Your application will be reviewed by the shelter management. We will contact you within 48 hours. Thank you!
            </p>
            <button
                onClick={() => { console.log("Returning to Pet List (Simulated)"); setIsSubmitted(false); }}
                className="mt-8 text-white font-bold py-3 px-6 rounded-full shadow-xl transition duration-300"
                style={{ backgroundColor: COLORS.primaryTeal }}
            >
                <List size={20} className="mr-2 inline" /> Return to Pet List
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen" style={{ backgroundColor: COLORS.backgroundLight }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: COLORS.primaryTeal }}></div>
                    <p className="text-gray-600 font-semibold">Loading pet details...</p>
                </div>
            </div>
        );
    }

    if (error || !currentPet) {
        return (
            <div className="flex justify-center items-center h-screen" style={{ backgroundColor: COLORS.backgroundLight }}>
                <div className="text-center">
                    <p className="text-red-600 font-semibold text-xl mb-4">{error || 'Pet not found'}</p>
                    <button
                        onClick={() => navigate('/client/pets')}
                        className="text-white font-bold py-3 px-6 rounded-full shadow-xl transition duration-300"
                        style={{ backgroundColor: COLORS.primaryTeal }}
                    >
                        <List size={20} className="mr-2 inline" /> Return to Pet List
                    </button>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return <SuccessScreen selectedPet={currentPet} />;
    }

    return (
        <div style={{ backgroundColor: COLORS.backgroundLight, minHeight: '100vh' }}>
            {/* Keeping the background placeholder */}
            {/* <ThreeBackground /> */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={onReturn || (() => navigate('/client/pets'))}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition duration-150 font-medium"
                    >
                        <List size={20} className="mr-2" /> Return to List
                    </button>
                </div>

                {/* 1. Main Detail Card (Top Section) */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-b-8"
                    style={{ borderColor: COLORS.primaryTeal }}>

                    {/* Title and Status */}
                    <div className="p-8 pb-4 flex justify-between items-start border-b border-gray-100">
                        <h1 className="text-4xl font-extrabold" style={{ color: COLORS.darkAccentGreen }}>
                            {currentPet.name}
                        </h1>
                        <span
                            className={`text-sm font-bold uppercase px-4 py-1 rounded-full shadow-md ${currentPet.status === 'Available' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-800'}`}
                        >
                            {currentPet.status}
                        </span>
                    </div>

                    {/* Main Data Grid */}
                    <div className="p-8 lg:grid lg:grid-cols-3 gap-8">
                        
                        {/* Left Column: Image Gallery and Key Characteristics */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Main Image */}
                            <div className="w-full h-80 bg-gray-100 rounded-xl overflow-hidden shadow-lg border-2 border-dashed flex items-center justify-center">
                                <img
                                    src={
                                        currentPet.imageUrl || 
                                        `https://placehold.co/600x400/${COLORS.primaryTeal.substring(1)}/FFFFFF?text=${currentPet.imageTexts[0].replace(/\s/g, '+')}`
                                    }
                                    alt={`${currentPet.name} - ${currentPet.breed} (Main Image)`}
                                    className="w-full h-full object-cover"
                                    onError={(e: any) => {
                                        e.target.src = `https://placehold.co/600x400/${COLORS.primaryTeal.substring(1)}/FFFFFF?text=${currentPet.name.replace(/\s/g, '+')}`;
                                    }}
                                />
                            </div>

                            {/* Image Gallery Thumbnails */}
                            {currentPet.imageUrl && (
                                <div className="flex space-x-3 overflow-x-auto pb-2 px-1">
                                    <div
                                        className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2"
                                        style={{ borderColor: COLORS.primaryTeal }}
                                    >
                                        <img
                                            src={currentPet.imageUrl}
                                            alt={`${currentPet.name} photo`}
                                            className="w-full h-full object-cover"
                                            onError={(e: any) => {
                                                e.target.src = `https://placehold.co/100x100/A8DADC/333?text=${currentPet.name.replace(/\s/g, '+')}`;
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Key Characteristics Card */}
                            <div className="bg-gray-50 p-6 rounded-xl shadow-lg border-l-4" style={{ borderColor: COLORS.darkAccentGreen }}>
                                <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.darkAccentGreen }}>Key Characteristics</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <DetailItem icon="fas fa-paw" label="Type" value={currentPet.type} />
                                    <DetailItem icon="fas fa-ribbon" label="Breed" value={currentPet.breed} />
                                    <DetailItem icon="fas fa-birthday-cake" label="Age" value={`${currentPet.age} year(s)`} />
                                    <DetailItem icon="fas fa-location-dot" label="Location" value={currentPet.location} />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Detailed Information and Action */}
                        <div className="lg:col-span-2 mt-8 lg:mt-0 space-y-8">

                            {/* Story / Description */}
                            <div>
                                <h2 className="text-2xl font-bold mb-3 border-b pb-2" style={{ color: COLORS.primaryTeal }}>Story & Description</h2>
                                <p className="text-gray-700 leading-relaxed">{currentPet.description}</p>
                            </div>

                            {/* Temperament */}
                            <div>
                                <h2 className="text-2xl font-bold mb-3 border-b pb-2" style={{ color: COLORS.primaryTeal }}>Temperament</h2>
                                <div className="flex flex-wrap gap-2">
                                    {currentPet.temperament && currentPet.temperament.length > 0 ? (
                                        currentPet.temperament.map((t, index) => {
                                            // Clean up the temperament text - remove any JSON artifacts
                                            let cleanText = t;
                                            if (typeof t === 'string') {
                                                // Remove quotes, brackets, and backslashes
                                                cleanText = t.replace(/[\[\]"\\]/g, '').trim();
                                                // If still has JSON, try to parse
                                                if (cleanText.startsWith('[') || cleanText.includes('"')) {
                                                    try {
                                                        const parsed = JSON.parse(t);
                                                        cleanText = Array.isArray(parsed) ? parsed.join(', ') : String(parsed);
                                                    } catch (e) {
                                                        // Keep cleaned text
                                                    }
                                                }
                                            }
                                            
                                            return cleanText ? (
                                                <span key={index} className="px-3 py-1 bg-teal-100 text-teal-800 font-medium rounded-full text-sm">
                                                    {cleanText}
                                                </span>
                                            ) : null;
                                        })
                                    ) : (
                                        <span className="text-gray-500 italic">No temperament information available</span>
                                    )}
                                </div>
                            </div>

                            {/* Health Records */}
                            <div>
                                <h2 className="text-2xl font-bold mb-3 border-b pb-2" style={{ color: COLORS.primaryTeal }}>Health Records</h2>
                                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 text-gray-700">
                                    <p className="font-semibold">{currentPet.health}</p>
                                </div>
                            </div>

                            {/* Contact and Adoption Action Section */}
                            <div className="pt-4 border-t-2 border-dashed" style={{ borderColor: COLORS.primaryTeal }}>
                                <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.primaryTeal }}>Adoption Inquiry</h2>
                                <div className="bg-teal-50 p-6 rounded-xl shadow-inner space-y-4">
                                    <p className="text-gray-700">
                                        If you are interested in adopting **{currentPet.name}**, please click the button below to start the application process.
                                    </p>
                                    
                                    {/* This button shows the form and scrolls */}
                                    <button
                                        onClick={handleAdoptClick} 
                                        className="w-full text-white font-bold py-3 px-8 rounded-full shadow-xl transition duration-300 transform hover:scale-[1.01] hover:shadow-2xl mt-3 flex items-center justify-center"
                                        style={{ backgroundColor: COLORS.primaryTeal }}
                                    >
                                        <Heart size={20} className="mr-2 inline-block" /> Apply to Adopt
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Adoption Form Section (This part is conditionally rendered based on isFormVisible) */}
                {isFormVisible && (
                    <AdoptionFormSection
                        selectedPet={currentPet}
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        error={error}
                    />
                )}
            </main>
        </div>
    );
};

export default PetDetail;