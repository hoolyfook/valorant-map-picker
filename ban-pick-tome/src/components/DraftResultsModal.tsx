import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { resetGame } from '../store/gameSlice';

interface DraftResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DraftResultsModal: React.FC<DraftResultsModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { matchResults, teams, format, maps } = useSelector((state: RootState) => state.game);

  console.log('Modal render - isOpen:', isOpen, 'matchResults:', matchResults); // Debug log

  if (!isOpen) return null;

  const handleNewDraft = () => {
    dispatch(resetGame());
    onClose();
  };

  const getTeamName = (teamId: string) => {
    if (teamId === 'decider') return 'DECIDER';
    return teams.find(team => team.id === teamId)?.name || teamId;
  };

  const getTeamColor = (teamId: string) => {
    if (teamId === 'decider') return 'text-yellow-400';
    const team = teams.find(t => t.id === teamId);
    return team?.color === 'red' ? 'text-red-400' : 'text-blue-400';
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border-2 border-gray-600 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-blue-600 p-4 rounded-t-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-1">🏆 DRAFT COMPLETE 🏆</h1>
            <p className="text-lg text-gray-200">
              {format} Format • {matchResults?.length || 0} Map{(matchResults?.length || 0) > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Maps Results */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-3 text-center">📍 RESULTS</h3>
          
          {matchResults?.length > 0 ? (
            <div className="space-y-3">
              {matchResults.map((result, index) => {
                // Find who picked this map
                const mapData = maps.find(m => m.id === result.mapId);
                const pickedBy = mapData?.pickedBy || 'unknown';
                
                // Find which team has defense
                const defenseTeam = teams.find(team => 
                  result.teamSides[team.id] === 'defense'
                );
                
                return (
                  <div 
                    key={result.mapId} 
                    className="relative rounded-lg overflow-hidden border border-gray-700 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${mapData?.image || ''}')`,
                      minHeight: '120px'
                    }}
                  >
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/70"></div>
                    
                    <div className="relative z-10 p-4">
                      <div className="grid grid-cols-3 gap-4 items-center text-center">
                        {/* Map Name */}
                        <div>
                          <h4 className="text-xl font-bold text-white drop-shadow-lg">
                            {result.mapName.toUpperCase()}
                          </h4>
                          <p className="text-sm text-gray-200 drop-shadow">Game {index + 1}</p>
                        </div>
                        
                        {/* Picked By */}
                        <div>
                          <p className="text-sm text-gray-200 drop-shadow mb-1">Picked by</p>
                          <p className={`text-lg font-bold drop-shadow-lg ${getTeamColor(pickedBy)}`}>
                            {getTeamName(pickedBy)}
                          </p>
                        </div>
                        
                        {/* Defense Team */}
                        <div>
                          <p className="text-sm text-gray-200 drop-shadow mb-1">Defense</p>
                          <p className={`text-lg font-bold drop-shadow-lg ${defenseTeam ? getTeamColor(defenseTeam.id) : 'text-gray-300'}`}>
                            {defenseTeam ? defenseTeam.name : 'TBD'} 🛡️
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">No match results available yet.</p>
              <p className="text-gray-500 text-sm mt-2">Complete a draft to see results here.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-800/50 p-6 rounded-b-xl border-t border-gray-700">
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Close Results
            </button>
            <button
              onClick={handleNewDraft}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              🔄 New Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftResultsModal;
