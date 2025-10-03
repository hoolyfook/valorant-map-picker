
import { Provider } from 'react-redux';
import { store } from './store';
import GameHeader from './components/GameHeader';
import MapGrid from './components/MapGrid';
import ActionHistory from './components/ActionHistory';
import SideSelection from './components/SideSelection';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-valorant-dark flex flex-col items-center justify-start">
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Valorant Map Ban/Pick System
            </h1>
            <p className="text-gray-400">
              Professional tournament-grade map drafting tool
            </p>
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
      </div>
    </Provider>
  );
}

export default App;