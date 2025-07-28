import React from 'react';
import { GameState, phaseDescriptions } from '../types/game';
import './GameHeader.css';

interface GameHeaderProps {
  gameState: GameState;
  onReset: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ gameState, onReset }) => {
  const getCurrentTeamName = () => {
    return gameState.currentTeam === 'team1' ? gameState.team1Name : gameState.team2Name;
  };

  const getPhaseAction = () => {
    if (gameState.phase.includes('ban')) return 'Ban';
    if (gameState.phase.includes('pick')) return 'Pick';
    return '';
  };

  return (
    <div className="game-header">
      <div className="header-content">
        <div className="teams-section">
          <div className={`team ${gameState.currentTeam === 'team1' ? 'active' : ''}`}>
            <h2>{gameState.team1Name}</h2>
          </div>
          <div className="vs-divider">VS</div>
          <div className={`team ${gameState.currentTeam === 'team2' ? 'active' : ''}`}>
            <h2>{gameState.team2Name}</h2>
          </div>
        </div>
        
        <div className="game-status">
          <div className="phase-info">
            <h3>{phaseDescriptions[gameState.phase]}</h3>
            {gameState.phase !== 'completed' && (
              <p className="current-turn">
                {getCurrentTeamName()} - {getPhaseAction()} a map
              </p>
            )}
          </div>
          
          {gameState.pickedMaps.length > 0 && (
            <div className="picked-maps">
              <h4>Selected Maps:</h4>
              <div className="picked-list">
                {gameState.pickedMaps.map((mapId, index) => (
                  <span key={mapId} className="picked-map">
                    {mapId} {index < gameState.pickedMaps.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="controls">
          <button className="reset-button" onClick={onReset}>
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
