// Constants for managing admin selected maps
export const ADMIN_SELECTED_MAPS_KEY = 'valorant-map-picker-admin-selections';
export const MAX_ADMIN_SELECTIONS_HISTORY = 10; // Keep last 10 admin selections

export interface AdminSelection {
  selectedMaps: string[];
  timestamp: number;
  selectionId: string;
}

// Load admin selected maps from localStorage
export const loadAdminSelections = (): AdminSelection[] => {
  try {
    const stored = localStorage.getItem(ADMIN_SELECTED_MAPS_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored) as AdminSelection[];
    
    // Clean up old entries (older than 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const filtered = parsed.filter(entry => entry.timestamp > thirtyDaysAgo);
    
    // Keep only recent entries
    const sorted = filtered.sort((a, b) => b.timestamp - a.timestamp);
    const recent = sorted.slice(0, MAX_ADMIN_SELECTIONS_HISTORY);
    
    // Save cleaned data back
    if (recent.length !== parsed.length) {
      saveAdminSelections(recent);
    }
    
    return recent;
  } catch (error) {
    console.error('Error loading admin selections:', error);
    return [];
  }
};

// Save admin selected maps to localStorage
export const saveAdminSelections = (selections: AdminSelection[]): void => {
  try {
    localStorage.setItem(ADMIN_SELECTED_MAPS_KEY, JSON.stringify(selections));
  } catch (error) {
    console.error('Error saving admin selections:', error);
  }
};

// Add new admin selection
export const addAdminSelection = (selectedMaps: string[]): string => {
  const current = loadAdminSelections();
  const timestamp = Date.now();
  const selectionId = `admin-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newSelection: AdminSelection = {
    selectedMaps,
    timestamp,
    selectionId
  };
  
  // Add new selection at the beginning
  const updated = [newSelection, ...current];
  
  // Keep only recent entries
  const recent = updated.slice(0, MAX_ADMIN_SELECTIONS_HISTORY);
  
  saveAdminSelections(recent);
  return selectionId;
};

// Get the most recent admin selection
export const getLastAdminSelection = (): string[] => {
  const selections = loadAdminSelections();
  if (selections.length === 0) return [];
  
  return selections[0].selectedMaps;
};

// Get frequently selected maps by admin
export const getAdminMapFrequency = (): Record<string, number> => {
  const selections = loadAdminSelections();
  const frequency: Record<string, number> = {};
  
  selections.forEach(selection => {
    selection.selectedMaps.forEach(mapId => {
      frequency[mapId] = (frequency[mapId] || 0) + 1;
    });
  });
  
  return frequency;
};

// Get admin's preferred maps (most frequently selected)
export const getAdminPreferredMaps = (limit: number = 7): string[] => {
  const frequency = getAdminMapFrequency();
  
  // Sort maps by frequency (descending) - most picked maps first
  const sortedMaps = Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .map(([mapId]) => mapId);
  
  return sortedMaps.slice(0, limit);
};

// Clear admin selections (for reset)
export const clearAdminSelections = (): void => {
  try {
    localStorage.removeItem(ADMIN_SELECTED_MAPS_KEY);
  } catch (error) {
    console.error('Error clearing admin selections:', error);
  }
};
