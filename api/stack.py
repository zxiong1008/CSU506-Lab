from __future__ import annotations

from typing import Generic, Iterable, TypeVar

Value = TypeVar("Value")


class Stack(Generic[Value]):
    """Last-in, first-out collection backed by a Python list."""

    def __init__(self, values: Iterable[Value] | None = None) -> None:
        self._items = list(values or [])

    def push(self, value: Value) -> None:
        self._items.append(value)

    def pop(self) -> Value:
        if self.isEmpty():
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self) -> Value:
        if self.isEmpty():
            raise IndexError("peek from empty stack")
        return self._items[-1]

    def isEmpty(self) -> bool:
        return not self._items

    def display(self) -> list[Value]:
        return list(reversed(self._items))

    def __len__(self) -> int:
        return len(self._items)
