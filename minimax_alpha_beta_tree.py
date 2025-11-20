import copy

class TreeNode:
    def __init__(self, board, move=None, player=None, depth=0):
        self.board = copy.deepcopy(board)
        self.move = move
        self.player = player
        self.depth = depth
        self.score = None
        self.children = []
        self.nodes_expanded = 0

    def to_dict(self, include_board=True):
        d = {
            "move": self.move,
            "player": self.player,
            "score": self.score,
            "depth": self.depth,
            "children": [c.to_dict(include_board) for c in self.children]
        }
        if include_board:
            d["board"] = self.board
        return d

    def pretty_print(self, indent=0, show_board=False):
        pad = "  " * indent
        s = f"{pad}- move={self.move}, player={self.player}, score={self.score}, depth={self.depth}\n"
        if show_board:
            for row in self.board:
                s += pad + "  " + str(row) + "\n"
        for c in self.children:
            s += c.pretty_print(indent + 1, show_board=show_board)
        return s