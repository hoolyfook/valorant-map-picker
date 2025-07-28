import { useState, useCallback } from 'react';
import { GameState, GamePhase, Team, MapState } from '../types/game';
import { valorantMaps } from '../data/maps';

const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const initializeGame = useCallback((team1Name: string, team2Name: string) => {
    const initialMapStates: MapState[] = valorantMaps.map(map => ({
      id: map.id,
      status: 'available' as const
    }));

    setGameState({
      phase: 'ban1',
      currentTeam: 'team1',
      mapStates: initialMapStates,
      team1Name,
      team2Name,
      pickedMaps: []
    });
  }, []);

  const getNextPhase = (currentPhase: GamePhase): { phase: GamePhase; team: Team } => {
    const phaseSequence: Array<{ phase: GamePhase; team: Team }> = [
      { phase: 'ban1', team: 'team1' },
      { phase: 'ban2', team: 'team2' },
      { phase: 'pick1', team: 'team1' },
      { phase: 'pick2', team: 'team2' },
      { phase: 'ban3', team: 'team1' },
      { phase: 'ban4', team: 'team2' },
      { phase: 'pick3', team: 'team1' },
      { phase: 'completed', team: 'team1' }
    ];

    const currentIndex = phaseSequence.findIndex(p => p.phase === currentPhase);
    return phaseSequence[currentIndex + 1] || { phase: 'completed', team: 'team1' };
  };

  const handleMapAction = useCallback((mapId: string) => {
    if (!gameState) return;

    const mapState = gameState.mapStates.find(state => state.id === mapId);
    if (!mapState || mapState.status !== 'available') return;

    const isPickPhase = gameState.phase.includes('pick');
    const isBanPhase = gameState.phase.includes('ban');

    if (!isPickPhase && !isBanPhase) return;

    const updatedMapStates = gameState.mapStates.map(state => {
      if (state.id === mapId) {
        if (isPickPhase) {
          return {
            ...state,
            status: 'picked' as const,
            pickedBy: gameState.currentTeam
          };
        } else {
          return {
            ...state,
            status: 'banned' as const,
            bannedBy: gameState.currentTeam
          };
        }
      }
      return state;
    });

    const updatedPickedMaps = isPickPhase 
      ? [...gameState.pickedMaps, mapId]
      : gameState.pickedMaps;

    const nextPhaseInfo = getNextPhase(gameState.phase);

    setGameState({
      ...gameState,
      mapStates: updatedMapStates,
      pickedMaps: updatedPickedMaps,
      phase: nextPhaseInfo.phase,
      currentTeam: nextPhaseInfo.team
    });
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(null);
  }, []);

  return {
    gameState,
    initializeGame,
    handleMapAction,
    resetGame
  };
};

export default useGameState;
