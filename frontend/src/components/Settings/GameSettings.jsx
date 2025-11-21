import React, { useState } from 'react';
import { Play, Settings } from 'lucide-react';
import {
    ALGORITHMS,
    ALGORITHM_NAMES,
    DEFAULT_DEPTH,
    MIN_DEPTH,
    MAX_DEPTH
} from '../../utils/constants';

/**
 * GameSettings component - allows user to configure game settings before starting
 */
const GameSettings = ({ onStartGame }) => {
    const [algorithm, setAlgorithm] = useState(ALGORITHMS.MINIMAX_ALPHA_BETA);
    const [depth, setDepth] = useState(DEFAULT_DEPTH);

    const handleStartGame = () => {
        onStartGame({
            algorithm,
            depth
        });
    };

    const getAlgorithmDescription = () => {
        switch (algorithm) {
            case ALGORITHMS.MINIMAX:
                return 'Classic Minimax without pruning - explores all possible moves';
            case ALGORITHMS.MINIMAX_ALPHA_BETA:
                return 'Minimax with Alpha-Beta Pruning - more efficient, prunes unnecessary branches';
            case ALGORITHMS.EXPECTIMINIMAX:
                return 'Expected Minimax - handles probability (60% chosen column, 40% adjacent)';
            default:
                return '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
                {/* Header */}
                <div className="flex items-center justify-center mb-8">
                    <Settings className="w-10 h-10 text-purple-600 mr-3" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Connect 4 AI</h1>
                        <p className="text-sm text-gray-600">Configure your game settings</p>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="space-y-6">
                    {/* Algorithm Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            AI Algorithm
                        </label>
                        <select
                            value={algorithm}
                            onChange={(e) => setAlgorithm(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                       transition-all duration-200 cursor-pointer
                       bg-white hover:border-gray-400"
                        >
                            {Object.entries(ALGORITHMS).map(([key, value]) => (
                                <option key={value} value={value}>
                                    {ALGORITHM_NAMES[value]}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-xs text-gray-500 italic">
                            {getAlgorithmDescription()}
                        </p>
                    </div>

                    {/* Depth Limit */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Search Depth (K): <span className="text-purple-600 font-bold">{depth}</span>
                        </label>
                        <input
                            type="range"
                            min={MIN_DEPTH}
                            max={MAX_DEPTH}
                            value={depth}
                            onChange={(e) => setDepth(parseInt(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                       accent-purple-600 hover:bg-gray-300 transition-colors"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Shallow ({MIN_DEPTH})</span>
                            <span>Deep ({MAX_DEPTH})</span>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Higher depth = smarter AI but slower computation
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <h3 className="font-semibold text-blue-900 text-sm mb-1">Game Rules</h3>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>• You play as RED, AI plays as YELLOW</li>
                            <li>• Click column numbers to drop your disc</li>
                            <li>• Connect 4 discs horizontally, vertically, or diagonally</li>
                            <li>• Player with most connect-4s wins when board is full</li>
                        </ul>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={handleStartGame}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 
                        text-white py-4 rounded-lg font-bold text-lg
                        hover:from-purple-700 hover:to-indigo-700 
                        active:scale-95
                        transition-all duration-200 
                        flex items-center justify-center space-x-3
                        shadow-lg hover:shadow-xl"
                    >
                        <Play className="w-6 h-6" />
                        <span>Start Game</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameSettings;