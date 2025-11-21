import { ROWS, COLS, EMPTY, HUMAN, AI } from './constants';

/**
 * Create an empty game board
 */
export const createEmptyBoard = () => {
    return Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));
};

/**
 * Check if a column is valid for placement
 */
export const isValidColumn = (board, col) => {
    if (col < 0 || col >= COLS) return false;
    return board[0][col] === EMPTY;
};

/**
 * Drop a disc in a column
 * Returns new board state or null if invalid
 */
export const dropDisc = (board, col, player) => {
    if (!isValidColumn(board, col)) return null;

    const newBoard = board.map(row => [...row]);

    // Find the lowest empty row in the column
    for (let row = ROWS - 1; row >= 0; row--) {
        if (newBoard[row][col] === EMPTY) {
            newBoard[row][col] = player;
            return newBoard;
        }
    }

    return null;
};

/**
 * Check if the board is full
 */
export const isBoardFull = (board) => {
    return board[0].every(cell => cell !== EMPTY);
};

/**
 * Count connected fours for each player
 * Returns { humanCount, aiCount }
 */
export const countConnectedFours = (board) => {
    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal down-right
        [1, -1]   // diagonal down-left
    ];

    const connections = new Set();

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] === EMPTY) continue;

            const player = board[row][col];

            for (let [dx, dy] of directions) {
                let count = 1;
                const cells = [[row, col]];

                // Check forward direction
                for (let i = 1; i < 4; i++) {
                    const newRow = row + dx * i;
                    const newCol = col + dy * i;

                    if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS) break;
                    if (board[newRow][newCol] !== player) break;

                    count++;
                    cells.push([newRow, newCol]);
                }

                // If we found 4 in a row, add to connections
                if (count >= 4) {
                    // Create unique key for this connection
                    const key = `${player}-${cells.sort().join('-')}`;
                    connections.add(key);
                }
            }
        }
    }

    // Count unique connections for each player
    let humanCount = 0;
    let aiCount = 0;

    connections.forEach(key => {
        if (key.startsWith(`${HUMAN}-`)) humanCount++;
        if (key.startsWith(`${AI}-`)) aiCount++;
    });

    return { humanCount, aiCount };
};

/**
 * Get the winner based on connected fours
 */
export const getWinner = (humanCount, aiCount) => {
    if (humanCount > aiCount) return 'human';
    if (aiCount > humanCount) return 'ai';
    return 'tie';
};

/**
 * Get available columns (columns that are not full)
 */
export const getAvailableColumns = (board) => {
    const available = [];
    for (let col = 0; col < COLS; col++) {
        if (board[0][col] === EMPTY) {
            available.push(col);
        }
    }
    return available;
};