import React from 'react';
import { GameState, phaseDescriptions } from '../types/game';
import { valorantMaps } from '../data/maps';
import DraftComplete from './DraftComplete';
import './GameHeader.css';

interface GameHeaderProps {
  gameState: GameState;
  onReset: () => void;
  canReset?: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({ gameState, onReset, canReset = true }) => {
  const getCurrentTeamName = () => {
    return gameState.currentTeam === 'team1' ? gameState.team1Name : gameState.team2Name;
  };

  const getPhaseAction = () => {
    if (gameState.phase.includes('ban')) return 'Ban';
    if (gameState.phase.includes('pick')) return 'Pick';
    if (gameState.phase.includes('side-select')) return 'Select side for';
    return '';
  };

  return (
    <div className="game-header">
      <div className="header-content">
        {/* 1. Teams Section */}
        <div className="teams-section">
          <div className={`team ${gameState.currentTeam === 'team1' ? 'active' : ''}`}>
            <h2>{gameState.team1Name}</h2>
          </div>
          <div className="vs-divider">VS</div>
          <div className={`team ${gameState.currentTeam === 'team2' ? 'active' : ''}`}>
            <h2>{gameState.team2Name}</h2>
          </div>
        </div>
        
        {/* 2. Game Status */}
        <div className="game-status">
          <div className="phase-info">
            <h3>{phaseDescriptions[gameState.phase]}</h3>
            {gameState.phase !== 'completed' && (
              <p className="current-turn">
                {gameState.phase.includes('side-select') 
                  ? `${getCurrentTeamName()} - ${getPhaseAction()} map`
                  : `${getCurrentTeamName()} - ${getPhaseAction()} a map`
                }
              </p>
            )}
          </div>
        </div>
        
        {/* Controls */}
        <div className="controls">
          {canReset && (
            <button className="reset-button" onClick={onReset}>
              Reset Game
            </button>
          )}
        </div>
      </div>

      {/* Draft Complete Section */}
      {gameState.phase === 'completed' && (
        <DraftComplete gameState={gameState} allMaps={valorantMaps} />
      )}

      {/* 3. Picked Maps Section */}
      {(gameState.pickedMaps.length > 0 || gameState.mapStates.some(state => state.status === 'picked' && state.pickedBy === 'decider')) && (
        <div className="picked-maps-section">
          <h4>✅ Selected Maps ({gameState.pickedMaps.length + (gameState.mapStates.some(state => state.status === 'picked' && state.pickedBy === 'decider') ? 1 : 0)})</h4>
          <div className="picked-list">
            {/* Regular picked maps */}
            {gameState.pickedMaps.map((mapId, index) => {
              const mapData = valorantMaps.find(map => map.id === mapId);
              const mapState = gameState.mapStates.find(state => state.id === mapId && state.status === 'picked');
              const pickedByTeam = mapState?.pickedBy === 'team1' ? gameState.team1Name : gameState.team2Name;
              
              return (
                <div 
                  key={mapId} 
                  className="picked-map-card"
                  data-picked-by={`Pick by ${pickedByTeam}`}
                >
                  <div className="picked-map-image">
                    <img 
                      src={mapData?.image} 
                      alt={mapData?.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/300x200/27ae60/ffffff?text=${mapData?.name || mapId}`;
                      }}
                    />
                  </div>
                  <div className="picked-map-overlay">
                    <span className="picked-map-number">{index + 1}</span>
                    <span className="picked-map-name">{mapData?.name || mapId}</span>
                  </div>
                </div>
              );
            })}
            
            {/* Decider map */}
            {gameState.mapStates
              .filter(state => state.status === 'picked' && state.pickedBy === 'decider')
              .map((mapState) => {
                const mapData = valorantMaps.find(map => map.id === mapState.id);
                return (
                  <div 
                    key={mapState.id} 
                    className="picked-map-card decider-map"
                    data-picked-by="Decider Map"
                  >
                    <div className="picked-map-image">
                      <img 
                        src={mapData?.image} 
                        alt={mapData?.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/300x200/27ae60/ffffff?text=${mapData?.name || mapState.id}`;
                        }}
                      />
                    </div>
                    <div className="picked-map-overlay">
                      <span className="picked-map-number">🏆</span>
                      <span className="picked-map-name">{mapData?.name || mapState.id}</span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}
      
      {/* 4. Banned Maps Section */}
      {gameState.mapStates.some(state => state.status === 'banned') && (
        <div className="banned-maps-section">
          <h4>🚫 Banned Maps ({gameState.mapStates.filter(state => state.status === 'banned').length})</h4>
          <div className="banned-list">
            {gameState.mapStates
              .filter(state => state.status === 'banned')
              .map((mapState) => {
                const teamName = mapState.bannedBy === 'team1' ? gameState.team1Name : gameState.team2Name;
                const mapData = valorantMaps.find(map => map.id === mapState.id);
                return (
                  <div 
                    key={mapState.id} 
                    className="banned-map"
                    data-banned-by={`Banned by ${teamName}`}
                  >
                    <div className="banned-map-image">
                      <img 
                        src={mapData?.image} 
                        alt={mapData?.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/300x200/6c757d/ffffff?text=${mapData?.name || mapState.id}`;
                        }}
                      />
                    </div>
                    <div className="banned-map-overlay">
                      <span className="banned-map-name">{mapData?.name || mapState.id}</span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHeader;
