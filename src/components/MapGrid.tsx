import React from 'react';
import { ValorantMap } from '../data/maps';
import { MapState } from '../types/game';
import MapCard from './MapCard';
import './MapGrid.css';

interface MapGridProps {
  maps: ValorantMap[];
  mapStates: MapState[];
  onMapClick: (mapId: string) => void;
  currentPhase: string;
  pickedMaps: string[];
  team1Name: string;
  team2Name: string;
  disabled?: boolean;
}

const MapGrid: React.FC<MapGridProps> = ({ maps, mapStates, onMapClick, currentPhase, pickedMaps, team1Name, team2Name, disabled = false }) => {
  const isMapClickable = (mapState: MapState) => {
    return mapState.status === 'available' && currentPhase !== 'completed' && !disabled;
  };

  // Separate different types of maps
  const pickedMapStates = mapStates.filter(state => state.status === 'picked' && state.pickedBy !== 'decider');
  const availableMapStates = mapStates.filter(state => state.status === 'available');
  const bannedMapStates = mapStates.filter(state => state.status === 'banned');
  const deciderMapState = mapStates.find(state => state.status === 'picked' && state.pickedBy === 'decider');

  // Check if we're in the final state where decider map is selected
  const isDeciderMap = deciderMapState !== undefined && currentPhase === 'completed';

  // Get the latest picked map for featured display
  const latestPickedMap = pickedMapStates.length > 0 ? 
    pickedMapStates.reduce((latest, current) => {
      // Compare by pick order (last item in pickedMaps array)
      const latestIndex = pickedMaps.indexOf(latest.id);
      const currentIndex = pickedMaps.indexOf(current.id);
      return currentIndex > latestIndex ? current : latest;
    }) : null;

  return (
    <div className="map-grid-container">
      {/* Decider Map - Show when decider map is selected */}
      {/* Regular map grid - only show available maps (hide banned maps) */}
      {!isDeciderMap && (
        <div className="map-grid">
          {availableMapStates.map((mapState) => {
            const map = maps.find(m => m.id === mapState.id);
            if (!map) return null;
            
            return (
              <MapCard
                key={map.id}
                map={map}
                mapState={mapState}
                onMapClick={onMapClick}
                isClickable={isMapClickable(mapState)}
                isFeatured={false}
                team1Name={team1Name}
                team2Name={team2Name}
              />
            );
          })}
        </div>
      )}

      {/* Show all picked maps in a separate section */}
      {pickedMapStates.length > 0 && !isDeciderMap && (
        <div className="picked-maps-section">
          <h3>Picked Maps</h3>
          <div className="picked-maps-grid">
            {pickedMapStates.map((mapState) => {
              const map = maps.find(m => m.id === mapState.id);
              return map ? (
                <MapCard
                  key={map.id}
                  map={map}
                  mapState={mapState}
                  onMapClick={onMapClick}
                  isClickable={false}
                  isFeatured={false}
                  team1Name={team1Name}
                  team2Name={team2Name}
                />
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Show banned maps count (optional - for information) */}
      {bannedMapStates.length > 0 && !isDeciderMap && (
        <div className="banned-maps-info">
          <p>🚫 {bannedMapStates.length} maps banned</p>
        </div>
      )}
    </div>
  );
};

export default MapGrid;
