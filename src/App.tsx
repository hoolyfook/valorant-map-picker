import React from 'react';
import './App.css';
import TeamSetup from './components/TeamSetup';
import GameHeader from './components/GameHeader';
import MapGrid from './components/MapGrid';
import AdminMapSelection from './components/AdminMapSelection';
import SideSelection from './components/SideSelection';
import DraftComplete from './components/DraftComplete';
import RoleSelector from './components/RoleSelector';
import RoleStatus from './components/RoleStatus';
import { valorantMaps } from './data/maps';
import { MapState } from './types/game';
import { useRole } from './hooks/useRole';
import { canUserInteract, isPhaseVisible } from './types/roles';
import useGameState from './hooks/useGameState';

function App() {
  const { gameState, initializeGame, selectMapsForBanPick, handleMapAction, handleSideSelection, resetGame } = useGameState();
  const { currentRole, roleConfig } = useRole();

  // Check if current user can interact
  const canInteract = gameState ? canUserInteract(currentRole, gameState.phase, gameState.currentTeam) : false;

  if (!gameState) {
    // Only admin can setup teams
    if (currentRole !== 'admin') {
      return (
        <div className="App">
          <div className="waiting-message">
            <h2>⏳ Waiting for Admin to Setup Teams</h2>
            <p>Please wait for the admin to configure the teams and start the draft.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="App">
        <RoleSelector />
        <TeamSetup onStartGame={initializeGame} />
      </div>
    );
  }

  if (gameState.phase === 'admin-setup') {
    // Only admin can access admin setup
    if (currentRole !== 'admin') {
      return (
        <div className="App">
          <div className="waiting-message">
            <h2>⏳ Waiting for Admin Setup</h2>
            <p>Admin is selecting maps for the draft...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="App">
        <RoleSelector />
        <AdminMapSelection onMapsSelected={selectMapsForBanPick} />
      </div>
    );
  }

  // Check if current phase is visible to user (after admin-setup check)
  if (!isPhaseVisible(currentRole, gameState.phase)) {
    return (
      <div className="App">
        <div className="waiting-message">
          <h2>⏳ Draft Not Started</h2>
          <p>Please wait for the draft to begin.</p>
        </div>
      </div>
    );
  }

    // Handle side selection phases
  if (gameState.phase.includes('side-select')) {
    let targetMap: MapState | undefined;
    
    if (gameState.phase === 'side-select3') {
      // For decider map, find the remaining available map
      targetMap = gameState.mapStates.find(state => state.status === 'available');
    } else {
      // Find the latest picked map that doesn't have a side selected yet
      targetMap = gameState.mapStates
        .filter(state => state.status === 'picked' && !state.selectedSide)
        .pop();
    }

    if (targetMap) {
      const map = valorantMaps.find(m => m.id === targetMap!.id);
      const currentTeamName = gameState.currentTeam === 'team1' ? gameState.team1Name : gameState.team2Name;
      
      if (map) {
        return (
          <div className="App">
            {currentRole === 'admin' && <RoleSelector />}
            <RoleStatus 
              currentRole={currentRole}
              gameState={gameState}
              canInteract={canInteract}
            />
            {!canInteract && (
              <div className="interaction-disabled">
                <p>⏳ Waiting for {currentTeamName} to select side...</p>
              </div>
            )}
            <SideSelection
              mapName={map.name}
              mapImage={map.image}
              teamName={currentTeamName}
              onSideSelect={canInteract ? handleSideSelection : () => {}}
              isDeciderMap={gameState.phase === 'side-select3'}
              disabled={!canInteract}
            />
          </div>
        );
      }
    }
  }

  return (
    <div className="App">
      {currentRole === 'admin' && <RoleSelector />}
      
      {gameState && gameState.phase !== 'completed' && (
        <RoleStatus 
          currentRole={currentRole}
          gameState={gameState}
          canInteract={canInteract}
        />
      )}
      
      {gameState && (
        <>

          <GameHeader 
            gameState={gameState} 
            onReset={resetGame}
            canReset={currentRole === 'admin'}
          />

          <MapGrid 
            maps={valorantMaps}
            mapStates={gameState.mapStates}
            onMapClick={canInteract ? handleMapAction : () => {}}
            currentPhase={gameState.phase}
            pickedMaps={gameState.pickedMaps}
            team1Name={gameState.team1Name}
            team2Name={gameState.team2Name}
            disabled={!canInteract}
          />
        </>
      )}
    </div>
  );
}

export default App;
