import React from 'react';
import { GameState } from '../types/game';
import { ValorantMap } from '../data/maps';
import './DraftComplete.css';

interface DraftCompleteProps {
  gameState: GameState;
  allMaps: ValorantMap[];
}

const DraftComplete: React.FC<DraftCompleteProps> = ({ gameState, allMaps }) => {
  // Get all picked maps and sort them properly (decider last)
  const allPickedMaps = gameState.mapStates
    .filter(state => state.status === 'picked')
    .sort((a, b) => {
      // Decider map should be last
      if (a.pickedBy === 'decider') return 1;
      if (b.pickedBy === 'decider') return -1;
      
      // For non-decider maps, maintain their original order based on pickedMaps array
      const indexA = gameState.pickedMaps.indexOf(a.id);
      const indexB = gameState.pickedMaps.indexOf(b.id);
      return indexA - indexB;
    });

  return (
    <div className="draft-complete">
      <h2>🎉 Draft Completed!</h2>
      
      {/* Display 3 maps in divs */}
      <div className="maps-container">
        {allPickedMaps.map((mapState, index) => {
          const mapData = allMaps.find(m => m.id === mapState.id);
          if (!mapData) return null;
          
          const mapNumber = index + 1;
          const isDecider = mapState.pickedBy === 'decider';
          
          return (
            <div key={mapState.id} className={`map-box ${isDecider ? 'decider' : ''}`}>
              <div className="map-image">
                <img src={mapData.image} alt={mapData.name} />
              </div>
              <div className="map-info">
                <h3>Map {mapNumber}</h3>
                <p className="map-name">{mapData.name}</p>
                {isDecider && <span className="decider-badge">Decider</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Display team side information below */}
      <div className="teams-info">
        {allPickedMaps.map((mapState, index) => {
          const mapData = allMaps.find(m => m.id === mapState.id);
          if (!mapData || !mapState.selectedSide || !mapState.sideSelectedBy) return null;
          
          const mapNumber = index + 1;
          const pickingTeam = mapState.sideSelectedBy === 'team1' ? gameState.team1Name : gameState.team2Name;
          const otherTeam = mapState.sideSelectedBy === 'team1' ? gameState.team2Name : gameState.team1Name;
          const pickingSide = mapState.selectedSide === 'attack' ? 'ATK' : 'DEF';
          const otherSide = mapState.selectedSide === 'attack' ? 'DEF' : 'ATK';
          
          // Determine who picked the map
          let pickedByTeam = '';
          if (mapState.pickedBy === 'team1') {
            pickedByTeam = gameState.team1Name;
          } else if (mapState.pickedBy === 'team2') {
            pickedByTeam = gameState.team2Name;
          } else {
            pickedByTeam = 'Decider';
          }
          
          return (
            <div key={mapState.id} className="team-info-row">
              <div className="map-label">
                Map {mapNumber}: <span className="map-name-inline">{mapData.name}</span>
              </div>
              <div className="team-side-info">
                <span className="team-side">{pickingTeam}: {pickingSide}</span>
                <span className="separator">•</span>
                <span className="team-side">{otherTeam}: {otherSide}</span>
                <span className="separator">•</span>
                <span className="picked-by">Picked by: {pickedByTeam}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DraftComplete;
