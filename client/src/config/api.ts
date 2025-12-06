// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints helper
export const API_ENDPOINTS = {
  // Auth
  register: `${API_URL}/api/auth/register`,
  login: `${API_URL}/api/auth/login`,
  verifyEmail: `${API_URL}/api/auth/verify-email`,
  resendCode: `${API_URL}/api/auth/resend-code`,
  forgotPassword: `${API_URL}/api/auth/forgot-password`,
  resetPassword: (token: string) => `${API_URL}/api/auth/reset-password/${token}`,
  getMe: `${API_URL}/api/auth/me`,
  completeGoogleProfile: `${API_URL}/api/auth/complete-google-profile`,
  changePassword: `${API_URL}/api/auth/change-password`,
  deleteAccount: `${API_URL}/api/auth/delete-account`,
  googleAuth: `${API_URL}/auth/google`,
  
  // Pets
  pets: `${API_URL}/api/pets`,
  petById: (id: string) => `${API_URL}/api/pets/${id}`,
  ownerPets: `${API_URL}/api/pets/owner/my-pets`,
};

export default API_URL;
