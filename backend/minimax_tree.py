import copy
import json

class TreeNode:
    def __init__(self, board, move=None, player=None, depth=0):
        self.board = copy.deepcopy(board)   # 2D list
        self.move = move                    # column index that led here
        self.player = player                # player who just moved to get this state
        self.score = None                   # heuristic / minimax value
        self.children = []                  # list of TreeNode
        self.depth = depth                  # depth from root (root depth = max_depth)
        self.nodes_expanded = 0             # optional stat

    # getters
    def get_board(self): return copy.deepcopy(self.board)
    def get_move(self): return self.move
    def get_player(self): return self.player
    def get_score(self): return self.score
    def get_children(self): return self.children
    def get_depth(self): return self.depth

    # serialize to python dict (JSON serializable)
    def to_dict(self, include_board=True, max_child_depth=None):
        d = {
            "move": self.move,
            "player": self.player,
            "score": self.score,
            "depth": self.depth,
        }
        if include_board:
            d["board"] = self.board
        if max_child_depth is None or self.depth > 0:
            d["children"] = [c.to_dict(include_board=include_board, max_child_depth=max_child_depth) for c in self.children]
        else:
            d["children"] = []
        return d

    def pretty_print(self, indent=0, show_board=False):
        pad = "  " * indent
        s = f"{pad}- move={self.move} player={self.player} score={self.score} depth={self.depth}\n"
        if show_board:
            for row in self.board:
                s += pad + "  " + str(row) + "\n"
        for c in self.children:
            s += c.pretty_print(indent+1, show_board=show_board)
        return s