export type MapStatus = 'available' | 'banned' | 'picked';

export type GamePhase = 'admin-setup' | 'ban1' | 'ban2' | 'pick1' | 'side-select1' | 'pick2' | 'side-select2' | 'ban3' | 'ban4' | 'pick3' | 'side-select3' | 'completed';

export type Team = 'team1' | 'team2';

export type Side = 'attack' | 'defense';

export interface MapState {
  id: string;
  status: MapStatus;
  bannedBy?: Team;
  pickedBy?: Team | 'decider';
  sideSelectedBy?: Team;
  selectedSide?: Side;
}

export interface GameState {
  phase: GamePhase;
  currentTeam: Team;
  mapStates: MapState[];
  selectedMaps: string[]; // 7 maps selected by admin
  team1Name: string;
  team2Name: string;
  pickedMaps: string[];
  seriesId: string; // Unique identifier for this BO7 series
}

export const phaseDescriptions: Record<GamePhase, string> = {
  'admin-setup': 'Admin Setup - Select 7 Maps',
  ban1: 'Ban Phase 1',
  ban2: 'Ban Phase 2', 
  pick1: 'Pick Phase 1',
  'side-select1': 'Side Selection 1',
  pick2: 'Pick Phase 2',
  'side-select2': 'Side Selection 2',
  ban3: 'Ban Phase 3',
  ban4: 'Ban Phase 4',
  pick3: 'Final Pick',
  'side-select3': 'Final Side Selection',
  completed: 'Completed'
};
