import { GameFormat, GamePhase, BanPickConfig } from '../types/game';

export const BAN_PICK_CONFIGS: Record<GameFormat, BanPickConfig> = {
  'BO1': {
    format: 'BO1',
    phases: ['setup', 'team_ban_1', 'team_ban_2', 'team_ban_3', 'team_ban_4', 'team_ban_5', 'team_ban_6', 'team_pick_1', 'side_selection', 'complete'],
    banCount: 6,
    pickCount: 1,
    requiresSideSelection: true
  },
  'BO3': {
    format: 'BO3',
    phases: ['setup', 'team_ban_1', 'team_ban_2', 'team_pick_1', 'team_pick_2', 'decider_selection', 'side_selection', 'complete'],
    banCount: 2,
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

export const getNextPhase = (currentPhase: GamePhase, format: GameFormat): GamePhase => {
  const config = BAN_PICK_CONFIGS[format];
  const currentIndex = config.phases.indexOf(currentPhase);
  
  if (currentIndex === -1 || currentIndex >= config.phases.length - 1) {
    return currentPhase;
  }
  
  return config.phases[currentIndex + 1];
};

export const isValidAction = (
  phase: GamePhase, 
  actionType: 'ban' | 'pick', 
  _format: GameFormat
): boolean => {
  if (actionType === 'ban') {
    return phase.includes('ban');
  }
  
  if (actionType === 'pick') {
    return phase.includes('pick');
  }
  
  return false;
};

export const getPhaseDescription = (phase: GamePhase, teamName: string): string => {
  switch (phase) {
    case 'setup':
      return 'Configure teams and format';
    case 'team_ban_1':
    case 'team_ban_2':
    case 'team_ban_3':
    case 'team_ban_4':
    case 'team_ban_5':
    case 'team_ban_6':
      return `${teamName} - BAN a map`;
    case 'team_pick_1':
    case 'team_pick_2':
    case 'team_pick_3':
    case 'team_pick_4':
    case 'team_pick_5':
      return `${teamName} - PICK a map`;
    case 'decider_selection':
      return 'Remaining map is the decider';
    case 'auto_pick_remaining':
      return 'All remaining maps selected automatically';
    case 'side_selection':
      return 'Select sides for each map';
    case 'complete':
      return 'Draft complete!';
    default:
      return phase;
  }
};