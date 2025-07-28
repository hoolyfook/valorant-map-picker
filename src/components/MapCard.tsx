import React from 'react';
import { ValorantMap } from '../data/maps';
import { MapState } from '../types/game';
import './MapCard.css';

interface MapCardProps {
  map: ValorantMap;
  mapState: MapState;
  onMapClick: (mapId: string) => void;
  isClickable: boolean;
}

const MapCard: React.FC<MapCardProps> = ({ map, mapState, onMapClick, isClickable }) => {
  const getStatusClass = () => {
    switch (mapState.status) {
      case 'banned':
        return 'banned';
      case 'picked':
        return 'picked';
      default:
        return 'available';
    }
  };

  const getStatusText = () => {
    switch (mapState.status) {
      case 'banned':
        return `Banned by ${mapState.bannedBy === 'team1' ? 'Team 1' : 'Team 2'}`;
      case 'picked':
        return `Picked by ${mapState.pickedBy === 'team1' ? 'Team 1' : 'Team 2'}`;
      default:
        return 'Available';
    }
  };

  return (
    <div 
      className={`map-card ${getStatusClass()} ${isClickable ? 'clickable' : ''}`}
      onClick={() => isClickable && onMapClick(map.id)}
    >
      <div className="map-image">
        <img 
          src={map.image} 
          alt={map.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/300x200/1a1a2e/16213e?text=${map.name}`;
          }}
        />
        <div className="map-overlay">
          <h3 className="map-name">{map.name}</h3>
          <p className="map-status">{getStatusText()}</p>
        </div>
      </div>
      <div className="map-description">
        <p>{map.description}</p>
      </div>
    </div>
  );
};

export default MapCard;
