import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, GameFormat, Action, BanPickConfig } from '../types/game';
import { VALORANT_MAPS } from '../data/maps';

const initialState: GameState = {
  format: 'BO1',
  phase: 'setup',
  teams: [
    { id: 'team1', name: 'Team 1', color: 'red' },
    { id: 'team2', name: 'Team 2', color: 'blue' }
  ],
  maps: VALORANT_MAPS.map(map => ({ ...map, status: 'available' as const })),
  currentAction: null,
  actionHistory: [],
  matchResults: [],
  activeTeamIndex: 0,
  timer: undefined
};

const BAN_PICK_CONFIGS: Record<GameFormat, BanPickConfig> = {
  'BO1': {
    format: 'BO1',
    phases: ['setup', 'team_ban_1', 'team_ban_2', 'team_ban_3', 'team_ban_4', 'team_ban_5', 'team_ban_6', 'team_pick_1', 'side_selection', 'complete'],
    banCount: 6,
    pickCount: 1,
    requiresSideSelection: true
  },
  'BO3': {
    format: 'BO3',
    phases: ['setup', 'team_ban_1', 'team_ban_2', 'team_pick_1', 'team_pick_2', 'team_ban_3', 'team_ban_4', 'decider_selection', 'side_selection', 'complete'],
    banCount: 4,
    pickCount: 2,
    requiresSideSelection: true
  },
  'BO5': {
    format: 'BO5',
    phases: ['setup', 'team_ban_1', 'team_ban_2', 'auto_pick_remaining', 'side_selection', 'complete'],
    banCount: 2,
    pickCount: 5,
    requiresSideSelection: true
  }
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameFormat: (state, action: PayloadAction<GameFormat>) => {
      state.format = action.payload;
      state.phase = 'setup';
      state.maps = VALORANT_MAPS.map(map => ({ ...map, status: 'available' as const }));
      state.actionHistory = [];
      state.matchResults = [];
      state.activeTeamIndex = 0;
    },
    
    setTeamName: (state, action: PayloadAction<{ teamIndex: 0 | 1; name: string }>) => {
      state.teams[action.payload.teamIndex].name = action.payload.name;
    },
    
    startGame: (state) => {
      state.phase = 'team_ban_1';
      state.activeTeamIndex = 0;
    },
    
    banMap: (state, action: PayloadAction<{ teamId: string; mapId: string }>) => {
      const { teamId, mapId } = action.payload;
      const map = state.maps.find(m => m.id === mapId);
      
      if (map && map.status === 'available') {
        map.status = 'banned';
        map.bannedBy = teamId;
        
        const banAction: Action = {
          id: `${Date.now()}`,
          type: 'ban',
          teamId,
          mapId,
          timestamp: Date.now(),
          phase: state.phase
        };
        
        state.actionHistory.push(banAction);
        state.currentAction = banAction;
        
        // Progress to next phase
        const config = BAN_PICK_CONFIGS[state.format];
        const currentPhaseIndex = config.phases.indexOf(state.phase);
        if (currentPhaseIndex < config.phases.length - 1) {
          const nextPhase = config.phases[currentPhaseIndex + 1];
          
          // Handle auto pick remaining for BO5
          if (nextPhase === 'auto_pick_remaining') {
            const remainingMaps = state.maps.filter(m => m.status === 'available');
            remainingMaps.forEach(map => {
              map.status = 'picked';
              map.pickedBy = 'auto';
              
              state.matchResults.push({
                mapId: map.id,
                mapName: map.name,
                teamSides: {}
              });
            });
            
            // Skip to side selection
            state.phase = 'side_selection';
          }
          // Handle decider selection automatically (for BO3 after final ban)
          else if (nextPhase === 'decider_selection') {
            const remainingMaps = state.maps.filter(m => m.status === 'available');
            if (remainingMaps.length === 1) {
              const deciderMap = remainingMaps[0];
              deciderMap.status = 'picked';
              deciderMap.pickedBy = 'decider';
              
              // Add decider action to history
              const deciderAction: Action = {
                id: `${Date.now()}`,
                type: 'pick',
                teamId: 'decider',
                mapId: deciderMap.id,
                timestamp: Date.now(),
                phase: 'decider_selection'
              };
              
              state.actionHistory.push(deciderAction);
              state.currentAction = deciderAction;
              
              state.matchResults.push({
                mapId: deciderMap.id,
                mapName: deciderMap.name,
                teamSides: {}
              });
              
              // Skip to side selection
              state.phase = 'side_selection';
            }
          } else {
            state.phase = nextPhase;
            state.activeTeamIndex = state.activeTeamIndex === 0 ? 1 : 0;
          }
        }
      }
    },
    
    pickMap: (state, action: PayloadAction<{ teamId: string; mapId: string }>) => {
      const { teamId, mapId } = action.payload;
      const map = state.maps.find(m => m.id === mapId);
      
      if (map && map.status === 'available') {
        map.status = 'picked';
        map.pickedBy = teamId;
        
        const pickAction: Action = {
          id: `${Date.now()}`,
          type: 'pick',
          teamId,
          mapId,
          timestamp: Date.now(),
          phase: state.phase
        };
        
        state.actionHistory.push(pickAction);
        state.currentAction = pickAction;
        
        // Add to match results
        state.matchResults.push({
          mapId,
          mapName: map.name,
          teamSides: {}
        });
        
        // Progress to next phase
        const config = BAN_PICK_CONFIGS[state.format];
        const currentPhaseIndex = config.phases.indexOf(state.phase);
        if (currentPhaseIndex < config.phases.length - 1) {
          const nextPhase = config.phases[currentPhaseIndex + 1];
          
          // Handle decider selection automatically
          if (nextPhase === 'decider_selection') {
            const remainingMaps = state.maps.filter(m => m.status === 'available');
            if (remainingMaps.length === 1) {
              const deciderMap = remainingMaps[0];
              deciderMap.status = 'picked';
              deciderMap.pickedBy = 'decider';
              
              // Add decider action to history
              const deciderAction: Action = {
                id: `${Date.now()}`,
                type: 'pick',
                teamId: 'decider',
                mapId: deciderMap.id,
                timestamp: Date.now(),
                phase: 'decider_selection'
              };
              
              state.actionHistory.push(deciderAction);
              state.currentAction = deciderAction;
              
              state.matchResults.push({
                mapId: deciderMap.id,
                mapName: deciderMap.name,
                teamSides: {}
              });
              
              // Skip to side selection
              state.phase = 'side_selection';
            }
          } else {
            state.phase = nextPhase;
            state.activeTeamIndex = state.activeTeamIndex === 0 ? 1 : 0;
          }
        }
      }
    },
    
    selectSide: (state, action: PayloadAction<{ teamId: string; mapId: string; side: 'attack' | 'defense' }>) => {
      const { teamId, mapId, side } = action.payload;
      const matchResult = state.matchResults.find(mr => mr.mapId === mapId);
      
      if (matchResult) {
        matchResult.teamSides[teamId] = side;
        
        // Set opposite side for other team
        const otherTeam = state.teams.find(t => t.id !== teamId);
        if (otherTeam) {
          matchResult.teamSides[otherTeam.id] = side === 'attack' ? 'defense' : 'attack';
        }
        
        const sideAction: Action = {
          id: `${Date.now()}`,
          type: 'side_select',
          teamId,
          mapId,
          side,
          timestamp: Date.now(),
          phase: state.phase
        };
        
        state.actionHistory.push(sideAction);
        state.currentAction = sideAction;
      }
    },
    
    completeMatch: (state) => {
      state.phase = 'complete';
      state.currentAction = null;
    },
    
    resetGame: (state) => {
      return { 
        ...initialState, 
        teams: state.teams,
        format: state.format
      };
    }
  }
});

export const {
  setGameFormat,
  setTeamName,
  startGame,
  banMap,
  pickMap,
  selectSide,
  completeMatch,
  resetGame
} = gameSlice.actions;

export default gameSlice.reducer;