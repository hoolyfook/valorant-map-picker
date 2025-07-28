import React from 'react';
import { ValorantMap } from '../data/maps';
import { MapState } from '../types/game';
import './MapCard.css';

interface MapCardProps {
  map: ValorantMap;
  mapState: MapState;
  onMapClick: (mapId: string) => void;
  isClickable: boolean;
  isFeatured?: boolean;
  team1Name?: string;
  team2Name?: string;
}

const MapCard: React.FC<MapCardProps> = ({ map, mapState, onMapClick, isClickable, isFeatured = false, team1Name = 'Team 1', team2Name = 'Team 2' }) => {
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
        return `Banned by ${mapState.bannedBy === 'team1' ? team1Name : team2Name}`;
      case 'picked':
        if (mapState.pickedBy === 'decider') {
          // Special case for decider map
          if (mapState.selectedSide && mapState.sideSelectedBy) {
            const sideByText = mapState.sideSelectedBy === 'team1' ? team1Name : team2Name;
            const sideText = mapState.selectedSide === 'attack' ? 'ATK' : 'DEF';
            return `🏆 Decider Map | ${sideByText}: ${sideText}`;
          }
          return '🏆 Decider Map';
        } else {
          const pickedByText = `Picked by ${mapState.pickedBy === 'team1' ? team1Name : team2Name}`;
          if (mapState.selectedSide && mapState.sideSelectedBy) {
            const sideByText = mapState.sideSelectedBy === 'team1' ? team1Name : team2Name;
            const sideText = mapState.selectedSide === 'attack' ? 'ATK' : 'DEF';
            return `${pickedByText} | ${sideByText}: ${sideText}`;
          }
          return pickedByText;
        }
      default:
        return 'Available';
    }
  };

  return (
    <div 
      className={`map-card ${getStatusClass()} ${isClickable ? 'clickable' : ''} ${isFeatured ? 'featured' : ''}`}
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
    </div>
  );
};

export default MapCard;
