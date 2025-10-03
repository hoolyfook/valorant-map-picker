import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { banMap, pickMap, selectSide, setGameFormat, setTeamName, startGame, resetGame, completeMatch } from '../store/gameSlice';
import { GameFormat } from '../types/game';

export const useGameState = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);

  const actions = {
    banMap: (teamId: string, mapId: string) => dispatch(banMap({ teamId, mapId })),
    pickMap: (teamId: string, mapId: string) => dispatch(pickMap({ teamId, mapId })),
    selectSide: (teamId: string, mapId: string, side: 'attack' | 'defense') => 
      dispatch(selectSide({ teamId, mapId, side })),
    setGameFormat: (format: GameFormat) => dispatch(setGameFormat(format)),
    setTeamName: (teamIndex: 0 | 1, name: string) => dispatch(setTeamName({ teamIndex, name })),
    startGame: () => dispatch(startGame()),
    resetGame: () => dispatch(resetGame()),
    completeMatch: () => dispatch(completeMatch())
  };

  return {
    ...gameState,
    actions
  };
};