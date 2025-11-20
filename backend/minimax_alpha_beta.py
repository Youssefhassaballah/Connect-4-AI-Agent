import copy
import json
from minimax_alpha_beta_tree import TreeNode

class Connect4:
    def __init__(self, rows=6, cols=7, max_depth=4):
        self.rows = rows
        self.cols = cols
        self.board = [[0] * cols for _ in range(rows)]
        self.current_player = 1
        self.max_depth = max_depth

        self.weights = {
            "four": 100000,
            "three": 120,
            "two": 10,
            "center": 4,
            "opp_four": -100000,
            "opp_three": -150,
            "opp_two": -15
        }

    def set_board(self, board):
        self.board = copy.deepcopy(board)

    def get_board(self):
        return copy.deepcopy(self.board)

    def set_player(self, player):
        self.current_player = player

    def get_player(self):
        return self.current_player

    def set_depth(self, depth):
        self.max_depth = depth

    def get_depth(self):
        return self.max_depth

    def set_weights(self, weights_dict):
        self.weights.update(weights_dict)

    def get_weights(self):
        return dict(self.weights)

    def is_valid_move(self, col):
        return 0 <= col < self.cols and self.board[0][col] == 0

    def get_valid_moves(self, board):
        return [c for c in range(self.cols) if board[0][c] == 0]

    def apply_move_on_board(self, board, col, player):
        new_board = copy.deepcopy(board)
        for r in range(self.rows - 1, -1, -1):
            if new_board[r][col] == 0:
                new_board[r][col] = player
                return new_board
        return None

    def apply_move(self, col, player):
        new_board = self.apply_move_on_board(self.board, col, player)
        if new_board:
            self.board = new_board
            return True
        return False

    def board_full(self, board=None):
        b = board if board is not None else self.board
        return all(b[0][c] != 0 for c in range(self.cols))

    def terminal_check(self, board):
        if self.board_full(board):
            return True, 0
        return False, 0

    def count_connect4(self, board=None, player=2):
        b = board if board is not None else self.board
        cnt = 0

        for r in range(self.rows):
            for c in range(self.cols - 3):
                if all(b[r][c+i] == player for i in range(4)):
                    cnt += 1

        for c in range(self.cols):
            for r in range(self.rows - 3):
                if all(b[r+i][c] == player for i in range(4)):
                    cnt += 1

        for r in range(self.rows - 3):
            for c in range(self.cols - 3):
                if all(b[r+i][c+i] == player for i in range(4)):
                    cnt += 1

        for r in range(3, self.rows):
            for c in range(self.cols - 3):
                if all(b[r-i][c+i] == player for i in range(4)):
                    cnt += 1

        return cnt

    def evaluate_window(self, window, player):
        opp = 1 if player == 2 else 2
        pc = window.count(player)
        oc = window.count(opp)
        ec = window.count(0)
        score = 0

        if pc == 4:
            score += self.weights["four"]
        elif pc == 3 and ec == 1:
            score += self.weights["three"]
        elif pc == 2 and ec == 2:
            score += self.weights["two"]

        if oc == 4:
            score += self.weights["opp_four"]
        elif oc == 3 and ec == 1:
            score += self.weights["opp_three"]
        elif oc == 2 and ec == 2:
            score += self.weights["opp_two"]

        return score

    def heuristic(self, board=None):
        b = board if board is not None else self.board
        AI = 2
        score = 0

        # center bonus
        c = self.cols // 2
        score += sum(1 for r in range(self.rows) if b[r][c] == AI) * self.weights["center"]

        # windows
        for r in range(self.rows):
            for col in range(self.cols - 3):
                score += self.evaluate_window([b[r][col+i] for i in range(4)], AI)

        for col in range(self.cols):
            for r in range(self.rows - 3):
                score += self.evaluate_window([b[r+i][col] for i in range(4)], AI)

        for r in range(self.rows - 3):
            for col in range(self.cols - 3):
                score += self.evaluate_window([b[r+i][col+i] for i in range(4)], AI)

        for r in range(3, self.rows):
            for col in range(self.cols - 3):
                score += self.evaluate_window([b[r-i][col+i] for i in range(4)], AI)

        return score

    def minimax_build_tree(self, board, depth, maximizing_player, player_to_move, alpha=-1e12, beta=1e12):
        """
        Returns (score, best_move, tree_node)
        player_to_move: the player who will place a disc at this node
        maximizing_player: True if we are maximizing (AI's turn)
        """
        node = TreeNode(board, move=None, player=None, depth=depth)

        terminal, val = self.terminal_check(board)
        if terminal or depth == 0:
            node.score = val if terminal else self.heuristic(board)
            return node.score, None, node

        moves = self.get_valid_moves(board)

        # ========== MAX ==========
        if maximizing_player:
            best = -1e12
            best_move = None

            for mv in moves:
                new_board = self.apply_move_on_board(board, mv, player_to_move)
                score, _, child = self.minimax_build_tree(
                    new_board, depth - 1,
                    False,
                    1 if player_to_move == 2 else 2,
                    alpha, beta
                )

                child.move = mv
                child.player = player_to_move
                node.children.append(child)
                node.nodes_expanded += 1

                if score > best:
                    best = score
                    best_move = mv

                alpha = max(alpha, best)
                if beta <= alpha:
                    break

            node.score = best
            return best, best_move, node

        # ========== MIN ==========
        else:
            best = 1e12
            best_move = None

            for mv in moves:
                new_board = self.apply_move_on_board(board, mv, player_to_move)
                score, _, child = self.minimax_build_tree(
                    new_board, depth - 1,
                    True,
                    1 if player_to_move == 2 else 2,
                    alpha, beta
                )

                child.move = mv
                child.player = player_to_move
                node.children.append(child)
                node.nodes_expanded += 1

                if score < best:
                    best = score
                    best_move = mv

                beta = min(beta, best)
                if beta <= alpha:
                    break

            node.score = best
            return best, best_move, node

    def build_minimax_tree_current(self):
        return self.minimax_build_tree(
            self.board,
            self.max_depth,
            True,
            2
        )

    def save_tree_json(self, root_node: TreeNode, path):
        data = root_node.to_dict(include_board=True)
        with open(path, "w") as f:
            json.dump(data, f, indent=2)

    def print_tree_console(self, root_node: TreeNode, show_boards=False):
        print(root_node.pretty_print(indent=0, show_board=show_boards))

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
    game.apply_move(4, 1)
    game.apply_move(4, 1)
    game.apply_move(4, 1)
    game.apply_move(4, 1)
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

    if best_move is not None:
        print("\nApplying AI move...")
        game.apply_move(best_move, 2)

        print("\nBoard after AI move:")
        for row in game.get_board():
            print(row)
    else:
        print("\nGame is already in a terminal state (board full). No move to apply.")

    game.save_tree_json(tree, "tree_output_alpha_beta.json")
    print("\nTree saved as tree_output_alpha_beta.json")