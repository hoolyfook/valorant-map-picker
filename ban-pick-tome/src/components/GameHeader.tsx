import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setGameFormat, setTeamName, startGame, resetGame } from '../store/gameSlice';
import { GameFormat } from '../types/game';

const GameHeader: React.FC = () => {
  const dispatch = useDispatch();
  const { format, phase, teams, activeTeamIndex } = useSelector((state: RootState) => state.game);
  
  const currentTeam = teams[activeTeamIndex];

  const handleFormatChange = (newFormat: GameFormat): void => {
    dispatch(setGameFormat(newFormat));
  };

  const handleTeamNameChange = (teamIndex: 0 | 1, name: string): void => {
    dispatch(setTeamName({ teamIndex, name }));
  };

  const getPhaseDescription = (): string => {
    switch (phase) {
      case 'setup':
        return 'Configure teams and format';
      case 'team_ban_1':
      case 'team_ban_2':
      case 'team_ban_3':
      case 'team_ban_4':
      case 'team_ban_5':
      case 'team_ban_6':
        return `${currentTeam.name} - BAN a map`;
      case 'team_pick_1':
      case 'team_pick_2':
      case 'team_pick_3':
      case 'team_pick_4':
      case 'team_pick_5':
        return `${currentTeam.name} - PICK a map`;
      case 'decider_selection':
        return 'Remaining map is the decider';
      case 'auto_pick_remaining':
        return 'Tất cả map còn lại được chọn tự động';
      case 'side_selection':
        return 'Select sides for each map';
      case 'complete':
        return 'Draft complete!';
      default:
        return phase;
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 w-full">
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Format Selection */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-semibold text-gray-300">Format:</label>
          <select
            value={format}
            onChange={(e) => handleFormatChange(e.target.value as GameFormat)}
            disabled={phase !== 'setup'}
            className="px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
          >
            <option value="BO1">Best of 1</option>
            <option value="BO3">Best of 3</option>
            <option value="BO5">Best of 5</option>
          </select>
        </div>

        {/* Team Names */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          {teams.map((team, index) => (
            <div key={team.id} className="flex flex-col items-center gap-2">
              <label className={`text-sm font-semibold ${team.color === 'red' ? 'text-valorant-red' : 'text-valorant-blue'}`}>
                Team {index + 1}:
              </label>
              <input
                type="text"
                value={team.name}
                onChange={(e) => handleTeamNameChange(index as 0 | 1, e.target.value)}
                disabled={phase !== 'setup'}
                className="px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-center"
                placeholder={`Team ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          {phase === 'setup' && (
            <button
              onClick={() => dispatch(startGame())}
              className="btn-primary bg-green-600 hover:bg-green-700 text-white"
            >
              Start Draft
            </button>
          )}
          
          {phase !== 'setup' && (
            <button
              onClick={() => dispatch(resetGame())}
              className="btn-primary bg-gray-600 hover:bg-gray-700 text-white"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Current Phase */}
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold text-white">
          {getPhaseDescription()}
        </div>
        {phase !== 'setup' && phase !== 'complete' && (
          <div className={`text-lg mt-2 ${currentTeam.color === 'red' ? 'text-valorant-red' : 'text-valorant-blue'}`}>
            Current: {currentTeam.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameHeader;