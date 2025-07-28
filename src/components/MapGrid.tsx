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
}

const MapGrid: React.FC<MapGridProps> = ({ maps, mapStates, onMapClick, currentPhase }) => {
  const isMapClickable = (mapState: MapState) => {
    return mapState.status === 'available' && currentPhase !== 'completed';
  };

  return (
    <div className="map-grid-container">
      <div className="map-grid">
        {maps.map((map) => {
          const mapState = mapStates.find(state => state.id === map.id) || {
            id: map.id,
            status: 'available' as const
          };
          
          return (
            <MapCard
              key={map.id}
              map={map}
              mapState={mapState}
              onMapClick={onMapClick}
              isClickable={isMapClickable(mapState)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MapGrid;
