import React from 'react';
import { EMPTY, HUMAN, AI } from '../../utils/constants';

/**
 * Cell component - represents a single cell in the Connect 4 board
 */
const Cell = ({ value, onClick, isClickable, rowIndex, colIndex }) => {
    const getCellColor = () => {
        if (value === EMPTY) return 'bg-white';
        if (value === HUMAN) return 'bg-red-500';
        if (value === AI) return 'bg-yellow-400';
        return 'bg-white';
    };

    const getCellShadow = () => {
        if (value === HUMAN) return 'shadow-red-300';
        if (value === AI) return 'shadow-blue-300';
        return 'shadow-gray-200';
    };

    return (
        <button
            onClick={onClick}
            disabled={!isClickable}
            className={`
        w-14 h-14 rounded-full 
        ${getCellColor()} 
        border-4 border-blue-700 
        ${getCellShadow()}
        transition-all duration-200
        ${isClickable
                    ? 'hover:scale-110 hover:shadow-xl cursor-pointer active:scale-95'
                    : 'cursor-not-allowed opacity-90'
                }
        `}
            aria-label={`Cell at row ${rowIndex + 1}, column ${colIndex + 1}`}
        >
            {/* Optional: Add a shine effect for filled cells */}
            {value !== EMPTY && (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-30" />
            )}
        </button>
    );
};

export default Cell;