export type MapStatus = 'available' | 'banned' | 'picked';

export type GamePhase = 'ban1' | 'ban2' | 'pick1' | 'pick2' | 'ban3' | 'ban4' | 'pick3' | 'completed';

export type Team = 'team1' | 'team2';

export interface MapState {
  id: string;
  status: MapStatus;
  bannedBy?: Team;
  pickedBy?: Team;
}

export interface GameState {
  phase: GamePhase;
  currentTeam: Team;
  mapStates: MapState[];
  team1Name: string;
  team2Name: string;
  pickedMaps: string[];
}

export const phaseDescriptions: Record<GamePhase, string> = {
  ban1: 'Ban Phase 1',
  ban2: 'Ban Phase 2', 
  pick1: 'Pick Phase 1',
  pick2: 'Pick Phase 2',
  ban3: 'Ban Phase 3',
  ban4: 'Ban Phase 4',
  pick3: 'Final Pick',
  completed: 'Completed'
};
