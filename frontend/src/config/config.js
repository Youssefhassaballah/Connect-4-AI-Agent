/**
 * Application configuration
 */

// API Base URL - Change this if your backend runs on a different port/host
export const API_BASE_URL = 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
    MOVE: `${API_BASE_URL}/api/move`,
    HEALTH: `${API_BASE_URL}/api/health`,
    SCORE: `${API_BASE_URL}/api/score`
};

// Game Configuration
export const GAME_CONFIG = {
    DEFAULT_DEPTH: 4,
    MIN_DEPTH: 2,
    MAX_DEPTH: 8
};