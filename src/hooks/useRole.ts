import { useState, useEffect } from 'react';
import { UserRole, getRoleFromURL, roleConfigs } from '../types/roles';

export const useRole = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');

  useEffect(() => {
    // Get role from URL on mount
    const roleFromURL = getRoleFromURL();
    setCurrentRole(roleFromURL);

    // Listen for URL changes
    const handlePopState = () => {
      const newRole = getRoleFromURL();
      setCurrentRole(newRole);
    };

    window.addEventListener('popstate', handlePopState);

    // Listen for URL parameter changes (for hash routing)
    const handleHashChange = () => {
      const newRole = getRoleFromURL();
      setCurrentRole(newRole);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return {
    currentRole,
    roleConfig: roleConfigs[currentRole]
  };
};
