import React from 'react';
import { Side } from '../types/game';
import './SideSelection.css';

interface SideSelectionProps {
  mapName: string;
  mapImage: string;
  teamName: string;
  onSideSelect: (side: Side) => void;
  isDeciderMap?: boolean;
}

const SideSelection: React.FC<SideSelectionProps> = ({ 
  mapName, 
  mapImage, 
  teamName, 
  onSideSelect,
  isDeciderMap = false
}) => {
  return (
    <div className="side-selection-container">
      <div className="side-selection">
        <h2>
          {teamName} - Choose Your Side
          {isDeciderMap && <span style={{display: 'block', fontSize: '18px', color: '#ff4655', marginTop: '8px'}}>🏆 Decider Map</span>}
        </h2>
        
        <div className="selected-map-display">
          <img src={mapImage} alt={mapName} />
          <h3>{mapName}</h3>
        </div>

        <div className="side-options">
          <button 
            className="side-button attack"
            onClick={() => onSideSelect('attack')}
          >
            <div className="side-icon">⚔️</div>
            <span>ATK</span>
            <div className="side-description">Start as attackers</div>
          </button>

          <button 
            className="side-button defense"
            onClick={() => onSideSelect('defense')}
          >
            <div className="side-icon">🛡️</div>
            <span>DEF</span>
            <div className="side-description">Start as defenders</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideSelection;
