"""
Minimax algorithm WITH Alpha-Beta pruning
"""
import time
from game.board import AI, HUMAN
from game.heuristic import evaluate_board

class AlphaBetaAlgorithm:
    def __init__(self, depth_limit=4):
        self.depth_limit = depth_limit
        self.nodes_expanded = 0
        self.start_time = None
    
    def get_best_move(self, board):
        """
        Get the best move for AI using minimax with alpha-beta pruning
        Returns: (best_column, tree_structure, stats)
        """
        self.nodes_expanded = 0
        self.start_time = time.time()
        
        best_col = None
        best_value = -1e12
        alpha = -1e12
        beta = 1e12
        tree_children = []
        
        valid_columns = board.get_valid_columns()
        
        for col in valid_columns:
            # Create a copy and make the move
            temp_board = board.copy()
            temp_board.drop_disc(col, AI)
            
            # Call alpha-beta for the opponent's turn
            value, child_tree = self.alpha_beta(temp_board, self.depth_limit - 1, 
                                                alpha, beta, False)
            
            # Build tree node for this column
            tree_node = {
                'column': col,
                'value': value,
                'type': 'max',
                'alpha': alpha,
                'beta': beta,
                'children': [child_tree] if child_tree else []
            }
            tree_children.append(tree_node)
            
            if value > best_value:
                best_value = value
                best_col = col
            
            alpha = max(alpha, value)
        
        time_taken = time.time() - self.start_time
        
        # Build complete tree
        tree = {
            'column': best_col,
            'value': best_value,
            'type': 'root',
            'alpha': alpha,
            'beta': beta,
            'children': tree_children
        }
        
        stats = {
            'nodesExpanded': self.nodes_expanded,
            'timeTaken': time_taken,
            'evaluation': best_value
        }
        
        return best_col, tree, stats
    
    def alpha_beta(self, board, depth, alpha, beta, is_maximizing):
        """
        Alpha-Beta pruning recursive function
        
        Args:
            board: Current board state
            depth: Remaining depth to search
            alpha: Best value for maximizer
            beta: Best value for minimizer
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
                'alpha': alpha,
                'beta': beta,
                'children': []
            }
        
        valid_columns = board.get_valid_columns()
        
        if is_maximizing:
            # Maximizing player (AI)
            max_value = -1e12
            children_trees = []
            
            for col in valid_columns:
                temp_board = board.copy()
                temp_board.drop_disc(col, AI)
                
                value, child_tree = self.alpha_beta(temp_board, depth - 1, 
                                                    alpha, beta, False)
                
                node = {
                    'column': col,
                    'value': value,
                    'type': 'max',
                    'depth': self.depth_limit - depth,
                    'alpha': alpha,
                    'beta': beta,
                    'children': [child_tree] if child_tree else []
                }
                children_trees.append(node)
                
                max_value = max(max_value, value)
                alpha = max(alpha, value)
                
                # Beta cutoff (pruning)
                if beta <= alpha:
                    node['pruned'] = True
                    break
            
            return max_value, {
                'value': max_value,
                'type': 'max',
                'depth': self.depth_limit - depth,
                'alpha': alpha,
                'beta': beta,
                'children': children_trees
            }
        
        else:
            # Minimizing player (Human)
            min_value = 1e12
            children_trees = []
            
            for col in valid_columns:
                temp_board = board.copy()
                temp_board.drop_disc(col, HUMAN)
                
                value, child_tree = self.alpha_beta(temp_board, depth - 1, 
                                                    alpha, beta, True)
                
                node = {
                    'column': col,
                    'value': value,
                    'type': 'min',
                    'depth': self.depth_limit - depth,
                    'alpha': alpha,
                    'beta': beta,
                    'children': [child_tree] if child_tree else []
                }
                children_trees.append(node)
                
                min_value = min(min_value, value)
                beta = min(beta, value)
                
                # Alpha cutoff (pruning)
                if beta <= alpha:
                    node['pruned'] = True
                    break
            
            return min_value, {
                'value': min_value,
                'type': 'min',
                'depth': self.depth_limit - depth,
                'alpha': alpha,
                'beta': beta,
                'children': children_trees
            }