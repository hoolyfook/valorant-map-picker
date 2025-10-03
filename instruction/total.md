# 📋 Instructions: Valorant Map Ban/Pick System

## 🎯 Mục tiêu

Xây dựng web application để thực hiện **Ban/Pick Map** trong Valorant theo format thi đấu chính thức:

- **Best of 1 (BO1)**: Ban-Ban-Ban-Ban-Ban-Ban-Pick
- **Best of 3 (BO3)**: Ban-Ban-Pick-Pick-Decider
- **Best of 5 (BO5)**: Ban-Ban-Pick-Pick-Pick-Pick-Decider
- Giao diện trực quan, real-time cho cả admin và viewer
- Hỗ trợ multiple rooms/matches đồng thời

---

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS
- **State Management**: Redux Toolkit hoặc Zustand
- **Real-time**: Socket.io (optional) hoặc polling
- **UI Components**: Headless UI hoặc Radix UI
- **Data**: JSON files hoặc Firebase/Supabase

---

## 📂 Cấu trúc Project

```
src/
├── components/
│   ├── MapCard.tsx           // Hiển thị từng map
│   ├── MapGrid.tsx           // Grid layout maps
│   ├── BanPickPhase.tsx      // Phase hiện tại
│   ├── TeamInfo.tsx          // Thông tin đội
│   ├── ActionHistory.tsx     // Lịch sử ban/pick
│   ├── Timer.tsx             // Đếm ngược thời gian
│   └── AdminControls.tsx     // Controls cho admin
│
├── pages/
│   ├── Admin.tsx             // Trang admin điều khiển
│   ├── Display.tsx           // Trang hiển thị cho viewer
│   └── Room/[id].tsx         // Phòng cụ thể
│
├── store/
│   ├── gameSlice.ts          // Game state management
│   └── index.ts              // Store configuration
│
├── types/
│   ├── game.ts               // Game types & interfaces
│   └── maps.ts               // Map data types
│
├── data/
│   ├── maps.json             // Danh sách maps Valorant
│   └── formats.json          // Các format thi đấu
│
└── utils/
    ├── gameLogic.ts          // Logic ban/pick
    └── validation.ts         // Validate actions
```

---

## 🗺️ Map Data Structure

```json
{
  "maps": [
    {
      "id": "ascent",
      "name": "Ascent", 
      "image": "/images/maps/ascent.jpg",
      "category": "active"
    },
    {
      "id": "bind",
      "name": "Bind",
      "image": "/images/maps/bind.jpg", 
      "category": "active"
    }
  ]
}
```

---

## 🎮 Game State Schema

```typescript
interface GameState {
  id: string;
  format: 'BO1' | 'BO3' | 'BO5';
  phase: GamePhase;
  currentTeam: 'team1' | 'team2';
  
  teams: {
    team1: { name: string; score: number };
    team2: { name: string; score: number };
  };
  
  maps: {
    [mapId: string]: {
      status: 'available' | 'banned' | 'picked' | 'decider';
      bannedBy?: 'team1' | 'team2';
      pickedBy?: 'team1' | 'team2' | 'decider';
      sideSelectedBy?: 'team1' | 'team2';
      selectedSide?: 'attack' | 'defense';
    };
  };
  
  // Danh sách maps đã được pick và cần chọn side
  pickedMaps: {
    mapId: string;
    pickedBy: 'team1' | 'team2' | 'decider';
    sideSelectedBy?: 'team1' | 'team2';
    selectedSide?: 'attack' | 'defense';
  }[];
  
  history: Action[];
  timer?: { duration: number; remaining: number };
}

type GamePhase = 
  | 'setup'           // Cài đặt ban đầu
  | 'ban1_team1'      // Team 1 ban map đầu
  | 'ban1_team2'      // Team 2 ban map đầu
  | 'ban2_team1'      // Team 1 ban map thứ 2 (BO1)
  | 'ban2_team2'      // Team 2 ban map thứ 2 (BO1)
  | 'ban3_team1'      // Team 1 ban map thứ 3 (BO1)
  | 'ban3_team2'      // Team 2 ban map thứ 3 (BO1)
  | 'pick1_team1'     // Team 1 pick map đầu
  | 'side1_team2'     // Team 2 chọn side cho map 1
  | 'pick1_team2'     // Team 2 pick map đầu
  | 'side2_team1'     // Team 1 chọn side cho map 2
  | 'pick2_team1'     // Team 1 pick map thứ 2
  | 'side3_team2'     // Team 2 chọn side cho map 3
  | 'pick2_team2'     // Team 2 pick map thứ 2
  | 'side4_team1'     // Team 1 chọn side cho map 4
  | 'pick3_team1'     // Team 1 pick map thứ 3 (BO5)
  | 'side5_team2'     // Team 2 chọn side cho map 5 (BO5)
  | 'final_pick'      // Pick map cuối (BO1)
  | 'side_final'      // Chọn side cho map cuối (BO1)
  | 'decider'         // Map decider tự động (BO3)
  | 'side_decider'    // Chọn side cho decider map
  | 'completed';      // Hoàn thành

interface Action {
  type: 'ban' | 'pick' | 'side_select';
  mapId: string;
  side?: 'attack' | 'defense';
  team: 'team1' | 'team2';
  timestamp: number;
}
```

