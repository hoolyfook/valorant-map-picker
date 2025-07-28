import React from 'react';
import { UserRole } from '../types/roles';
import { GameState } from '../types/game';
import './RoleStatus.css';

interface RoleStatusProps {
  currentRole: UserRole;
  gameState: GameState;
  canInteract: boolean;
}

const RoleStatus: React.FC<RoleStatusProps> = ({ currentRole, gameState, canInteract }) => {
  const getCurrentTeamName = () => {
    return gameState.currentTeam === 'team1' ? gameState.team1Name : gameState.team2Name;
  };

  const getStatusMessage = () => {
    if (currentRole === 'admin') {
      return '👑 You have full control';
    }
    
    if (currentRole === 'observer') {
      return '👁️ Viewing as observer';
    }
    
    const yourTeamName = currentRole === 'teamA' ? gameState.team1Name : gameState.team2Name;
    const currentTeamName = getCurrentTeamName();
    
    if (canInteract) {
      return `🎯 It's ${yourTeamName}'s turn`;
    } else {
      return `⏳ Waiting for ${currentTeamName}`;
    }
  };

  const getStatusClass = () => {
    if (currentRole === 'admin') return 'admin';
    if (currentRole === 'observer') return 'observer';
    return canInteract ? 'active' : 'waiting';
  };

  return (
    <div className={`role-status ${getStatusClass()}`}>
      <p>{getStatusMessage()}</p>
    </div>
  );
};

export default RoleStatus;
