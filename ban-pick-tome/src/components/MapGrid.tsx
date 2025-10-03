import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { banMap, pickMap } from '../store/gameSlice';
import MapCard from './MapCard';

const MapGrid: React.FC = () => {
  const dispatch = useDispatch();
  const { maps, phase, teams, activeTeamIndex } = useSelector((state: RootState) => state.game);
  
  // Don't show MapGrid during setup
  if (phase === 'setup') {
    return null;
  }
  
  const currentTeam = teams[activeTeamIndex];
  const isBanPhase = phase.includes('ban');
  const isPickPhase = phase.includes('pick');

  const handleMapAction = (mapId: string) => {
    if (isBanPhase) {
      dispatch(banMap({ teamId: currentTeam.id, mapId }));
    } else if (isPickPhase) {
      dispatch(pickMap({ teamId: currentTeam.id, mapId }));
    }
  };

  const isDisabled = phase === 'complete' || phase === 'side_selection';

  return (
    <div className="w-full flex justify-center p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {maps.map((map) => (
          <MapCard
            key={map.id}
            map={map}
            onBan={isBanPhase ? () => handleMapAction(map.id) : undefined}
            onPick={isPickPhase ? () => handleMapAction(map.id) : undefined}
            disabled={isDisabled}
          />
        ))}
      </div>
    </div>
  );
};

export default MapGrid;