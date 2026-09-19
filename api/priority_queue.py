"""Binary-heap priority queue implementation."""

from __future__ import annotations

from typing import Generic, TypeVar, Iterable

from hash_table import HashTable

Item = TypeVar("Item")


class PriorityQueue(Generic[Item]):
    """A max-heap priority queue for items with integer or floating priorities.

    The queue stores pairs of (priority, item). The larger priority value is treated
    as higher priority, so the root of the heap is the item with the maximum score.
    """

    def __init__(self, entries: Iterable[tuple[Item, float | int]] | None = None) -> None:
        self._heap: list[tuple[float | int, Item]] = []
        if entries:
            for item, priority in entries:
                self.insert(item, priority)

    def _parent_index(self, index: int) -> int:
        return (index - 1) // 2

    def _left_child_index(self, index: int) -> int:
        return (2 * index) + 1

    def _right_child_index(self, index: int) -> int:
        return (2 * index) + 2

    def _swap(self, left: int, right: int) -> None:
        self._heap[left], self._heap[right] = self._heap[right], self._heap[left]

    def _sift_up(self, index: int) -> None:
        while index > 0:
            parent_index = self._parent_index(index)
            if self._heap[parent_index][0] >= self._heap[index][0]:
                break
            self._swap(parent_index, index)
            index = parent_index

    def _sift_down(self, index: int) -> None:
        size = len(self._heap)
        while True:
            left = self._left_child_index(index)
            right = self._right_child_index(index)
            largest = index

            if left < size and self._heap[left][0] > self._heap[largest][0]:
                largest = left
            if right < size and self._heap[right][0] > self._heap[largest][0]:
                largest = right

            if largest == index:
                break

            self._swap(index, largest)
            index = largest

    def insert(self, item: Item, priority: float | int) -> None:
        if not isinstance(priority, (int, float)):
            raise TypeError("priority must be numeric")
        self._heap.append((priority, item))
        self._sift_up(len(self._heap) - 1)

    def peek(self) -> tuple[Item, float | int]:
        if not self._heap:
            raise IndexError("priority queue is empty")
        priority, item = self._heap[0]
        return item, priority

    def extract_max(self) -> tuple[Item, float | int]:
        if not self._heap:
            raise IndexError("priority queue is empty")
        priority, item = self._heap[0]
        last_priority, last_item = self._heap.pop()

        if self._heap:
            self._heap[0] = (last_priority, last_item)
            self._sift_down(0)

        return item, priority

    def extract_min(self) -> tuple[Item, float | int]:
        if not self._heap:
            raise IndexError("priority queue is empty")

        minimum = min(self._heap, key=lambda entry: entry[0])
        index = self._heap.index(minimum)
        self._swap(index, len(self._heap) - 1)
        priority, item = self._heap.pop()

        if index < len(self._heap):
            if index > 0 and self._heap[index][0] > self._heap[self._parent_index(index)][0]:
                self._sift_up(index)
            else:
                self._sift_down(index)

        return item, priority

    def search(self, item: Item) -> bool:
        return any(entry[1] == item for entry in self._heap)

    def delete(self, item: Item) -> bool:
        for index, (_, current_item) in enumerate(self._heap):
            if current_item == item:
                last_index = len(self._heap) - 1
                self._swap(index, last_index)
                self._heap.pop()

                if index < len(self._heap):
                    if index > 0 and self._heap[index][0] > self._heap[self._parent_index(index)][0]:
                        self._sift_up(index)
                    else:
                        self._sift_down(index)
                return True
        return False

    def __len__(self) -> int:
        return len(self._heap)

    def __bool__(self) -> bool:
        return bool(self._heap)

    def __repr__(self) -> str:
        return f"PriorityQueue(size={len(self._heap)})"


def compare_hash_table_vs_linear_search(size: int = 200) -> dict[str, dict[str, float | int] | float]:
    """Compatibility wrapper for the performance comparison helper."""
    from hash_table import compare_hash_table_vs_linear_search as _compare_hash_table_vs_linear_search
    return _compare_hash_table_vs_linear_search(size)


__all__ = ["PriorityQueue", "compare_hash_table_vs_linear_search"]
