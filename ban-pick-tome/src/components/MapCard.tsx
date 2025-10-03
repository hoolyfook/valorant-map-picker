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
    <div className={`${getCardClasses()} w-80 h-auto`} onClick={handleClick}>
      <div 
        className="aspect-video bg-gray-700 flex items-center justify-center bg-cover bg-center relative h-48"
        style={{
          backgroundImage: `url('${map.image}')`,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-4xl font-bold text-white drop-shadow-lg">
          {map.name}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-2xl text-center">{map.name}</h3>
        
        {map.status === 'banned' && (
          <div className="text-red-400 text-lg mt-2">
            BANNED
          </div>
        )}
        
        {map.status === 'picked' && (
          <div className="text-green-400 text-lg mt-2">
            PICKED
          </div>
        )}
      </div>
      
      {map.status === 'banned' && (
        <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center">
          <div className="text-red-100 text-5xl font-bold drop-shadow-lg">
            BANNED
          </div>
        </div>
      )}
      
      {map.status === 'picked' && (
        <div className="absolute inset-0 bg-green-900/80 flex items-center justify-center">
          <div className="text-green-100 text-5xl font-bold drop-shadow-lg">
            PICKED
          </div>
        </div>
      )}
    </div>
  );
};

export default MapCard;