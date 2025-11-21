import { useState, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

// Components
import GameSettings from './components/Settings/GameSettings';
import GameBoard from './components/GameBoard/GameBoard';
import ScoreBoard from './components/ScoreBoard/ScoreBoard';
import TreeViewer from './components/TreeViewer/TreeViewer';

// Hooks
import { useGameState } from './hooks/useGameState';

// Services
import { getAIMove } from './services/api/gameApi';

// Constants
import { HUMAN, AI, GAME_STATUS, ALGORITHM_NAMES } from './utils/constants';

/**
 * Main App component
 */
function App() {
  // Game settings
  const [settings, setSettings] = useState(null);
  const [showSettings, setShowSettings] = useState(true);

  // Game state from custom hook
  const {
    board,
    currentPlayer,
    gameStatus,
    scores,
    winner,
    isProcessing,
    treeData,
    moveStats,
    startGame,
    resetGame,
    makeMove,
    setAIMoveData,
    setProcessing,
    setCurrentPlayer
  } = useGameState();

  /**
   * Handle start game from settings
   */
  const handleStartGame = (gameSettings) => {
    setSettings(gameSettings);
    setShowSettings(false);
    startGame();
  };

  /**
   * Handle reset game
   */
  const handleResetGame = () => {
    resetGame();
    setShowSettings(true);
  };

  /**
   * Handle human move
   */
  const handleColumnClick = (col) => {
    if (currentPlayer !== HUMAN || isProcessing || gameStatus !== GAME_STATUS.IN_PROGRESS) {
      return;
    }

    const success = makeMove(col, HUMAN);
    if (!success) {
      console.log('Invalid move');
    }
  };

  /**
   * Make AI move - called automatically when it's AI's turn
   */
  const makeAIMove = useCallback(async () => {
    if (!settings) return;
    
    setProcessing(true);

    try {
      const moveData = await getAIMove(
        board,
        settings.algorithm,
        settings.depth
      );

      // Store tree and stats
      setAIMoveData(moveData);

      // Make the move
      setTimeout(() => {
        const success = makeMove(moveData.column, AI);
        if (!success) {
          console.error('AI made an invalid move');
          alert('AI made an invalid move. Please try again.');
          setCurrentPlayer(HUMAN);
        }
        setProcessing(false);
      }, 500); // Small delay for better UX

    } catch (error) {
      console.error('Error making AI move:', error);
      alert(`Error: ${error.message}\n\nMake sure your backend server is running on http://localhost:5000`);
      setProcessing(false);
      setCurrentPlayer(HUMAN); // Give turn back to human
    }
  }, [board, settings, setProcessing, setAIMoveData, makeMove, setCurrentPlayer]);

  /**
   * Auto-trigger AI move when it's AI's turn
   */
  useEffect(() => {
    if (
      currentPlayer === AI &&
      gameStatus === GAME_STATUS.IN_PROGRESS &&
      !isProcessing
    ) {
      makeAIMove();
    }
  }, [currentPlayer, gameStatus, isProcessing, makeAIMove]);

  // Show settings screen
  if (showSettings) {
    return <GameSettings onStartGame={handleStartGame} />;
  }

  // Main game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Connect 4 AI Game</h1>
              <p className="text-sm text-gray-600 mt-1">
                Algorithm: <span className="font-semibold">{ALGORITHM_NAMES[settings.algorithm]}</span> | 
                Depth: <span className="font-semibold">{settings.depth}</span>
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleResetGame}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg 
                          hover:bg-gray-700 transition-colors flex items-center space-x-2
                          shadow-md hover:shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Game</span>
              </button>
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Game Board */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-2xl p-6">
            <GameBoard
              board={board}
              onColumnClick={handleColumnClick}
              currentPlayer={currentPlayer}
              isProcessing={isProcessing}
              gameStatus={gameStatus}
            />
          </div>

          {/* Right Column - Score and Info */}
          <div className="space-y-6">
            <ScoreBoard
              scores={scores}
              currentPlayer={currentPlayer}
              isProcessing={isProcessing}
              gameStatus={gameStatus}
              winner={winner}
              moveStats={moveStats}
            />
          </div>
        </div>

        {/* Tree Viewer - Full Width */}
        <div className="mt-6">
          <TreeViewer treeData={treeData} />
        </div>
      </div>
    </div>
  );
}

export default App;