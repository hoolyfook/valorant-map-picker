import { useState, useCallback, useEffect } from 'react';
import { GameState, GamePhase, Team, MapState, Side } from '../types/game';
import { valorantMaps } from '../data/maps';
import { generateSeriesId, addPickedMapsFromSeries } from '../data/recentlyPickedMaps';

const GAME_STATE_KEY = 'valorant-map-picker-game-state';

const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(() => {
    // Load game state from localStorage on initialization
    try {
      const stored = localStorage.getItem(GAME_STATE_KEY);
      if (stored) {
        return JSON.parse(stored) as GameState;
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
    return null;
  });

  // Flag to prevent infinite loops when receiving broadcasts
  const [isUpdatingFromBroadcast, setIsUpdatingFromBroadcast] = useState(false);
  
  // Prevent rapid successive clicks
  const [isProcessing, setIsProcessing] = useState(false);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    // Don't save/broadcast if this update came from another tab
    if (isUpdatingFromBroadcast) {
      setIsUpdatingFromBroadcast(false);
      return;
    }

    if (gameState) {
      try {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
        // Broadcast change to other tabs only
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const channel = new BroadcastChannel('valorant-map-picker-sync');
          channel.postMessage({ type: 'GAME_STATE_UPDATE', gameState });
          channel.close();
        }
      } catch (error) {
        console.error('Error saving game state:', error);
      }
    } else {
      // Remove from localStorage when game state is null
      localStorage.removeItem(GAME_STATE_KEY);
      // Broadcast reset to other tabs only
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('valorant-map-picker-sync');
        channel.postMessage({ type: 'GAME_STATE_RESET' });
        channel.close();
      }
    }
  }, [gameState]);

  // Listen for game state changes from other tabs
  useEffect(() => {
    const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
      ? new BroadcastChannel('valorant-map-picker-sync') 
      : null;
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'GAME_STATE_UPDATE') {
        setIsUpdatingFromBroadcast(true);
        setGameState(event.data.gameState);
      } else if (event.data.type === 'GAME_STATE_RESET') {
        setIsUpdatingFromBroadcast(true);
        setGameState(null);
      }
    };

    // Fallback: listen for localStorage changes (for browsers without BroadcastChannel)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === GAME_STATE_KEY) {
        try {
          if (event.newValue) {
            const newGameState = JSON.parse(event.newValue) as GameState;
            setIsUpdatingFromBroadcast(true);
            setGameState(newGameState);
          } else {
            // Game was reset in another tab
            setIsUpdatingFromBroadcast(true);
            setGameState(null);
          }
        } catch (error) {
          console.error('Error parsing game state from storage event:', error);
        }
      }
    };

    if (channel) {
      channel.addEventListener('message', handleMessage);
    } else {
      // Fallback to storage events if BroadcastChannel is not available
      window.addEventListener('storage', handleStorageChange);
    }
    
    return () => {
      if (channel) {
        channel.removeEventListener('message', handleMessage);
        channel.close();
      } else {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, []);

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
    if (isProcessing) return; // Prevent rapid clicks
    setIsProcessing(true);
    
    setGameState(currentGameState => {
      if (!currentGameState) {
        setIsProcessing(false);
        return currentGameState;
      }

      const mapState = currentGameState.mapStates.find(state => state.id === mapId);
      if (!mapState || mapState.status !== 'available') {
        setIsProcessing(false);
        return currentGameState;
      }

      const isPickPhase = currentGameState.phase.includes('pick');
      const isBanPhase = currentGameState.phase.includes('ban');

      if (!isPickPhase && !isBanPhase) {
        setIsProcessing(false);
        return currentGameState;
      }

      const updatedMapStates = currentGameState.mapStates.map(state => {
        if (state.id === mapId) {
          if (isPickPhase) {
            return {
              ...state,
              status: 'picked' as const,
              pickedBy: currentGameState.currentTeam
            };
          } else {
            return {
              ...state,
              status: 'banned' as const,
              bannedBy: currentGameState.currentTeam
            };
          }
        }
        return state;
      });

      const updatedPickedMaps = isPickPhase 
        ? [...currentGameState.pickedMaps, mapId]
        : currentGameState.pickedMaps;

      // Check if only one map remains after this action
      const remainingAvailable = updatedMapStates.filter(state => state.status === 'available');
      
      let nextPhaseInfo;
      if (remainingAvailable.length === 1 && (isPickPhase || isBanPhase)) {
        // If only one map remains, go directly to final side selection
        nextPhaseInfo = { phase: 'side-select3' as const, team: (currentGameState.currentTeam === 'team1' ? 'team2' : 'team1') as Team };
      } else {
        nextPhaseInfo = getNextPhase(currentGameState.phase);
      }

      // Reset processing flag after a short delay
      setTimeout(() => setIsProcessing(false), 100);

      return {
        ...currentGameState,
        mapStates: updatedMapStates,
        pickedMaps: updatedPickedMaps,
        phase: nextPhaseInfo.phase,
        currentTeam: nextPhaseInfo.team
      };
    });
  }, [isProcessing]);

  const handleSideSelection = useCallback((side: Side) => {
    if (isProcessing) return; // Prevent rapid clicks
    setIsProcessing(true);
    
    setGameState(currentGameState => {
      if (!currentGameState || !currentGameState.phase.includes('side-select')) {
        setIsProcessing(false);
        return currentGameState;
      }

      // For decider map (side-select3), find the remaining available map
      let targetMap: MapState | undefined;
      if (currentGameState.phase === 'side-select3') {
        targetMap = currentGameState.mapStates.find(state => state.status === 'available');
      } else {
        // Find the latest picked map that doesn't have a side selected yet
        targetMap = currentGameState.mapStates
          .filter(state => state.status === 'picked' && !state.selectedSide)
          .pop();
      }

      if (!targetMap) {
        setIsProcessing(false);
        return currentGameState;
      }

      const updatedMapStates = currentGameState.mapStates.map(state => {
        if (state.id === targetMap!.id) {
          if (currentGameState.phase === 'side-select3') {
            // For decider map, mark it as picked and set side
            return {
              ...state,
              status: 'picked' as const,
              pickedBy: 'decider' as const, // Special case for decider
              sideSelectedBy: currentGameState.currentTeam,
              selectedSide: side
            };
          } else {
            return {
              ...state,
              sideSelectedBy: currentGameState.currentTeam,
              selectedSide: side
            };
          }
        }
        return state;
      });

      const nextPhaseInfo = getNextPhase(currentGameState.phase);

      // If the game is completing, save picked maps to storage
      if (nextPhaseInfo.phase === 'completed') {
        addPickedMapsFromSeries(currentGameState.pickedMaps, currentGameState.seriesId);
      }

      // Reset processing flag after a short delay
      setTimeout(() => setIsProcessing(false), 100);

      return {
        ...currentGameState,
        mapStates: updatedMapStates,
        phase: nextPhaseInfo.phase,
        currentTeam: nextPhaseInfo.team
      };
    });
  }, [isProcessing]);

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
