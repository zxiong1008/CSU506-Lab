"""A generic, unbalanced binary search tree for comparable keys."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Generic, Iterable, TypeVar

Key = TypeVar("Key")


@dataclass
class _Node(Generic[Key]):
    key: Key
    left: _Node[Key] | None = None
    right: _Node[Key] | None = None


class BinarySearchTree(Generic[Key]):
    """BST supporting insert, delete, search, traversals, extrema, and balance checks."""

    def __init__(self, values: Iterable[Key] = ()) -> None:
        self.root: _Node[Key] | None = None
        self.size = 0
        for value in values:
            self.insert(value)

    def insert(self, key: Key) -> bool:
        """Insert a key; return False when it already exists."""
        if self.root is None:
            self.root = _Node(key)
            self.size = 1
            return True
        node = self.root
        while True:
            if key == node.key:
                return False
            if key < node.key:  # type: ignore[operator]
                if node.left is None:
                    node.left = _Node(key)
                    self.size += 1
                    return True
                node = node.left
            else:
                if node.right is None:
                    node.right = _Node(key)
                    self.size += 1
                    return True
                node = node.right

    def search(self, key: Key) -> bool:
        node = self.root
        while node is not None:
            if key == node.key:
                return True
            node = node.left if key < node.key else node.right  # type: ignore[operator]
        return False

    def delete(self, key: Key) -> bool:
        """Delete a key, replacing two-child nodes with their in-order successor."""
        def remove(node: _Node[Key] | None) -> tuple[_Node[Key] | None, bool]:
            if node is None:
                return None, False
            if key < node.key:  # type: ignore[operator]
                node.left, deleted = remove(node.left)
                return node, deleted
            if key > node.key:  # type: ignore[operator]
                node.right, deleted = remove(node.right)
                return node, deleted
            if node.left is None:
                return node.right, True
            if node.right is None:
                return node.left, True
            successor = node.right
            while successor.left is not None:
                successor = successor.left
            node.key = successor.key
            node.right, _ = remove_successor(node.right, successor.key)
            return node, True

        def remove_successor(node: _Node[Key], successor_key: Key) -> tuple[_Node[Key] | None, bool]:
            if successor_key < node.key:  # type: ignore[operator]
                node.left, deleted = remove_successor(node.left, successor_key)  # type: ignore[arg-type]
                return node, deleted
            if successor_key > node.key:  # type: ignore[operator]
                node.right, deleted = remove_successor(node.right, successor_key)  # type: ignore[arg-type]
                return node, deleted
            return node.right, True

        self.root, deleted = remove(self.root)
        if deleted:
            self.size -= 1
        return deleted

    def minimum(self) -> Key | None:
        node = self.root
        if node is None:
            return None
        while node.left is not None:
            node = node.left
        return node.key

    def maximum(self) -> Key | None:
        node = self.root
        if node is None:
            return None
        while node.right is not None:
            node = node.right
        return node.key

    def _traverse(self, order: str) -> list[Key]:
        result: list[Key] = []

        def visit(node: _Node[Key] | None) -> None:
            if node is None:
                return
            if order == "preorder":
                result.append(node.key)
            visit(node.left)
            if order == "inorder":
                result.append(node.key)
            visit(node.right)
            if order == "postorder":
                result.append(node.key)

        visit(self.root)
        return result

    def inorder(self) -> list[Key]:
        return self._traverse("inorder")

    def preorder(self) -> list[Key]:
        return self._traverse("preorder")

    def postorder(self) -> list[Key]:
        return self._traverse("postorder")

    def height(self) -> int:
        def measure(node: _Node[Key] | None) -> int:
            return 0 if node is None else 1 + max(measure(node.left), measure(node.right))
        return measure(self.root)

    def is_balanced(self) -> bool:
        """Return whether every node's left/right subtree heights differ by <= 1."""
        def check(node: _Node[Key] | None) -> int:
            if node is None:
                return 0
            left_height = check(node.left)
            if left_height < 0:
                return -1
            right_height = check(node.right)
            if right_height < 0 or abs(left_height - right_height) > 1:
                return -1
            return 1 + max(left_height, right_height)
        return check(self.root) >= 0

    def to_nested_dict(self) -> dict[str, object] | None:
        def encode(node: _Node[Key] | None) -> dict[str, object] | None:
            if node is None:
                return None
            return {"value": node.key, "left": encode(node.left), "right": encode(node.right)}
        return encode(self.root)

    def __len__(self) -> int:
        return self.size