---

## 🎨 UI Components

### MapCard Component
```typescript
interface MapCardProps {
  map: MapData;
  status: 'available' | 'banned' | 'picked' | 'decider';
  bannedBy?: string;
  pickedBy?: string;
  onClick?: () => void;
  disabled?: boolean;
}
```

**States:**
- **Available**: Màu xám, có thể click
- **Banned**: Màu đỏ, có X đè lên, hiện team ban
- **Picked**: Màu xanh, hiện team pick
- **Decider**: Màu vàng, highlight đặc biệt

### BanPickPhase Component
```typescript
// Hiển thị phase hiện tại
- "Team Alpha đang ban map (1/2)"
- "Team Beta đang pick map (1/2)" 
- "Map Decider: Haven"
```

---

## 🔄 Game Flow Logic

### BO1 Format Flow

```
1. Team A bans (1 map)
2. Team B bans (1 map)
3. Team A bans (1 map) 
4. Team B bans (1 map)
5. Team A bans (1 map)
6. Team B bans (1 map)
7. Team A picks final map from remaining 1 map
8. Team B selects side (Attack/Defense) on picked map
```

### BO3 Format Flow
```
1. Team A bans (1 map)
2. Team B bans (1 map)  
3. Team A picks (1 map)
4. Team B picks (1 map)
5. System auto-picks decider from remaining maps
```

### BO5 Format Flow  
```
1. Team A bans (1 map)
2. Team B bans (1 map)
3. Team A picks (1 map) 
4. Team B picks (1 map)
5. Team A bans (1 map)
6. Team B bans (1 map)
7. Team A picks (1 map)
8. Team B picks (1 map) 
9. System auto-picks decider from remaining maps
```

---

## 🎯 Side Selection Rules

### Quy tắc chọn Side (Attack/Defense):

1. **Map Pick của bạn → Đối phương chọn side**
   - Khi team A pick map → team B được chọn Attack/Defense
   - Khi team B pick map → team A được chọn Attack/Defense

2. **Decider Map (BO3) → Team ban cuối chọn side**
   - Team nào ban map cuối cùng → đối phương được chọn side cho decider
   - Ví dụ: Team A ban → Team B ban → Team B được chọn side decider

3. **Final Pick Map (BO1) → Đối phương chọn side**
   - Team A pick final map → Team B chọn side

### Side Selection Component:

```typescript
interface SideSelectionProps {
  map: MapData;
  team: 'team1' | 'team2';
  onSideSelect: (side: 'attack' | 'defense') => void;
}

const SideSelection = ({ map, team, onSideSelect }) => (
  <div className="side-selection">
    <h3>{team} chọn side cho map {map.name}</h3>
    <div className="side-buttons">
      <button onClick={() => onSideSelect('attack')}>
        Attack Side
      </button>
      <button onClick={() => onSideSelect('defense')}>
        Defense Side
      </button>
    </div>
  </div>
);
```

### Match Result Schema:

```typescript
interface MatchResult {
  format: 'BO1' | 'BO3' | 'BO5';
  maps: {
    mapId: string;
    mapName: string;
    pickedBy: 'team1' | 'team2' | 'decider';
    sideSelectedBy: 'team1' | 'team2';
    selectedSide: 'attack' | 'defense';
    order: number; // Thứ tự chơi (1, 2, 3...)
  }[];
  teams: {
    team1: { name: string; startingSides: ('attack' | 'defense')[] };
    team2: { name: string; startingSides: ('attack' | 'defense')[] };
  };
}
```

---

## 🚀 Implementation Steps

### Phase 1: Core Setup
1. **Setup React Project**
   ```bash
   npx create-react-app valorant-banpick --template typescript
   cd valorant-banpick
   npm install @reduxjs/toolkit react-redux tailwindcss
   ```

2. **Setup TailwindCSS**
   ```bash
   npx tailwindcss init
   ```

3. **Create Maps Data**
   - Import Valorant maps (Ascent, Bind, Haven, Split, etc.)
   - Setup map images in `public/images/maps/`

### Phase 2: State Management
1. **Redux Store Setup**
   ```typescript
   // store/gameSlice.ts
   const gameSlice = createSlice({
     name: 'game',
     initialState,
     reducers: {
       banMap: (state, action) => { /* logic */ },
       pickMap: (state, action) => { /* logic */ },
       nextPhase: (state) => { /* logic */ },
       resetGame: (state) => { /* logic */ }
     }
   });
   ```

