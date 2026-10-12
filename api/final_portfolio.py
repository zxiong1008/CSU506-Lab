from __future__ import annotations

from typing import Any, Iterable, List


class Set:
    """A small, Pythonic set implementation that supports standard set operations."""

    def __init__(self, values: Iterable[Any] | None = None):
        items = list(values or [])
        self._values = list(dict.fromkeys(items))

    @property
    def values(self) -> List[Any]:
        return list(self._values)

    def __len__(self) -> int:
        return len(self._values)

    def __iter__(self):
        return iter(self._values)

    def __contains__(self, value: Any) -> bool:
        return value in self._values

    def __repr__(self) -> str:
        return f"Set({self._values})"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Set):
            return NotImplemented
        return set(self._values) == set(other._values)

    def add(self, value: Any) -> None:
        if value not in self._values:
            self._values.append(value)

    def remove(self, value: Any) -> None:
        if value not in self._values:
            raise KeyError(value)
        self._values.remove(value)

    def union(self, other: "Set") -> "Set":
        result = Set(self._values)
        for item in other._values:
            result.add(item)
        return result

    def intersection(self, other: "Set") -> "Set":
        return Set([item for item in self._values if item in other._values])

    def difference(self, other: "Set") -> "Set":
        return Set([item for item in self._values if item not in other._values])

    def symmetric_difference(self, other: "Set") -> "Set":
        result = Set(self._values)
        for item in other._values:
            if item in result._values:
                result.remove(item)
            else:
                result.add(item)
        return result


def bubble_sort_with_steps(values: List[int]) -> tuple[List[int], List[dict[str, Any]]]:
    """Sort a list of integers and return both the sorted result and a trace of the steps."""
    data = list(values)
    steps: List[dict[str, Any]] = []

    for end in range(len(data) - 1, 0, -1):
        swapped = False
        for index in range(end):
            if data[index] > data[index + 1]:
                data[index], data[index + 1] = data[index + 1], data[index]
                swapped = True
            steps.append(
                {
                    "pass": len(steps) + 1,
                    "array": data[:],
                    "compared": [index, index + 1],
                    "swapped": swapped,
                }
            )
        if not swapped:
            break

    return data, steps


def quickselect(values: List[int], k: int) -> int:
    """Return the kth smallest value using the quickselect algorithm. k is 1-indexed."""
    if not values:
        raise ValueError("quickselect requires at least one value")
    if k < 1 or k > len(values):
        raise ValueError("k must be between 1 and the number of values")

    data = list(values)

    def select(left: int, right: int) -> int:
        pivot = data[right]
        tracker = left

        for index in range(left, right):
            if data[index] <= pivot:
                data[tracker], data[index] = data[index], data[tracker]
                tracker += 1

        data[tracker], data[right] = data[right], data[tracker]
        if tracker == k - 1:
            return data[tracker]
        if k - 1 < tracker:
            return select(left, tracker - 1)
        return select(tracker + 1, right)

    return select(0, len(data) - 1)


def portfolio_summary() -> dict[str, Any]:
    """Return a concise overview of the final portfolio system and its key concepts."""
    return {
        "title": "CSU 506 Final Portfolio",
        "status": "complete",
        "course_concepts": [
            "sets and set operations",
            "bubble sort visualization",
            "quickselect selection algorithm",
            "stacks and queues",
            "hash tables",
            "binary search trees",
            "graphs and traversal",
            "performance analysis and trade-offs",
        ],
        "data_structures": [
            "Stack",
            "Queue",
            "Deque",
            "Linked List",
            "Hash Table",
            "Priority Queue",
            "Binary Search Tree",
            "Graph",
        ],
        "algorithms": [
            "Bubble Sort",
            "Selection Sort",
            "Insertion Sort",
            "Merge Sort",
            "Linear Search",
            "Binary Search",
            "Quickselect",
            "Dijkstra shortest path",
            "BFS/DFS traversal",
        ],
        "deliverables": [
            "interactive Python implementations",
            "web-based portfolio dashboard",
            "step-by-step visualization",
            "performance analysis report",
            "usage documentation",
        ],
    }
