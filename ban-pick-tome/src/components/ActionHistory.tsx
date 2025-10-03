import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Action } from '../types/game';

const ActionHistory: React.FC = () => {
  const { actionHistory, teams } = useSelector((state: RootState) => state.game);

  const getTeamName = (teamId: string): string => {
    if (teamId === 'decider') return 'DECIDER';
    return teams.find(team => team.id === teamId)?.name || teamId;
  };

  const getActionDescription = (action: Action): string => {
    const teamName = getTeamName(action.teamId);
    const mapName = action.mapId ? action.mapId.toUpperCase() : '';
    
    switch (action.type) {
      case 'ban':
        return `${teamName} BANNED ${mapName}`;
      case 'pick':
        if (action.teamId === 'decider') {
          return `${mapName} is the DECIDER MAP`;
        }
        return `${teamName} PICKED ${mapName}`;
      case 'side_select':
        return `${teamName} chose ${action.side?.toUpperCase()} on ${mapName}`;
      default:
        return `${teamName} - ${action.type}`;
    }
  };

  if (actionHistory.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3 text-center">Action History</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {actionHistory.map((action, index) => (
            <div
              key={action.id}
              className="flex items-center justify-between text-sm p-2 bg-gray-700 rounded"
            >
              <span className="text-gray-300">
                #{index + 1}
              </span>
              <span className="text-white flex-1 ml-3">
                {getActionDescription(action)}
              </span>
              <span className="text-gray-400 text-xs">
                {new Date(action.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionHistory;