# Valorant Map Ban/Pick System - Development Instructions

## Project Overview
A comprehensive tournament-grade Valorant map ban/pick system supporting BO1, BO3, and BO5 formats with real-time side selection mechanics.

## Tech Stack
- **Frontend**: React 18+ with TypeScript
- **Styling**: TailwindCSS for utility-first design
- **State Management**: Redux Toolkit for complex game state
- **Real-time**: Socket.io (optional) for admin/viewer sync
- **Build Tool**: Vite for fast development
- **PDF Export**: react-to-print for match results

## Game Formats & Rules

### BO1 Format
- 6 bans (3 per team, alternating)
- 1 pick (remaining map)
- Side selection by team that didn't get map pick

### BO3 Format  
- 2 bans (1 per team)
- 2 picks (1 per team, alternating)
- 1 decider (from remaining maps)
- Side selection rules per map

### BO5 Format
- 2 bans (1 per team) 
- 5 picks (all remaining maps played)
- Side selection rules per map

## Core Components Architecture

### State Management (Redux)
```typescript
interface GameState {
  format: 'BO1' | 'BO3' | 'BO5'
  phase: GamePhase
  teams: [Team, Team]
  maps: Map[]
  currentAction: Action | null
  actionHistory: Action[]
  matchResults: MatchResult[]
  timer?: number
}
```

### Essential Components
1. **MapCard** - Individual map display with ban/pick states
2. **MapGrid** - Grid layout of all Valorant maps
3. **BanPickPhase** - Current phase indicator and controls
4. **TeamInfo** - Team details and action queue
5. **ActionHistory** - Timeline of all ban/pick actions
6. **SideSelection** - Attack/Defense choice interface
7. **AdminControls** - Match management and reset functions
8. **Timer** - Optional countdown for time-limited phases

## Map Pool (11 Maps)
- Ascent, Bind, Breeze, Haven, Icebox, Lotus, Pearl, Split, Sunset, Fracture, Abyss

## Development Priorities

### Phase 1: Core System
- [ ] Redux store setup with game state
- [ ] Map grid with interactive ban/pick
- [ ] Basic BO1/BO3/BO5 format switching
- [ ] Action history tracking

### Phase 2: Enhanced Features  
- [ ] Side selection system
- [ ] Timer functionality
- [ ] Admin controls
- [ ] PDF export for match results

### Phase 3: Polish
- [ ] Responsive design
- [ ] Animations and transitions
- [ ] Error handling
- [ ] Match replay system

## Key Implementation Notes

### Game Flow Logic
- Each format has specific phase progression
- Side selection follows competitive Valorant rules
- State transitions must be atomic and validated
- Action history enables replay/undo functionality

### UI/UX Requirements
- Clear visual distinction between banned/picked/available maps
- Intuitive phase progression indicators
- Real-time updates for all participants
- Professional tournament-ready interface

### Code Quality Standards
- TypeScript strict mode enabled
- Component prop validation
- Comprehensive error boundaries
- Unit tests for game logic
- ESLint + Prettier configuration

## File Structure
```
src/
├── components/          # React components
├── store/              # Redux store and slices
├── types/              # TypeScript definitions
├── utils/              # Helper functions
├── hooks/              # Custom React hooks
├── assets/             # Images and static files
└── pages/              # Main application pages
```

## Getting Started Checklist
1. ✅ Create copilot-instructions.md
2. [ ] Initialize React TypeScript project with Vite
3. [ ] Install dependencies (Redux, TailwindCSS, etc.)
4. [ ] Set up basic project structure
5. [ ] Implement core game state management
6. [ ] Build map grid and card components
7. [ ] Add ban/pick interaction logic
8. [ ] Implement side selection system
9. [ ] Add admin controls and timer
10. [ ] Style with TailwindCSS
11. [ ] Test all game formats thoroughly
12. [ ] Add PDF export functionality

## Critical Success Factors
- Game logic must handle all edge cases correctly
- Side selection rules must follow official Valorant competitive format
- Real-time state synchronization if using Socket.io
- Professional UI suitable for live tournament broadcast
- Comprehensive error handling and validation