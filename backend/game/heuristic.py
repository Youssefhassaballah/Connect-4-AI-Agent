"""
Heuristic evaluation function for Connect 4
"""
from game.board import EMPTY, HUMAN, AI, ROWS, COLS

def evaluate_board(board):
    """
    Evaluate the board state from AI's perspective
    
    Factors considered:
    1. Current score (connect-4s)
    2. Potential winning opportunities (3-in-a-row with empty space)
    3. Blocking opponent's opportunities
    4. Center control
    5. Vertical threats
    
    Returns: Higher positive values favor AI, negative values favor human
    """
    
    # Terminal state check
    if board.is_terminal():
        human_score, ai_score = board.check_winner()
        return (ai_score - human_score) * 1000
    
    score = 0
    
    # 1. Current connect-4 scores (highest priority)
    human_connect4, ai_connect4 = board.check_winner()
    score += (ai_connect4 - human_connect4) * 1000
    
    # 2. Evaluate potential threats and opportunities
    score += evaluate_windows(board.board, AI) * 10
    score -= evaluate_windows(board.board, HUMAN) * 10
    
    # 3. Center column control (important strategic position)
    center_col = COLS // 2
    center_count = sum(1 for row in range(ROWS) if board.board[row][center_col] == AI)
    score += center_count * 3
    
    return score


def evaluate_windows(board, player):
    """
    Evaluate all possible 4-cell windows for potential connect-4s
    """
    score = 0
    
    # Horizontal windows
    for row in range(ROWS):
        for col in range(COLS - 3):
            window = [board[row][col + i] for i in range(4)]
            score += score_window(window, player)
    
    # Vertical windows
    for col in range(COLS):
        for row in range(ROWS - 3):
            window = [board[row + i][col] for i in range(4)]
            score += score_window(window, player)
    
    # Diagonal (down-right) windows
    for row in range(ROWS - 3):
        for col in range(COLS - 3):
            window = [board[row + i][col + i] for i in range(4)]
            score += score_window(window, player)
    
    # Diagonal (down-left) windows
    for row in range(ROWS - 3):
        for col in range(3, COLS):
            window = [board[row + i][col - i] for i in range(4)]
            score += score_window(window, player)
    
    return score


def score_window(window, player):
    """
    Score a 4-cell window based on its potential
    """
    score = 0
    opponent = HUMAN if player == AI else AI
    
    player_count = window.count(player)
    empty_count = window.count(EMPTY)
    opponent_count = window.count(opponent)
    
    # 3 in a row with 1 empty = high potential
    if player_count == 3 and empty_count == 1:
        score += 50
    
    # 2 in a row with 2 empty = medium potential
    elif player_count == 2 and empty_count == 2:
        score += 10
    
    # 1 with 3 empty = low potential
    elif player_count == 1 and empty_count == 3:
        score += 1
    
    # Block opponent's 3 in a row (defensive)
    if opponent_count == 3 and empty_count == 1:
        score += 40
    
    return score


def evaluate_board_simple(board):
    """
    Simpler evaluation function (alternative)
    Just based on current scores
    """
    human_score, ai_score = board.check_winner()
    return (ai_score - human_score) * 100