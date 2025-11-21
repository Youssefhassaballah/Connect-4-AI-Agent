import { useState, useCallback } from 'react';
import {
    createEmptyBoard,
    dropDisc,
    isBoardFull,
    countConnectedFours,
    getWinner
} from '../utils/gameLogic';
import { HUMAN, AI, GAME_STATUS } from '../utils/constants';

/**
 * Custom hook to manage game state
 */
export const useGameState = () => {
    const [board, setBoard] = useState(createEmptyBoard());
    const [currentPlayer, setCurrentPlayer] = useState(HUMAN);
    const [gameStatus, setGameStatus] = useState(GAME_STATUS.NOT_STARTED);
    const [scores, setScores] = useState({ human: 0, ai: 0 });
    const [winner, setWinner] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastMove, setLastMove] = useState(null);
    const [treeData, setTreeData] = useState(null);
    const [moveStats, setMoveStats] = useState(null);

    /**
     * Start a new game
     */
    const startGame = useCallback(() => {
        setBoard(createEmptyBoard());
        setCurrentPlayer(HUMAN);
        setGameStatus(GAME_STATUS.IN_PROGRESS);
        setScores({ human: 0, ai: 0 });
        setWinner(null);
        setIsProcessing(false);
        setLastMove(null);
        setTreeData(null);
        setMoveStats(null);
    }, []);

    /**
     * Reset game completely
     */
    const resetGame = useCallback(() => {
        setBoard(createEmptyBoard());
        setCurrentPlayer(HUMAN);
        setGameStatus(GAME_STATUS.NOT_STARTED);
        setScores({ human: 0, ai: 0 });
        setWinner(null);
        setIsProcessing(false);
        setLastMove(null);
        setTreeData(null);
        setMoveStats(null);
    }, []);

    /**
     * Make a move (human or AI)
     */
    const makeMove = useCallback((col, player) => {
        const newBoard = dropDisc(board, col, player);

        if (!newBoard) {
            return false; // Invalid move
        }

        setBoard(newBoard);
        setLastMove({ col, player });

        // Check if game is over
        if (isBoardFull(newBoard)) {
            endGame(newBoard);
        } else {
            // Switch player
            setCurrentPlayer(player === HUMAN ? AI : HUMAN);
        }

        return true;
    }, [board]);

    /**
     * Set AI move data (tree, stats)
     */
    const setAIMoveData = useCallback((data) => {
        setTreeData(data.tree);
        setMoveStats({
            nodesExpanded: data.nodesExpanded,
            timeTaken: data.timeTaken,
            evaluation: data.evaluation
        });
    }, []);

    /**
     * End the game and calculate winner
     */
    const endGame = useCallback((finalBoard) => {
        const { humanCount, aiCount } = countConnectedFours(finalBoard);
        setScores({ human: humanCount, ai: aiCount });
        setGameStatus(GAME_STATUS.FINISHED);
        setWinner(getWinner(humanCount, aiCount));
    }, []);

    /**
     * Set processing state (when AI is thinking)
     */
    const setProcessing = useCallback((processing) => {
        setIsProcessing(processing);
    }, []);

    return {
        // State
        board,
        currentPlayer,
        gameStatus,
        scores,
        winner,
        isProcessing,
        lastMove,
        treeData,
        moveStats,

        // Actions
        startGame,
        resetGame,
        makeMove,
        setAIMoveData,
        setProcessing,
        setCurrentPlayer,
        setScores
    };
};