2. **Game Logic Utils**
   ```typescript
   // utils/gameLogic.ts
   export const getNextPhase = (current: GamePhase, format: GameFormat) => {
     // Return next phase based on current state (BO1/BO3/BO5)
   };
   
   export const getAvailableMaps = (gameState: GameState) => {
     // Return maps that can be banned/picked
   };
   
   export const isGameComplete = (gameState: GameState) => {
     // Check if ban/pick phase is done
   };
   ```

### Phase 3: Components
1. **MapCard Component**
   ```tsx
   const MapCard = ({ map, status, onClick, disabled }) => (
     <div 
       className={`map-card ${status} ${disabled ? 'disabled' : ''}`}
       onClick={!disabled ? onClick : undefined}
     >
       <img src={map.image} alt={map.name} />
       <div className="map-name">{map.name}</div>
       {status === 'banned' && <div className="ban-overlay">❌</div>}
       {status === 'picked' && <div className="pick-overlay">✅</div>}
     </div>
   );
   ```

2. **MapGrid Layout**
   ```tsx
   const MapGrid = ({ maps, gameState, onMapClick }) => (
     <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
       {maps.map(map => (
         <MapCard 
           key={map.id}
           map={map}
           status={gameState.maps[map.id]?.status || 'available'}
           onClick={() => onMapClick(map.id)}
           disabled={!canSelectMap(map.id, gameState)}
         />
       ))}
     </div>
   );
   ```

### Phase 4: Pages & Routing
1. **Admin Page** - Điều khiển ban/pick
2. **Display Page** - Hiển thị cho khán giả  
3. **Room System** - Multiple matches đồng thời

### Phase 5: Advanced Features
1. **Timer System** - Đếm ngược thời gian cho mỗi action
2. **Sound Effects** - Âm thanh khi ban/pick
3. **Animation** - Smooth transitions
4. **Export Results** - Save kết quả ra JSON/PNG

---

## 🎨 Styling Guide

### Color Scheme
```css
:root {
  --valorant-red: #FF4655;
  --valorant-blue: #00F5FF; 
  --valorant-dark: #0F1419;
  --valorant-gray: #2F3349;
  --ban-color: #FF4655;
  --pick-color: #00F5FF;
  --decider-color: #FFD700;
}
```

### Map Card States
```css
.map-card {
  @apply relative overflow-hidden rounded-lg cursor-pointer transform transition-all hover:scale-105;
}

.map-card.available {
  @apply opacity-100 hover:shadow-lg;
}

.map-card.banned {
  @apply opacity-50 bg-red-900 cursor-not-allowed;
}

.map-card.picked {
  @apply opacity-100 bg-blue-900 ring-2 ring-blue-400;
}

.map-card.decider {
  @apply opacity-100 bg-yellow-900 ring-2 ring-yellow-400 animate-pulse;
}
```

---

## 🔧 API Endpoints (Optional)

Nếu cần backend:

```typescript
// GET /api/rooms/:id - Lấy trạng thái phòng
// POST /api/rooms - Tạo phòng mới  
// POST /api/rooms/:id/ban - Ban map
// POST /api/rooms/:id/pick - Pick map
// POST /api/rooms/:id/reset - Reset game
// GET /api/rooms/:id/history - Lịch sử actions
```

---

## 📱 Responsive Design

- **Desktop**: Full grid layout (3x3 maps)
- **Tablet**: 2x4 layout  
- **Mobile**: Single column, swipe navigation

---

## 🔍 Testing Strategy

1. **Unit Tests**: Game logic functions
2. **Integration Tests**: Redux actions & reducers
3. **E2E Tests**: Complete ban/pick flow
4. **Manual Testing**: Multiple browser tabs (admin + viewer)

---

## 🚀 Deployment

1. **Build**: `npm run build`
2. **Static Hosting**: Vercel, Netlify, GitHub Pages
3. **With Backend**: Docker + Railway/Heroku

---

## 📚 Resources

- **Valorant Maps**: [Official Riot Games Media](https://playvalorant.com/en-us/maps/)
- **Esports Formats**: VCT Tournament Rules
- **UI Inspiration**: BLAST, ESL tournament overlays
- **React Patterns**: Compound Components, Custom Hooks

---

## 🎯 Future Enhancements

- **Side Selection**: Attack/Defense cho từng map
- **Veto System**: Alternative ban/pick formats  
- **Match History**: Database lưu kết quả
- **Live Streaming Integration**: OBS Browser Source
- **Multi-language Support**: i18n
- **Tournament Bracket**: Kết nối với bracket system
