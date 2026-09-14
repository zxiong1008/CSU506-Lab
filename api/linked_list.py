from __future__ import annotations

from dataclasses import dataclass
from typing import Generic, Iterable, TypeVar

Value = TypeVar("Value")


@dataclass
class Node(Generic[Value]):
    value: Value
    next: Node[Value] | None = None


class LinkedList(Generic[Value]):
    """Singly linked list with head insertion and first-match deletion."""

    def __init__(self, values: Iterable[Value] | None = None) -> None:
        self.head: Node[Value] | None = None
        self._size = 0
        for value in reversed(list(values or [])):
            self.insert(value)

    def insert(self, value: Value) -> None:
        self.head = Node(value, self.head)
        self._size += 1

    def delete(self, value: Value) -> bool:
        previous: Node[Value] | None = None
        current = self.head
        while current is not None:
            if current.value == value:
                if previous is None:
                    self.head = current.next
                else:
                    previous.next = current.next
                self._size -= 1
                return True
            previous, current = current, current.next
        return False

    def search(self, value: Value) -> bool:
        current = self.head
        while current is not None:
            if current.value == value:
                return True
            current = current.next
        return False

    def display(self) -> list[Value]:
        values: list[Value] = []
        current = self.head
        while current is not None:
            values.append(current.value)
            current = current.next
        return values

    def __len__(self) -> int:
        return self._size
