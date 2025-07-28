// Constants for managing recently picked maps
export const RECENTLY_PICKED_MAPS_KEY = 'valorant-map-picker-recent-maps';
export const MAX_RECENT_MAPS_HISTORY = 21; // 3 BO7s (7 maps x 3 series)

export interface RecentMapEntry {
  mapId: string;
  timestamp: number;
  seriesId: string; // Unique ID for each BO7 series
}

// Load recently picked maps from localStorage
export const loadRecentlyPickedMaps = (): RecentMapEntry[] => {
  try {
    const stored = localStorage.getItem(RECENTLY_PICKED_MAPS_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored) as RecentMapEntry[];
    
    // Clean up old entries (older than 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const filtered = parsed.filter(entry => entry.timestamp > sevenDaysAgo);
    
    // Keep only the most recent entries
    const sorted = filtered.sort((a, b) => b.timestamp - a.timestamp);
    const recent = sorted.slice(0, MAX_RECENT_MAPS_HISTORY);
    
    // Save cleaned data back
    if (recent.length !== parsed.length) {
      saveRecentlyPickedMaps(recent);
    }
    
    return recent;
  } catch (error) {
    console.error('Error loading recently picked maps:', error);
    return [];
  }
};

// Save recently picked maps to localStorage
export const saveRecentlyPickedMaps = (recentMaps: RecentMapEntry[]): void => {
  try {
    localStorage.setItem(RECENTLY_PICKED_MAPS_KEY, JSON.stringify(recentMaps));
  } catch (error) {
    console.error('Error saving recently picked maps:', error);
  }
};

// Add newly picked maps from a completed series
export const addPickedMapsFromSeries = (pickedMapIds: string[], seriesId: string): void => {
  const current = loadRecentlyPickedMaps();
  const timestamp = Date.now();
  
  // Add new entries
  const newEntries: RecentMapEntry[] = pickedMapIds.map(mapId => ({
    mapId,
    timestamp,
    seriesId
  }));
  
  // Combine with existing, remove duplicates from same series, and sort
  const filtered = current.filter(entry => entry.seriesId !== seriesId);
  const combined = [...newEntries, ...filtered];
  
  // Keep only recent entries
  const sorted = combined.sort((a, b) => b.timestamp - a.timestamp);
  const recent = sorted.slice(0, MAX_RECENT_MAPS_HISTORY);
  
  saveRecentlyPickedMaps(recent);
};

// Get map pick frequency for recommendations
export const getMapPickFrequency = (): Record<string, number> => {
  const recentMaps = loadRecentlyPickedMaps();
  const frequency: Record<string, number> = {};
  
  recentMaps.forEach(entry => {
    frequency[entry.mapId] = (frequency[entry.mapId] || 0) + 1;
  });
  
  return frequency;
};

// Get recently picked map IDs (for filtering during admin setup)
export const getRecentlyPickedMapIds = (excludeCurrentSeries?: string): string[] => {
  const recentMaps = loadRecentlyPickedMaps();
  
  let filtered = recentMaps;
  if (excludeCurrentSeries) {
    filtered = recentMaps.filter(entry => entry.seriesId !== excludeCurrentSeries);
  }
  
  // Get unique map IDs
  const uniqueMapIds = Array.from(new Set(filtered.map(entry => entry.mapId)));
  return uniqueMapIds;
};

// Generate a unique series ID
export const generateSeriesId = (): string => {
  return `series-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get maps that haven't been picked recently (recommended for variety)
export const getRecommendedMaps = (allMapIds: string[]): string[] => {
  const frequency = getMapPickFrequency();
  
  // Sort maps by frequency (ascending) - less picked maps first
  return allMapIds.sort((a, b) => {
    const freqA = frequency[a] || 0;
    const freqB = frequency[b] || 0;
    return freqA - freqB;
  });
};
