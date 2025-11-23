"""
Minimax algorithm WITHOUT Alpha-Beta pruning
"""
import time
from game.board import AI, HUMAN
from game.heuristic import evaluate_board

class MinimaxAlgorithm:
    def __init__(self, depth_limit=4):
        self.depth_limit = depth_limit
        self.nodes_expanded = 0
        self.start_time = None
    
    def get_best_move(self, board):
        """
        Get the best move for AI using minimax algorithm
        Returns: (best_column, tree_structure, stats)
        """
        self.nodes_expanded = 0
        self.start_time = time.time()
        
        best_col = None
        best_value = float('-inf')
        tree_children = []
        
        valid_columns = board.get_valid_columns()
        
        for col in valid_columns:
            # Create a copy and make the move
            temp_board = board.copy()
            temp_board.drop_disc(col, AI)
            
            # Call minimax for the opponent's turn
            value, child_tree = self.minimax(temp_board, self.depth_limit - 1, False)
            
            # Build tree node for this column
            tree_node = {
                'column': col,
                'value': value,
                'type': 'max',
                'children': [child_tree] if child_tree else []
            }
            tree_children.append(tree_node)
            
            if value > best_value:
                best_value = value
                best_col = col
        
        time_taken = time.time() - self.start_time
        
        # Build complete tree
        tree = {
            'column': best_col,
            'value': best_value,
            'type': 'root',
            'children': tree_children
        }
        
        stats = {
            'nodesExpanded': self.nodes_expanded,
            'timeTaken': time_taken,
            'evaluation': best_value
        }
        
        return best_col, tree, stats
    
    def minimax(self, board, depth, is_maximizing):
        """
        Minimax recursive function
        
        Args:
            board: Current board state
            depth: Remaining depth to search
            is_maximizing: True if maximizing player (AI), False if minimizing (Human)
        
        Returns:
            (value, tree_node)
        """
        self.nodes_expanded += 1
        
        # Terminal conditions
        if depth == 0 or board.is_terminal():
            eval_value = evaluate_board(board)
            return eval_value, {
                'value': eval_value,
                'type': 'leaf',
                'depth': self.depth_limit - depth,
                'children': []
            }
        
        valid_columns = board.get_valid_columns()
        
        if is_maximizing:
            # Maximizing player (AI)
            max_value = float('-inf')
            best_tree = None
            children_trees = []
            
            for col in valid_columns:
                temp_board = board.copy()
                temp_board.drop_disc(col, AI)
                
                value, child_tree = self.minimax(temp_board, depth - 1, False)
                
                node = {
                    'column': col,
                    'value': value,
                    'type': 'max',
                    'depth': self.depth_limit - depth,
                    'children': [child_tree] if child_tree else []
                }
                children_trees.append(node)
                
                if value > max_value:
                    max_value = value
                    best_tree = node
            
            return max_value, {
                'value': max_value,
                'type': 'max',
                'depth': self.depth_limit - depth,
                'children': children_trees
            }
        
        else:
            # Minimizing player (Human)
            min_value = float('inf')
            best_tree = None
            children_trees = []
            
            for col in valid_columns:
                temp_board = board.copy()
                temp_board.drop_disc(col, HUMAN)
                
                value, child_tree = self.minimax(temp_board, depth - 1, True)
                
                node = {
                    'column': col,
                    'value': value,
                    'type': 'min',
                    'board': temp_board.string_representation(),
                    'depth': self.depth_limit - depth,
                    'children': [child_tree] if child_tree else []
                }
                children_trees.append(node)
                
                if value < min_value:
                    min_value = value
                    best_tree = node
            
            return min_value, {
                'value': min_value,
                'type': 'min',
                'depth': self.depth_limit - depth,
                'children': children_trees
            }