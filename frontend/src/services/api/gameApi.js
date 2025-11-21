/**
 * Service for handling API calls to the backend AI agent
 */
import { API_ENDPOINTS } from '../../config/config';

/**
 * Get AI move from the backend
 * @param {Array} board - Current board state (2D array)
 * @param {string} algorithm - Algorithm to use ('minimax', 'minimax_alpha_beta', 'expectiminimax')
 * @param {number} depth - Depth limit (K value)
 * @returns {Promise<Object>} - Returns { column, tree, evaluation, stats }
 */
export const getAIMove = async (board, algorithm, depth) => {
    try {
        const response = await fetch(API_ENDPOINTS.MOVE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                board: board,
                algorithm: algorithm,
                depth: depth,
                player: 2 // AI player is always 2
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Validate response
        if (data.column === undefined || data.column === null) {
            throw new Error('Invalid response: missing column');
        }
        console.log(data)
        return {
            column: data.column,
            tree: data.tree || null,
            evaluation: data.evaluation || null,
            stats: data.stats || null,
            nodesExpanded: data.nodesExpanded || 0,
            timeTaken: data.timeTaken || 0,
            score: data.score 
        };

    } catch (error) {
        console.error('Error getting AI move:', error);
        throw new Error(`Failed to get AI move: ${error.message}`);
    }
};

/**
 * Test API connection
 * @returns {Promise<boolean>} - Returns true if connection successful
 */
export const testAPIConnection = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.HEALTH, {
            method: 'GET',
        });
        return response.ok;
    } catch (error) {
        console.error('API connection test failed:', error);
        return false;
    }
};


export const getScore = async (board) => {
    try {
        const response = await fetch(API_ENDPOINTS.SCORE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                board: board
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Validate response
        if (data.humanScore === undefined || data.aiScore === undefined) {
            throw new Error('Invalid response: missing scores');
        }

        return {
            human: data.humanScore,
            ai: data.aiScore
        };
    } catch (error) {
        console.error('Error getting score:', error);
        throw new Error(`Failed to get score: ${error.message}`);
    }
};