import React from 'react';
import { User, Cpu, Trophy, Clock, Activity } from 'lucide-react';
import { HUMAN, GAME_STATUS } from '../../utils/constants';

/**
 * ScoreBoard component - displays scores, current turn, and game stats
 */
const ScoreBoard = ({
    scores,
    currentPlayer,
    isProcessing,
    gameStatus,
    winner,
    moveStats
}) => {
    const getCurrentTurnText = () => {
        if (gameStatus === GAME_STATUS.FINISHED) {
            return 'Game Over';
        }
        if (isProcessing) {
            return 'AI Thinking...';
        }
        return currentPlayer === HUMAN ? 'Your Turn' : 'AI Turn';
    };

    const getWinnerText = () => {
        if (winner === 'human') return 'You Win! 🎉';
        if (winner === 'ai') return 'AI Wins! 🤖';
        if (winner === 'tie') return "It's a Tie! 🤝";
        return '';
    };

    return (
        <div className="space-y-4">
            {/* Scores */}
            <div className="grid grid-cols-2 gap-4">
                {/* Human Score */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200">
                    <div className="flex items-center justify-between mb-2">
                        <User className="w-6 h-6 text-red-600" />
                        <span className="text-xs font-semibold text-red-700 uppercase">You</span>
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                        {scores.human}
                    </div>
                    <div className="text-xs text-red-600 mt-1">Connect-4s</div>
                </div>

                {/* AI Score */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border-2 border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                        <Cpu className="w-6 h-6 text-yellow-600" />
                        <span className="text-xs font-semibold text-yellow-700 uppercase">AI</span>
                    </div>
                    <div className="text-3xl font-bold text-yellow-600">
                        {scores.ai}
                    </div>
                    <div className="text-xs text-yellow-600 mt-1">Connect-4s</div>
                </div>
            </div>

            {/* Current Turn */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Current Turn:</span>
                    <div className="flex items-center space-x-2">
                        {isProcessing && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        )}
                        <span className="text-lg font-bold text-indigo-700">
                            {getCurrentTurnText()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Winner Display */}
            {gameStatus === GAME_STATUS.FINISHED && (
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 border-2 border-purple-300 text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {getWinnerText()}
                    </h2>
                    <div className="text-lg text-gray-700">
                        Final Score: <span className="font-bold text-red-600">{scores.human}</span> - <span className="font-bold text-yellow-600">{scores.ai}</span>
                    </div>
                </div>
            )}

            {/* Move Statistics */}
            {moveStats && (
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Last AI Move Stats
                    </h3>
                    <div className="space-y-2 text-sm">
                        {moveStats.nodesExpanded !== undefined && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Nodes Expanded:</span>
                                <span className="font-semibold text-gray-800">{moveStats.nodesExpanded.toLocaleString()}</span>
                            </div>
                        )}
                        {moveStats.timeTaken !== undefined && (
                            <div className="flex justify-between">
                                <span className="text-gray-600 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Time Taken:
                                </span>
                                <span className="font-semibold text-gray-800">{moveStats.timeTaken.toFixed(3)}s</span>
                            </div>
                        )}
                        {moveStats.evaluation !== undefined && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Evaluation:</span>
                                <span className="font-semibold text-gray-800">{moveStats.evaluation}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScoreBoard;