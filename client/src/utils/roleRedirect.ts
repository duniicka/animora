// Role-based redirect helper
export const getRoleBasedRedirect = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'owner':
      return '/owner';
    case 'client':
    default:
      return '/pets';
  }
};
