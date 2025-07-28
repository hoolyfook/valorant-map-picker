import React from 'react';
import './App.css';
import TeamSetup from './components/TeamSetup';
import GameHeader from './components/GameHeader';
import MapGrid from './components/MapGrid';
import { valorantMaps } from './data/maps';
import useGameState from './hooks/useGameState';

function App() {
  const { gameState, initializeGame, handleMapAction, resetGame } = useGameState();

  if (!gameState) {
    return <TeamSetup onStartGame={initializeGame} />;
  }

  return (
    <div className="App">
      <GameHeader gameState={gameState} onReset={resetGame} />
      <MapGrid 
        maps={valorantMaps}
        mapStates={gameState.mapStates}
        onMapClick={handleMapAction}
        currentPhase={gameState.phase}
      />
      {gameState.phase === 'completed' && (
        <div className="completion-message">
          <h2>Draft Completed!</h2>
          <p>Selected maps: {gameState.pickedMaps.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default App;
