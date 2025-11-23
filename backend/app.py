"""
Flask API for Connect 4 AI
"""
from flask import Flask, request, jsonify
from flask_cors import CORS

from game.board import Board
from Algorithms.minimax import MinimaxAlgorithm
from Algorithms.alpha_beta import AlphaBetaAlgorithm
from Algorithms.expectiminimax import ExpectiminiMaxAlgorithm

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

@app.route('/api/move', methods=['POST'])
def get_ai_move():
    """
    Get AI move based on current board state and algorithm choice
    
    Request body:
    {
        "board": [[0,0,0,...], ...],
        "algorithm": "minimax" | "minimax_alpha_beta" | "expectiminimax",
        "depth": 4,
        "player": 2
    }
    
    Response:
    {
        "column": 3,
        "tree": {...},
        "nodesExpanded": 1250,
        "timeTaken": 0.345,
        "evaluation": 10
    }
    """
    try:
        data = request.get_json()
        
        # Extract parameters
        board_state = data.get('board')
        algorithm = data.get('algorithm', 'minimax_alpha_beta')
        depth = data.get('depth', 4)
        
        # Validate inputs
        if not board_state:
            return jsonify({'error': 'Board state is required'}), 400
        
        if depth < 1 or depth > 10:
            return jsonify({'error': 'Depth must be between 1 and 10'}), 400
        
        # Create board from state
        board = Board(board_state)
        
        # Check if board is full
        if board.is_terminal():
            return jsonify({'error': 'Board is full'}), 400
        
        # Select algorithm
        if algorithm == 'minimax':
            ai_algorithm = MinimaxAlgorithm(depth_limit=depth)
        elif algorithm == 'minimax_alpha_beta':
            ai_algorithm = AlphaBetaAlgorithm(depth_limit=depth)
        elif algorithm == 'expectiminimax':
            ai_algorithm = ExpectiminiMaxAlgorithm(depth_limit=depth)
        else:
            return jsonify({'error': f'Unknown algorithm: {algorithm}'}), 400
        
        # Get best move
        best_column, tree, stats = ai_algorithm.get_best_move(board)
        board.drop_disc(best_column,2)
        score = board.check_winner()
        
        # Print tree to console (for debugging/verification)
        print(f"\n{'='*50}")
        print(f"Algorithm: {algorithm}")
        print(f"Depth: {depth}")
        print(f"Best Column: {best_column}")
        print(f"Nodes Expanded: {stats['nodesExpanded']}")
        print(f"Time Taken: {stats['timeTaken']:.4f}s")
        print(f"Evaluation: {stats['evaluation']}")
        print(f"{'='*50}\n")
        print_tree(tree, indent=0)
        print(f"\n{'='*50}\n")
        
        # Return response
        response = {
            'column': best_column,
            'tree': tree,
            'nodesExpanded': stats['nodesExpanded'],
            'timeTaken': stats['timeTaken'],
            'evaluation': stats['evaluation'],
            'score': score
            
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


def print_tree(node, indent=0):
    """
    Print tree in readable format to console
    """
    if not node:
        return
    
    prefix = "  " * indent
    node_type = node.get('type', 'unknown')
    value = node.get('value', 'N/A')
    column = node.get('column', '')
    
    # Print node info
    if column != '':
        print(f"{prefix}[{node_type.upper()}] Col:{column} Value:{value}", end='')
    else:
        print(f"{prefix}[{node_type.upper()}] Value:{value}", end='')
    
    # Print alpha-beta values if present
    if 'alpha' in node and 'beta' in node:
        print(f" α:{node['alpha']} β:{node['beta']}", end='')
    
    # Print probability if present (expectiminimax)
    if 'probability' in node:
        print(f" P:{node['probability']:.2f}", end='')
    
    # Print if pruned
    if node.get('pruned'):
        print(" [PRUNED]", end='')
        
    if 'board' in node:
        print(f"\n{prefix}Board State:\n{prefix}{node['board'].replace('\n', '\n'+prefix)}", end='')
    
    print()
    
    # Print children
    children = node.get('children', [])
    for child in children:
        print_tree(child, indent + 1)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Connect 4 AI backend is running'}), 200


@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        'message': 'Connect 4 AI Backend',
        'endpoints': {
            '/api/move': 'POST - Get AI move',
            '/api/health': 'GET - Health check'
        }
    }), 200

@app.route('/api/score', methods=['POST'])
def get_score():
    """
    Get current score of the board
    
    Request body:
    {
        "board": [[0,0,0,...], ...]
    }
    
    Response:
    {
        "humanScore": 10,
        "aiScore": 15
    }
    """
    try:
        data = request.get_json()
        
        # Extract board state
        board_state = data.get('board')
        
        # Validate input
        if not board_state:
            return jsonify({'error': 'Board state is required'}), 400
        
        # Create board from state
        board = Board(board_state)
        
        # Get scores
        human_score, ai_score = board.getScore()
        
        # Return response
        response = {
            'humanScore': human_score,
            'aiScore': ai_score
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Connect 4 AI Backend Server...")
    print("Server running on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)