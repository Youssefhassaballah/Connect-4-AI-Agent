"""
Board representation and game logic for Connect 4
"""
import numpy as np

EMPTY = 0
HUMAN = 1
AI = 2

ROWS = 6
COLS = 7

class Board:
    """Represents the Connect 4 game board"""
    
    def __init__(self, board_state=None):
        """Initialize board from state or create empty board"""
        if board_state is not None:
            self.board = np.array(board_state)
        else:
            self.board = np.zeros((ROWS, COLS), dtype=int)
    
    def copy(self):
        """Create a deep copy of the board"""
        return Board(self.board.copy())
    
    def is_valid_column(self, col):
        """Check if a column has space for a disc"""
        return self.board[0][col] == EMPTY
    
    def get_valid_columns(self):
        """Get all valid columns"""
        return [col for col in range(COLS) if self.is_valid_column(col)]
    
    def drop_disc(self, col, player):
        """Drop a disc in the specified column"""
        if not self.is_valid_column(col):
            return False
        
        # Find the lowest empty row
        for row in range(ROWS - 1, -1, -1):
            if self.board[row][col] == EMPTY:
                self.board[row][col] = player
                return True
        return False
    
    def is_full(self):
        """Check if the board is completely full"""
        return not any(self.board[0][col] == EMPTY for col in range(COLS))
    
    def string_representation(self):
        string_rows = []        
        for row in self.board:
            string_rows.append(''.join(str(cell) for cell in row))
        return '\n'.join(string_rows)
    
    def check_winner(self):
        """
        Check for connect-4s and return counts for each player
        Returns: (human_count, ai_count)
        """
        human_count = 0
        ai_count = 0
        
        # Directions: horizontal, vertical, diagonal-right, diagonal-left
        directions = [(0, 1), (1, 0), (1, 1), (1, -1)]
        
        checked = set()
        
        for row in range(ROWS):
            for col in range(COLS):
                if self.board[row][col] == EMPTY:
                    continue
                
                player = self.board[row][col]
                
                for dr, dc in directions:
                    # Check if we can form a connect-4 in this direction
                    cells = [(row, col)]
                    
                    for i in range(1, 4):
                        new_row = row + dr * i
                        new_col = col + dc * i
                        
                        if (new_row < 0 or new_row >= ROWS or 
                            new_col < 0 or new_col >= COLS):
                            break
                        
                        if self.board[new_row][new_col] != player:
                            break
                        
                        cells.append((new_row, new_col))
                    
                    # If we found a connect-4
                    if len(cells) == 4:
                        if player == HUMAN:
                            human_count += 1
                        else:
                            ai_count += 1
        
        return human_count, ai_count
    
    def is_terminal(self):
        """Check if game is over (board full)"""
        return self.is_full()
    
    def get_state(self):
        """Get current board state as list"""
        return self.board.tolist()
    
    def getScore(self):
        """Get score as (human_score, ai_score)"""
        return self.check_winner()
    
    def __str__(self):
        """String representation of the board"""
        result = []
        for row in self.board:
            result.append(' '.join(['.' if cell == EMPTY else 
                                   'R' if cell == HUMAN else 
                                   'Y' for cell in row]))
        return '\n'.join(result)