import React, { useState, useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './store';
import GameHeader from './components/GameHeader';
import MapGrid from './components/MapGrid';
import ActionHistory from './components/ActionHistory';
import SideSelection from './components/SideSelection';
import DraftResultsModal from './components/DraftResultsModal';
import './index.css';

const AppContent: React.FC = () => {
  const { phase } = useSelector((state: RootState) => state.game);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    console.log('Current phase:', phase); // Debug log
    if (phase === 'complete') {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [phase]);

  // Test button để kiểm tra modal
  const handleTestModal = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-valorant-dark flex flex-col items-center justify-start">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Valorant Map Ban/Pick System
          </h1>
          <p className="text-gray-400">
            Professional tournament-grade map drafting tool
          </p>
          
          {/* Test button for modal */}
          <button
            onClick={handleTestModal}
            className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
          >
            🧪 Test Results Modal (Current Phase: {phase})
          </button>
        </header>
        
        <div className="flex flex-col items-center gap-6">
          {/* Main content area */}
          <div className="w-full max-w-5xl">
            <GameHeader />
            <SideSelection />
            <MapGrid />
          </div>
          
          {/* Action History centered below */}
          <div className="w-full max-w-3xl">
            <ActionHistory />
          </div>
        </div>
      </div>
      
      {/* Draft Results Modal */}
      <DraftResultsModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;