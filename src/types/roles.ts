// Role types for different users
export type UserRole = 'admin' | 'observer' | 'teamA' | 'teamB';

export interface RoleConfig {
  role: UserRole;
  canInteract: boolean;
  visiblePhases: string[];
  description: string;
}

export const roleConfigs: Record<UserRole, RoleConfig> = {
  admin: {
    role: 'admin',
    canInteract: true,
    visiblePhases: ['admin-setup', 'ban1', 'ban2', 'pick1', 'side-select1', 'pick2', 'side-select2', 'ban3', 'ban4', 'pick3', 'side-select3', 'completed'],
    description: 'Full control - can interact in all phases and access admin setup'
  },
  observer: {
    role: 'observer',
    canInteract: false,
    visiblePhases: ['ban1', 'ban2', 'pick1', 'side-select1', 'pick2', 'side-select2', 'ban3', 'ban4', 'pick3', 'side-select3', 'completed'],
    description: 'View only - can see the draft process but cannot interact'
  },
  teamA: {
    role: 'teamA',
    canInteract: true,
    visiblePhases: ['ban1', 'ban2', 'pick1', 'side-select1', 'pick2', 'side-select2', 'ban3', 'ban4', 'pick3', 'side-select3', 'completed'],
    description: 'Team A control - can only interact when it\'s Team A\'s turn'
  },
  teamB: {
    role: 'teamB',
    canInteract: true,
    visiblePhases: ['ban1', 'ban2', 'pick1', 'side-select1', 'pick2', 'side-select2', 'ban3', 'ban4', 'pick3', 'side-select3', 'completed'],
    description: 'Team B control - can only interact when it\'s Team B\'s turn'
  }
};

// Get role from URL parameters
export const getRoleFromURL = (): UserRole => {
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role') as UserRole;
  
  if (roleParam && Object.keys(roleConfigs).includes(roleParam)) {
    return roleParam;
  }
  
  return 'admin'; // Default to admin if no valid role specified
};

// Generate URL with role parameter
export const generateRoleURL = (role: UserRole): string => {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?role=${role}`;
};

// Check if user can interact in current phase
export const canUserInteract = (userRole: UserRole, currentPhase: string, currentTeam: string): boolean => {
  const config = roleConfigs[userRole];
  
  // Observer can never interact
  if (userRole === 'observer') return false;
  
  // Check if phase is visible to user
  if (!config.visiblePhases.includes(currentPhase)) return false;
  
  // Admin can always interact in all phases
  if (userRole === 'admin') return true;
  
  // Teams can only interact on their turn
  if (userRole === 'teamA' && currentTeam === 'team1') return true;
  if (userRole === 'teamB' && currentTeam === 'team2') return true;
  
  return false;
};

// Check if phase is visible to user
export const isPhaseVisible = (userRole: UserRole, phase: string): boolean => {
  return roleConfigs[userRole].visiblePhases.includes(phase);
};
