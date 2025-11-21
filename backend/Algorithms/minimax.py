import copy
import json
from backend.Trees.minimax_tree import TreeNode

class Connect4:
    def __init__(self, rows=6, cols=7, max_depth=4):
        self.rows = rows
        self.cols = cols
        self.board = [[0]*cols for _ in range(rows)]
        self.current_player = 1
        self.max_depth = max_depth
        self.weights = {
            "four": 100000,
            "three": 100,
            "two": 10,
            "center": 3,
            "opp_four": -100000,
            "opp_three": -120,
            "opp_two": -15
        }

    def set_board(self, board):
        self.board = copy.deepcopy(board)

    def set_player(self, player):
        self.current_player = player

    def set_depth(self, depth):
        self.max_depth = depth

    def set_weights(self, weights_dict):
        self.weights.update(weights_dict)

    def get_board(self):
        return copy.deepcopy(self.board)

    def get_player(self):
        return self.current_player

    def get_depth(self):
        return self.max_depth

    def get_weights(self):
        return dict(self.weights)

    def is_valid_move(self, col):
        return 0 <= col < self.cols and self.board[0][col] == 0

    def apply_move_on_board(self, board, col, player):
        new_board = copy.deepcopy(board)
        for r in range(self.rows-1, -1, -1):
            if new_board[r][col] == 0:
                new_board[r][col] = player
                return new_board
        return None

    def apply_move(self, col, player):
        new = self.apply_move_on_board(self.board, col, player)
        if new is not None:
            self.board = new
            return True
        return False

    def board_full(self, board=None):
        b = board if board is not None else self.board
        return all(b[0][c] != 0 for c in range(self.cols))

    def get_valid_moves(self, board):
        return [c for c in range(self.cols) if board[0][c] == 0]

    def evaluate_window(self, window, player):
        opp = 1 if player == 2 else 2
        score = 0
        player_count = window.count(player)
        opp_count = window.count(opp)
        empty_count = window.count(0)

        if player_count == 4:
            score += self.weights["four"]
        elif player_count == 3 and empty_count == 1:
            score += self.weights["three"]
        elif player_count == 2 and empty_count == 2:
            score += self.weights["two"]

        if opp_count == 4:
            score += self.weights["opp_four"]
        elif opp_count == 3 and empty_count == 1:
            score += self.weights["opp_three"]
        elif opp_count == 2 and empty_count == 2:
            score += self.weights["opp_two"]

        return score

    def heuristic(self, board=None):
        b = board if board is not None else self.board
        score = 0
        AI = 2

        # center control
        center_col = self.cols // 2
        center_count = sum(1 for r in range(self.rows) if b[r][center_col] == AI)
        score += center_count * self.weights["center"]

        # horizontal windows
        for r in range(self.rows):
            for c in range(self.cols - 3):
                window = [b[r][c+i] for i in range(4)]
                score += self.evaluate_window(window, AI)

        # vertical windows
        for c in range(self.cols):
            for r in range(self.rows - 3):
                window = [b[r+i][c] for i in range(4)]
                score += self.evaluate_window(window, AI)

        # diag down-right
        for r in range(self.rows - 3):
            for c in range(self.cols - 3):
                window = [b[r+i][c+i] for i in range(4)]
                score += self.evaluate_window(window, AI)

        # diag up-right
        for r in range(3, self.rows):
            for c in range(self.cols - 3):
                window = [b[r-i][c+i] for i in range(4)]
                score += self.evaluate_window(window, AI)

        return score

    def minimax_build_tree(self, board, depth, maximizing_player, player_to_move):
        """
        Returns (score, best_move, tree_node)
        player_to_move: the player who will place a disc at this node
        maximizing_player: True if we are maximizing (AI's turn)
        """
        root = TreeNode(board=board, move=None, player=None, depth=depth)
        if depth == 0 or self.board_full(board):
            val = self.heuristic(board)
            root.score = val
            return val, None, root

        valid_moves = self.get_valid_moves(board)
        if maximizing_player:
            best_score = -10**12
            best_move = None
            for mv in valid_moves:
                child_board = self.apply_move_on_board(board, mv, player_to_move)
                score, _, child_node = self.minimax_build_tree(child_board, depth-1, False, 1 if player_to_move==2 else 2)
                child_node.move = mv
                child_node.player = player_to_move
                root.children.append(child_node)
                root.nodes_expanded += 1
                if score > best_score:
                    best_score = score
                    best_move = mv
            root.score = best_score
            return best_score, best_move, root
        else:
            best_score = 10**12
            best_move = None
            for mv in valid_moves:
                child_board = self.apply_move_on_board(board, mv, player_to_move)
                score, _, child_node = self.minimax_build_tree(child_board, depth-1, True, 1 if player_to_move==2 else 2)
                child_node.move = mv
                child_node.player = player_to_move
                root.children.append(child_node)
                root.nodes_expanded += 1
                if score < best_score:
                    best_score = score
                    best_move = mv
            root.score = best_score
            return best_score, best_move, root

    def build_minimax_tree_current(self):
        score, best_move, root = self.minimax_build_tree(self.board, self.max_depth, True, 2)
        return score, best_move, root

    def save_tree_json(self, root_node: TreeNode, path):
        data = root_node.to_dict(include_board=True)
        with open(path, "w") as f:
            json.dump(data, f, indent=2)

    def print_tree_console(self, root_node: TreeNode, show_boards=False):
        print(root_node.pretty_print(indent=0, show_board=show_boards))

    def count_connect4(self, board=None, player=2):
        b = board if board is not None else self.board
        cnt = 0
        # horizontal
        for r in range(self.rows):
            for c in range(self.cols - 3):
                if all(b[r][c+i] == player for i in range(4)):
                    cnt += 1
        # vertical
        for c in range(self.cols):
            for r in range(self.rows - 3):
                if all(b[r+i][c] == player for i in range(4)):
                    cnt += 1
        # diag dr
        for r in range(self.rows - 3):
            for c in range(self.cols - 3):
                if all(b[r+i][c+i] == player for i in range(4)):
                    cnt += 1
        # diag ur
        for r in range(3, self.rows):
            for c in range(self.cols - 3):
                if all(b[r-i][c+i] == player for i in range(4)):
                    cnt += 1
        return cnt

    def final_winner_by_count(self):
        ai = self.count_connect4(player=2)
        human = self.count_connect4(player=1)
        if ai > human:
            return "AI", ai, human
        elif human > ai:
            return "HUMAN", ai, human
        else:
            return "DRAW", ai, human




if __name__ == "__main__":

    game = Connect4(rows=6, cols=7, max_depth=4)

    game.apply_move(3, 1)
    game.apply_move(2, 2)
    game.apply_move(4, 1)
    print("Board before AI move:")
    for row in game.get_board():
        print(row)

    score, best_move, tree = game.build_minimax_tree_current()

    print("\nAI Decision:")
    print("Best move =", best_move)
    print("Score =", score)

    print("\n=== MINIMAX TREE ===")
    game.print_tree_console(tree, show_boards=False)

    print("\nApplying AI move...")
    game.apply_move(best_move, 2)

    print("\nBoard after AI move:")
    for row in game.get_board():
        print(row)

    game.save_tree_json(tree, "tree_output.json")
    print("\nTree saved as tree_output.json")