# Valorant Map Ban/Pick System

A comprehensive tournament-grade Valorant map ban/pick system supporting BO1, BO3, and BO5 formats with real-time side selection mechanics.

## 🎮 Features

- **Multiple Game Formats**:
  - **BO1**: 6 bans (3 per team) + 1 pick (remaining map)
  - **BO3**: 2 bans (1 per team) + 2 picks + 1 decider
  - **BO5**: 2 bans (1 per team) + 5 picks (all remaining maps)

- **Professional Tournament Tools**:
  - Real-time ban/pick phase progression
  - Side selection (Attack/Defense) system
  - Action history tracking
  - Match result recording
  - Admin controls and reset functionality

- **Modern Tech Stack**:
  - React 18+ with TypeScript
  - Redux Toolkit for state management
  - TailwindCSS for styling
  - Vite for fast development

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ban-pick-tome
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🗺️ Map Pool

The system includes all 11 current competitive Valorant maps:
- Ascent, Bind, Breeze, Haven, Icebox
- Lotus, Pearl, Split, Sunset, Fracture, Abyss

## 🎯 Game Flow

### BO1 Format
1. **Setup**: Configure team names and select BO1 format
2. **Ban Phase**: Teams alternate banning 6 maps (3 each)
3. **Pick Phase**: Remaining map is automatically selected
4. **Side Selection**: Team that didn't get their preferred map chooses side
5. **Complete**: Match ready with map and sides determined

### BO3 Format
1. **Setup**: Configure team names and select BO3 format
2. **Ban Phase**: Teams ban 1 map each
3. **Pick Phase**: Teams alternate picking 2 maps
4. **Decider**: Remaining map becomes the decider
5. **Side Selection**: Side selection for each map
6. **Complete**: Match ready with 3 maps and sides

### BO5 Format
1. **Setup**: Configure team names and select BO5 format
2. **Ban Phase**: Teams ban 1 map each
3. **Pick Phase**: All remaining 9 maps are played
4. **Side Selection**: Side selection for each map
5. **Complete**: Match ready with 5 maps and sides

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── MapCard.tsx          # Individual map display
│   ├── MapGrid.tsx          # Grid of all maps
│   ├── GameHeader.tsx       # Game controls and phase display
│   ├── ActionHistory.tsx    # Ban/pick timeline
│   └── SideSelection.tsx    # Attack/Defense selection
├── store/
│   ├── gameSlice.ts         # Redux game state logic
│   └── index.ts             # Store configuration
├── types/
│   └── game.ts              # TypeScript definitions
├── data/
│   └── maps.ts              # Map pool data
└── utils/
    └── gameLogic.ts         # Game flow utilities
```

### State Management

The application uses Redux Toolkit for predictable state management:

```typescript
interface GameState {
  format: 'BO1' | 'BO3' | 'BO5'
  phase: GamePhase
  teams: [Team, Team]
  maps: ValorantMap[]
  currentAction: Action | null
  actionHistory: Action[]
  matchResults: MatchResult[]
  activeTeamIndex: number
}
```

## 🎨 Styling

The project uses TailwindCSS with custom Valorant-themed colors:

- **Valorant Red**: `#FF4655`
- **Valorant Blue**: `#389BFF` 
- **Dark Background**: `#0F1419`
- **Light Text**: `#ECE8E1`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

The project enforces strict TypeScript and includes:
- ESLint configuration
- TypeScript strict mode
- Component prop validation
- Comprehensive error boundaries

## 🎯 Usage Guide

### Basic Setup
1. Enter team names in the setup phase
2. Select desired game format (BO1, BO3, or BO5)
3. Click "Start Draft" to begin

### Ban/Pick Phase
- Maps available for action are highlighted
- Click on a map to ban or pick (based on current phase)
- Phase automatically progresses after each action
- Current team and action type are clearly displayed

### Side Selection
- After all maps are determined, select Attack/Defense
- System automatically assigns opposite side to other team
- Complete all side selections to finish draft

### Admin Controls
- Reset game at any time to start over
- Action history tracks all moves for replay/review
- Export match results (future feature)

## 🚀 Deployment

The application can be deployed to any static hosting service:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3
   - Any static host

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎮 Tournament Usage

This system is designed for professional esports tournaments and includes:
- Tournament-ready interface suitable for broadcast
- Real-time state synchronization capabilities
- Comprehensive error handling and validation
- Professional visual design matching Valorant aesthetics

Perfect for:
- Professional esports tournaments
- Community competitions
- Scrimmage organization
- Tournament broadcasts
- Team practice sessions