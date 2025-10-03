import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectSide, completeMatch } from '../store/gameSlice';
import { MapId, TeamId, Side } from '../types/game';

const SideSelection: React.FC = () => {
  const dispatch = useDispatch();
  const { matchResults, teams, phase } = useSelector((state: RootState) => state.game);

  if (phase !== 'side_selection') {
    return null;
  }

  const handleSideSelection = (mapId: MapId, teamId: TeamId, side: Side): void => {
    dispatch(selectSide({ teamId, mapId, side }));
  };

  const allSidesSelected: boolean = matchResults.every(result => 
    teams.every(team => result.teamSides[team.id])
  );

  const handleComplete = (): void => {
    if (allSidesSelected) {
      dispatch(completeMatch());
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Side Selection
      </h2>
      
      <div className="space-y-4">
        {matchResults.map((result, index) => (
          <div key={result.mapId} className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Map {index + 1}: {result.mapName}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map(team => (
                <div key={team.id} className="space-y-2">
                  <div className={`font-semibold ${team.color === 'red' ? 'text-valorant-red' : 'text-valorant-blue'}`}>
                    {team.name}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSideSelection(result.mapId, team.id, 'attack')}
                      disabled={!!result.teamSides[team.id]}
                      className={`px-4 py-2 rounded font-semibold transition-all ${
                        result.teamSides[team.id] === 'attack'
                          ? 'bg-orange-600 text-white'
                          : result.teamSides[team.id]
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      Attack
                    </button>
                    
                    <button
                      onClick={() => handleSideSelection(result.mapId, team.id, 'defense')}
                      disabled={!!result.teamSides[team.id]}
                      className={`px-4 py-2 rounded font-semibold transition-all ${
                        result.teamSides[team.id] === 'defense'
                          ? 'bg-blue-600 text-white'
                          : result.teamSides[team.id]
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      Defense
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {allSidesSelected && (
        <div className="text-center mt-6">
          <button
            onClick={handleComplete}
            className="btn-primary bg-green-600 hover:bg-green-700 text-white"
          >
            Complete Draft
          </button>
        </div>
      )}
    </div>
  );
};

export default SideSelection;