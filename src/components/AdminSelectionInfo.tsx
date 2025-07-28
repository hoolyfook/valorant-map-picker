import React from 'react';
import { getLastAdminSelection, getAdminPreferredMaps, getAdminMapFrequency } from '../data/adminSelections';
import { ValorantMap } from '../data/maps';
import './AdminSelectionInfo.css';

interface AdminSelectionInfoProps {
  allMaps: ValorantMap[];
  currentSelection: string[];
  onLoadLastSelection: () => void;
  onLoadPreferredMaps: () => void;
}

const AdminSelectionInfo: React.FC<AdminSelectionInfoProps> = ({ 
  allMaps, 
  currentSelection, 
  onLoadLastSelection, 
  onLoadPreferredMaps 
}) => {
  const lastSelection = getLastAdminSelection();
  const preferredMaps = getAdminPreferredMaps(7);
  const frequency = getAdminMapFrequency();

  if (lastSelection.length === 0 && preferredMaps.length === 0) {
    return null;
  }

  const lastSelectionMaps = allMaps.filter(map => lastSelection.includes(map.id));
  const preferredMapObjects = allMaps.filter(map => preferredMaps.includes(map.id));

  return (
    <div className="admin-selection-info">
      {lastSelection.length > 0 && (
        <div className="info-section">
          <div className="section-header">
            <h4>📋 Last Admin Selection ({lastSelection.length} maps)</h4>
            <button 
              className="load-button"
              onClick={onLoadLastSelection}
              disabled={JSON.stringify(currentSelection.sort()) === JSON.stringify(lastSelection.sort())}
            >
              Load Last
            </button>
          </div>
          <div className="map-chips">
            {lastSelectionMaps.map(map => (
              <span key={map.id} className="map-chip last-selection">
                {map.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {preferredMaps.length > 0 && (
        <div className="info-section">
          <div className="section-header">
            <h4>⭐ Most Used Maps</h4>
            <button 
              className="load-button"
              onClick={onLoadPreferredMaps}
              disabled={JSON.stringify(currentSelection.sort()) === JSON.stringify(preferredMaps.sort())}
            >
              Load Preferred
            </button>
          </div>
          <div className="map-chips">
            {preferredMapObjects.map(map => (
              <span key={map.id} className="map-chip preferred">
                {map.name} <span className="frequency">({frequency[map.id] || 0}x)</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSelectionInfo;
