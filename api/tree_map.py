"""A sorted key-value map backed by the project's binary search tree."""

from __future__ import annotations

from typing import Generic, Iterable, TypeVar

from binary_search_tree import BinarySearchTree

Key = TypeVar("Key")
Value = TypeVar("Value")


class TreeMap(Generic[Key, Value]):
    """Map with O(h) lookup/update/delete and sorted key iteration."""

    def __init__(self, entries: Iterable[tuple[Key, Value]] = ()) -> None:
        self._keys: BinarySearchTree[Key] = BinarySearchTree()
        self._values: dict[Key, Value] = {}
        for key, value in entries:
            self.put(key, value)

    def put(self, key: Key, value: Value) -> Value | None:
        previous = self._values.get(key)
        self._keys.insert(key)
        self._values[key] = value
        return previous

    def get(self, key: Key, default: Value | None = None) -> Value | None:
        if not self._keys.search(key):
            return default
        return self._values[key]

    def contains(self, key: Key) -> bool:
        return self._keys.search(key)

    def delete(self, key: Key) -> bool:
        if not self._keys.delete(key):
            return False
        del self._values[key]
        return True

    def items(self) -> list[tuple[Key, Value]]:
        return [(key, self._values[key]) for key in self._keys.inorder()]

    @property
    def tree(self) -> BinarySearchTree[Key]:
        return self._keys

    def __len__(self) -> int:
        return len(self._keys)
