export type GameFormat = 'BO1' | 'BO3' | 'BO5';

export type GamePhase = 
  | 'setup'
  | 'team_ban_1'
  | 'team_ban_2'
  | 'team_ban_3'
  | 'team_ban_4'
  | 'team_ban_5'
  | 'team_ban_6'
  | 'team_pick_1'
  | 'team_pick_2'
  | 'team_pick_3'
  | 'team_pick_4'
  | 'team_pick_5'
  | 'decider_selection'
  | 'auto_pick_remaining'
  | 'side_selection'
  | 'complete';

export type ActionType = 'ban' | 'pick' | 'side_select';

export type Side = 'attack' | 'defense';

export type TeamId = string;

export type MapId = string;

export interface Team {
  id: TeamId;
  name: string;
  color: 'red' | 'blue';
}

export interface ValorantMap {
  id: MapId;
  name: string;
  image: string;
  status: 'available' | 'banned' | 'picked';
  bannedBy?: TeamId;
  pickedBy?: TeamId | 'decider' | 'auto';
}

export interface Action {
  id: string;
  type: ActionType;
  teamId: TeamId | 'decider';
  mapId?: MapId;
  side?: Side;
  timestamp: number;
  phase: GamePhase;
}

export interface MatchResult {
  mapId: MapId;
  mapName: string;
  teamSides: Record<TeamId, Side>;
}

export interface GameState {
  format: GameFormat;
  phase: GamePhase;
  teams: [Team, Team];
  maps: ValorantMap[];
  currentAction: Action | null;
  actionHistory: Action[];
  matchResults: MatchResult[];
  timer?: number;
  activeTeamIndex: number;
}

export interface BanPickConfig {
  format: GameFormat;
  phases: GamePhase[];
  banCount: number;
  pickCount: number;
  requiresSideSelection: boolean;
}

// Event Handler Types
export type MapClickHandler = () => void;

export type TeamChangeHandler = (teamIndex: 0 | 1, name: string) => void;

export type FormatChangeHandler = (format: GameFormat) => void;

export type SideSelectionHandler = (mapId: MapId, teamId: TeamId, side: Side) => void;

// React Event Types
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
export type DivClickEvent = React.MouseEvent<HTMLDivElement>;