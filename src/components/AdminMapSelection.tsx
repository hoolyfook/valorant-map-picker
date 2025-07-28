import React, { useState, useEffect } from 'react';
import { valorantMaps } from '../data/maps';
import RecentlyPickedInfo from './RecentlyPickedInfo';
import AdminSelectionInfo from './AdminSelectionInfo';
import { getLastAdminSelection, addAdminSelection, getAdminPreferredMaps } from '../data/adminSelections';
import './AdminMapSelection.css';

interface AdminMapSelectionProps {
  onMapsSelected: (selectedMaps: string[]) => void;
}

const AdminMapSelection: React.FC<AdminMapSelectionProps> = ({ onMapsSelected }) => {
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);

  // Load last admin selection on component mount
  useEffect(() => {
    const lastSelection = getLastAdminSelection();
    if (lastSelection.length === 7) {
      setSelectedMaps(lastSelection);
    }
  }, []);

  const handleMapToggle = (mapId: string) => {
    setSelectedMaps(prev => {
      if (prev.includes(mapId)) {
        return prev.filter(id => id !== mapId);
      } else if (prev.length < 7) {
        return [...prev, mapId];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    if (selectedMaps.length === 7) {
      // Save admin selection to storage
      addAdminSelection(selectedMaps);
      onMapsSelected(selectedMaps);
    }
  };

  const handleLoadLastSelection = () => {
    const lastSelection = getLastAdminSelection();
    if (lastSelection.length === 7) {
      setSelectedMaps(lastSelection);
    }
  };

  const handleLoadPreferredMaps = () => {
    const preferredMaps = getAdminPreferredMaps(7);
    if (preferredMaps.length >= 7) {
      setSelectedMaps(preferredMaps.slice(0, 7));
    }
  };

  return (
    <div className="admin-map-selection">
      <h2>Admin Setup - Select 7 Maps for Ban/Pick Phase</h2>
      <p>Selected: {selectedMaps.length}/7 maps</p>
      
      <AdminSelectionInfo 
        allMaps={valorantMaps}
        currentSelection={selectedMaps}
        onLoadLastSelection={handleLoadLastSelection}
        onLoadPreferredMaps={handleLoadPreferredMaps}
      />
      
      <RecentlyPickedInfo allMaps={valorantMaps} />
      
      <div className="map-selection-grid">
        {valorantMaps.map(map => (
          <div
            key={map.id}
            className={`map-selection-card ${selectedMaps.includes(map.id) ? 'selected' : ''} ${selectedMaps.length >= 7 && !selectedMaps.includes(map.id) ? 'disabled' : ''}`}
            onClick={() => handleMapToggle(map.id)}
          >
            <img src={map.image} alt={map.name} />
            <h3>{map.name}</h3>
            {selectedMaps.includes(map.id) && (
              <div className="selection-order">
                {selectedMaps.indexOf(map.id) + 1}
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        className="confirm-selection"
        onClick={handleConfirm}
        disabled={selectedMaps.length !== 7}
      >
        Confirm Selection ({selectedMaps.length}/7)
      </button>
    </div>
  );
};

export default AdminMapSelection;
