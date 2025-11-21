"""
Expected Minimax algorithm
Accounts for probability: 60% chosen column, 40% split between adjacent columns
"""
import time
from game.board import AI, HUMAN, COLS
from game.heuristic import evaluate_board

class ExpectiminiMaxAlgorithm:
    def __init__(self, depth_limit=4):
        self.depth_limit = depth_limit
        self.nodes_expanded = 0
        self.start_time = None
    
    def get_best_move(self, board):
        """
        Get the best move for AI using expectiminimax algorithm
        Returns: (best_column, tree_structure, stats)
        """
        self.nodes_expanded = 0
        self.start_time = time.time()
        
        best_col = None
        best_value = float('-inf')
        tree_children = []
        
        valid_columns = board.get_valid_columns()
        
        for col in valid_columns:
            # Expected value for this column choice
            expected_value, child_tree = self.expectiminimax_chance(
                board, col, self.depth_limit - 1, False
            )
            
            tree_node = {
                'column': col,
                'value': expected_value,
                'type': 'max',
                'children': [child_tree] if child_tree else []
            }
            tree_children.append(tree_node)
            
            if expected_value > best_value:
                best_value = expected_value
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
    
    def expectiminimax_chance(self, board, chosen_col, depth, is_maximizing):
        """
        Handle the chance node - disc might fall in adjacent columns
        
        Probability distribution:
        - 60% (0.6): Falls in chosen column
        - 20% (0.2): Falls in left adjacent column (if valid)
        - 20% (0.2): Falls in right adjacent column (if valid)
        """
        self.nodes_expanded += 1
        
        if depth == 0 or board.is_terminal():
            eval_value = evaluate_board(board)
            return eval_value, {
                'value': eval_value,
                'type': 'leaf',
                'depth': self.depth_limit - depth,
                'children': []
            }
        
        # Determine possible outcomes with probabilities
        outcomes = []
        player = AI if is_maximizing else HUMAN
        
        # Primary outcome: 60% chance of chosen column
        if board.is_valid_column(chosen_col):
            outcomes.append((chosen_col, 0.6))
        
        # Left adjacent: 20% chance
        left_col = chosen_col - 1
        if left_col >= 0 and board.is_valid_column(left_col):
            outcomes.append((left_col, 0.2))
        
        # Right adjacent: 20% chance
        right_col = chosen_col + 1
        if right_col < COLS and board.is_valid_column(right_col):
            outcomes.append((right_col, 0.2))
        
        # If no valid outcomes, return evaluation
        if not outcomes:
            eval_value = evaluate_board(board)
            return eval_value, {
                'value': eval_value,
                'type': 'leaf',
                'depth': self.depth_limit - depth,
                'children': []
            }
        
        # Normalize probabilities if some adjacent columns were invalid
        total_prob = sum(prob for _, prob in outcomes)
        outcomes = [(col, prob / total_prob) for col, prob in outcomes]
        
        # Calculate expected value
        expected_value = 0
        outcome_trees = []
        
        for actual_col, probability in outcomes:
            temp_board = board.copy()
            temp_board.drop_disc(actual_col, player)
            
            # Recursively call expectiminimax
            value, child_tree = self.expectiminimax(temp_board, depth - 1, not is_maximizing)
            
            outcome_trees.append({
                'column': actual_col,
                'probability': probability,
                'value': value,
                'type': 'chance',
                'depth': self.depth_limit - depth,
                'children': [child_tree] if child_tree else []
            })
            
            expected_value += probability * value
        
        return expected_value, {
            'value': expected_value,
            'type': 'chance',
            'depth': self.depth_limit - depth,
            'children': outcome_trees
        }
    
    def expectiminimax(self, board, depth, is_maximizing):
        """
        Main expectiminimax recursive function
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
            children_trees = []
            
            for col in valid_columns:
                # Each choice leads to a chance node
                expected_value, child_tree = self.expectiminimax_chance(
                    board, col, depth, is_maximizing
                )
                
                children_trees.append({
                    'column': col,
                    'value': expected_value,
                    'type': 'max',
                    'depth': self.depth_limit - depth,
                    'children': [child_tree] if child_tree else []
                })
                
                max_value = max(max_value, expected_value)
            
            return max_value, {
                'value': max_value,
                'type': 'max',
                'depth': self.depth_limit - depth,
                'children': children_trees
            }
        
        else:
            # Minimizing player (Human)
            min_value = float('inf')
            children_trees = []
            
            for col in valid_columns:
                # Each choice leads to a chance node
                expected_value, child_tree = self.expectiminimax_chance(
                    board, col, depth, is_maximizing
                )
                
                children_trees.append({
                    'column': col,
                    'value': expected_value,
                    'type': 'min',
                    'depth': self.depth_limit - depth,
                    'children': [child_tree] if child_tree else []
                })
                
                min_value = min(min_value, expected_value)
            
            return min_value, {
                'value': min_value,
                'type': 'min',
                'depth': self.depth_limit - depth,
                'children': children_trees
            }