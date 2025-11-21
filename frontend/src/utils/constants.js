// Game board constants
export const ROWS = 6;
export const COLS = 7;

// Player constants
export const EMPTY = 0;
export const HUMAN = 1;
export const AI = 2;

// Algorithm options
export const ALGORITHMS = {
    MINIMAX: 'minimax',
    MINIMAX_ALPHA_BETA: 'minimax_alpha_beta',
    EXPECTIMINIMAX: 'expectiminimax'
};

// Algorithm display names
export const ALGORITHM_NAMES = {
    [ALGORITHMS.MINIMAX]: 'Minimax (No Pruning)',
    [ALGORITHMS.MINIMAX_ALPHA_BETA]: 'Minimax with Alpha-Beta Pruning',
    [ALGORITHMS.EXPECTIMINIMAX]: 'Expected Minimax'
};

// Default settings
export const DEFAULT_DEPTH = 4;
export const MIN_DEPTH = 2;
export const MAX_DEPTH = 8;

// Game status
export const GAME_STATUS = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    FINISHED: 'finished'
};

// Winner types
export const WINNER = {
    HUMAN: 'human',
    AI: 'ai',
    TIE: 'tie',
    NONE: null
};