from __future__ import annotations

from typing import Generic, Iterable, TypeVar

Value = TypeVar("Value")


class Queue(Generic[Value]):
    """First-in, first-out collection backed by a Python list."""

    def __init__(self, values: Iterable[Value] | None = None) -> None:
        self._items = list(values or [])

    def enqueue(self, value: Value) -> None:
        self._items.append(value)

    def dequeue(self) -> Value:
        if self.isEmpty():
            raise IndexError("dequeue from empty queue")
        return self._items.pop(0)

    def front(self) -> Value:
        if self.isEmpty():
            raise IndexError("front from empty queue")
        return self._items[0]

    def isEmpty(self) -> bool:
        return not self._items

    def display(self) -> list[Value]:
        return list(self._items)

    def __len__(self) -> int:
        return len(self._items)
