export const USER_ROLES = {
  ADMIN: 'admin',
  PET_OWNER: 'pet_owner',
  PET_SEEKER: 'pet_seeker'
};

export async function login() { throw new Error('Use AuthContext.login'); }
export async function register() { throw new Error('Use AuthContext.register'); }
export function logout() { localStorage.clear(); }
export function isAuthenticated() { return !!localStorage.getItem('token'); }