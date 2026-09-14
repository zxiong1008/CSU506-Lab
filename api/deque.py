from __future__ import annotations

from typing import Generic, Iterable, TypeVar

Value = TypeVar("Value")


class Deque(Generic[Value]):
    """Double-ended queue backed by a Python list."""

    def __init__(self, values: Iterable[Value] | None = None) -> None:
        self._items = list(values or [])

    def addFront(self, value: Value) -> None:
        self._items.insert(0, value)

    def addRear(self, value: Value) -> None:
        self._items.append(value)

    def removeFront(self) -> Value:
        if self.isEmpty():
            raise IndexError("removeFront from empty deque")
        return self._items.pop(0)

    def removeRear(self) -> Value:
        if self.isEmpty():
            raise IndexError("removeRear from empty deque")
        return self._items.pop()

    def isEmpty(self) -> bool:
        return not self._items

    def display(self) -> list[Value]:
        return list(self._items)

    def __len__(self) -> int:
        return len(self._items)
