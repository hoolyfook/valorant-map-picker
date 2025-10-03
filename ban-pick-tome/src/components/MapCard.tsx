import React from 'react';
import { ValorantMap as MapType, MapClickHandler } from '../types/game';

interface MapCardProps {
  map: MapType;
  onBan?: MapClickHandler;
  onPick?: MapClickHandler;
  disabled?: boolean;
}

const MapCard: React.FC<MapCardProps> = ({ map, onBan, onPick, disabled }) => {
  const getCardClasses = (): string => {
    let classes = 'map-card ';
    
    switch (map.status) {
      case 'available':
        classes += 'available ';
        break;
      case 'banned':
        classes += 'banned ';
        break;
      case 'picked':
        classes += 'picked ';
        break;
    }
    
    if (disabled) {
      classes += 'opacity-50 cursor-not-allowed ';
    }
    
    return classes;
  };

  const handleClick = (): void => {
    if (disabled || map.status !== 'available') return;
    
    if (onPick) onPick();
    if (onBan) onBan();
  };

  return (
    <div className={getCardClasses()} onClick={handleClick}>
      <div className="aspect-video bg-gray-700 flex items-center justify-center">
        {/* Map image would go here */}
        <div className="text-2xl font-bold">{map.name}</div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-lg">{map.name}</h3>
        
        {map.status === 'banned' && (
          <div className="text-red-400 text-sm mt-1">
            BANNED
          </div>
        )}
        
        {map.status === 'picked' && (
          <div className="text-green-400 text-sm mt-1">
            PICKED
          </div>
        )}
      </div>
      
      {map.status !== 'available' && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-white text-2xl font-bold">
            {map.status === 'banned' ? 'BANNED' : 'PICKED'}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapCard;