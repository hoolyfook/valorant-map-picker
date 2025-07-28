import { useState, useCallback } from 'react';
import { GameState, GamePhase, Team, MapState, Side } from '../types/game';
import { valorantMaps } from '../data/maps';
import { generateSeriesId, addPickedMapsFromSeries } from '../data/recentlyPickedMaps';

const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const initializeGame = useCallback((team1Name: string, team2Name: string) => {
    const initialMapStates: MapState[] = valorantMaps.map(map => ({
      id: map.id,
      status: 'available' as const
    }));

    setGameState({
      phase: 'admin-setup',
      currentTeam: 'team1',
      mapStates: initialMapStates,
      selectedMaps: [],
      team1Name,
      team2Name,
      pickedMaps: [],
      seriesId: generateSeriesId()
    });
  }, []);

  const selectMapsForBanPick = useCallback((selectedMapIds: string[]) => {
    if (!gameState || gameState.phase !== 'admin-setup' || selectedMapIds.length !== 7) return;

    const filteredMapStates = gameState.mapStates.filter(state => 
      selectedMapIds.includes(state.id)
    );

    setGameState({
      ...gameState,
      phase: 'ban1',
      mapStates: filteredMapStates,
      selectedMaps: selectedMapIds
    });
  }, [gameState]);

  const getNextPhase = (currentPhase: GamePhase): { phase: GamePhase; team: Team } => {
    const phaseSequence: Array<{ phase: GamePhase; team: Team }> = [
      { phase: 'admin-setup', team: 'team1' },
      { phase: 'ban1', team: 'team1' },
      { phase: 'ban2', team: 'team2' },
      { phase: 'pick1', team: 'team1' },
      { phase: 'side-select1', team: 'team2' },
      { phase: 'pick2', team: 'team2' },
      { phase: 'side-select2', team: 'team1' },
      { phase: 'ban3', team: 'team1' },
      { phase: 'ban4', team: 'team2' },
      { phase: 'pick3', team: 'team1' },
      { phase: 'side-select3', team: 'team2' },
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

    // Check if only one map remains after this action
    const remainingAvailable = updatedMapStates.filter(state => state.status === 'available');
    
    let nextPhaseInfo;
    if (remainingAvailable.length === 1 && (isPickPhase || isBanPhase)) {
      // If only one map remains, go directly to final side selection
      nextPhaseInfo = { phase: 'side-select3' as const, team: (gameState.currentTeam === 'team1' ? 'team2' : 'team1') as Team };
    } else {
      nextPhaseInfo = getNextPhase(gameState.phase);
    }

    setGameState({
      ...gameState,
      mapStates: updatedMapStates,
      pickedMaps: updatedPickedMaps,
      phase: nextPhaseInfo.phase,
      currentTeam: nextPhaseInfo.team
    });
  }, [gameState]);

  const handleSideSelection = useCallback((side: Side) => {
    if (!gameState || !gameState.phase.includes('side-select')) return;

    // For decider map (side-select3), find the remaining available map
    let targetMap: MapState | undefined;
    if (gameState.phase === 'side-select3') {
      targetMap = gameState.mapStates.find(state => state.status === 'available');
    } else {
      // Find the latest picked map that doesn't have a side selected yet
      targetMap = gameState.mapStates
        .filter(state => state.status === 'picked' && !state.selectedSide)
        .pop();
    }

    if (!targetMap) return;

    const updatedMapStates = gameState.mapStates.map(state => {
      if (state.id === targetMap!.id) {
        if (gameState.phase === 'side-select3') {
          // For decider map, mark it as picked and set side
          return {
            ...state,
            status: 'picked' as const,
            pickedBy: 'decider' as any, // Special case for decider
            sideSelectedBy: gameState.currentTeam,
            selectedSide: side
          };
        } else {
          return {
            ...state,
            sideSelectedBy: gameState.currentTeam,
            selectedSide: side
          };
        }
      }
      return state;
    });

    const nextPhaseInfo = getNextPhase(gameState.phase);

    // If the game is completing, save picked maps to storage
    if (nextPhaseInfo.phase === 'completed') {
      addPickedMapsFromSeries(gameState.pickedMaps, gameState.seriesId);
    }

    setGameState({
      ...gameState,
      mapStates: updatedMapStates,
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
    selectMapsForBanPick,
    handleMapAction,
    handleSideSelection,
    resetGame
  };
};

export default useGameState;
