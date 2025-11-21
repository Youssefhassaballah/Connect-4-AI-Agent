import React from 'react';
import Cell from './Cell';
import { ROWS, COLS, HUMAN } from '../../utils/constants';
import { isValidColumn } from '../../utils/gameLogic';

/**
 * GameBoard component - displays the Connect 4 game board
 */
const GameBoard = ({ board, onColumnClick, currentPlayer, isProcessing, gameStatus }) => {
    const handleCellClick = (col) => {
        // Only allow clicks if it's human's turn, not processing, and column is valid
        if (currentPlayer === HUMAN && !isProcessing && gameStatus === 'in_progress') {
            if (isValidColumn(board, col)) {
                onColumnClick(col);
            }
        }
    };

    const isCellClickable = (col) => {
        return (
            currentPlayer === HUMAN &&
            !isProcessing &&
            gameStatus === 'in_progress' &&
            isValidColumn(board, col)
        );
    };

    return (
        <div className="flex flex-col items-center">
            {/* Column indicators */}
            <div className="flex gap-2 mb-2">
                {Array.from({ length: COLS }).map((_, colIndex) => (
                    <div
                        key={`indicator-${colIndex}`}
                        className={`
              w-14 h-8 flex items-center justify-center
              rounded-t-lg font-bold text-white text-sm
              transition-all duration-200
              ${isCellClickable(colIndex)
                                ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
                                : 'bg-gray-400 cursor-not-allowed'
                            }
            `}
                        onClick={() => handleCellClick(colIndex)}
                    >
                        {colIndex + 1}
                    </div>
                ))}
            </div>

            {/* Game board */}
            <div className="bg-blue-600 rounded-xl p-4 shadow-2xl">
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                value={cell}
                                onClick={() => handleCellClick(colIndex)}
                                isClickable={isCellClickable(colIndex)}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Processing indicator */}
            {isProcessing && (
                <div className="mt-4 flex items-center space-x-2 text-indigo-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span className="font-semibold">AI is thinking...</span>
                </div>
            )}
        </div>
    );
};

export default GameBoard;