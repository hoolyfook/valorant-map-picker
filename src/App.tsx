import React from 'react';
import './App.css';
import TeamSetup from './components/TeamSetup';
import GameHeader from './components/GameHeader';
import MapGrid from './components/MapGrid';
import AdminMapSelection from './components/AdminMapSelection';
import SideSelection from './components/SideSelection';
import DraftComplete from './components/DraftComplete';
import { valorantMaps } from './data/maps';
import { MapState } from './types/game';
import useGameState from './hooks/useGameState';

function App() {
  const { gameState, initializeGame, selectMapsForBanPick, handleMapAction, handleSideSelection, resetGame } = useGameState();

  if (!gameState) {
    return <TeamSetup onStartGame={initializeGame} />;
  }

  if (gameState.phase === 'admin-setup') {
    return <AdminMapSelection onMapsSelected={selectMapsForBanPick} />;
  }

  // Handle side selection phases
  if (gameState.phase.includes('side-select')) {
    let targetMap: MapState | undefined;
    
    if (gameState.phase === 'side-select3') {
      // For decider map, find the remaining available map
      targetMap = gameState.mapStates.find(state => state.status === 'available');
    } else {
      // For regular picked maps, find the latest picked map without side
      targetMap = gameState.mapStates
        .filter(state => state.status === 'picked' && !state.selectedSide)
        .pop();
    }
    
    if (targetMap) {
      const map = valorantMaps.find(m => m.id === targetMap!.id);
      const currentTeamName = gameState.currentTeam === 'team1' ? gameState.team1Name : gameState.team2Name;
      
      if (map) {
        return (
          <SideSelection
            mapName={map.name}
            mapImage={map.image}
            teamName={currentTeamName}
            onSideSelect={handleSideSelection}
            isDeciderMap={gameState.phase === 'side-select3'}
          />
        );
      }
    }
  }

  return (
    <div className="App">
      {/* Completion message - moved to top */}
      {gameState.phase === 'completed' && (
        <DraftComplete gameState={gameState} allMaps={valorantMaps} />
      )}
      
      <GameHeader gameState={gameState} onReset={resetGame} />
      <MapGrid 
        maps={valorantMaps}
        mapStates={gameState.mapStates}
        onMapClick={handleMapAction}
        currentPhase={gameState.phase}
        pickedMaps={gameState.pickedMaps}
        team1Name={gameState.team1Name}
        team2Name={gameState.team2Name}
      />
    </div>
  );
}

export default App;
