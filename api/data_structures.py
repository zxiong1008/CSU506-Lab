"""Linear data structures and algorithms demonstrating their use cases."""

from __future__ import annotations

from dataclasses import dataclass
from time import perf_counter
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
        return len(self._items) == 0

    def __len__(self) -> int:
        return len(self._items)


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
        return len(self._items) == 0

    def __len__(self) -> int:
        return len(self._items)


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
        return len(self._items) == 0

    def __len__(self) -> int:
        return len(self._items)


@dataclass
class _Node(Generic[Value]):
    value: Value
    next: _Node[Value] | None = None


class LinkedList(Generic[Value]):
    """Singly linked list supporting insertion, deletion, and search."""

    def __init__(self, values: Iterable[Value] | None = None) -> None:
        self.head: _Node[Value] | None = None
        self._size = 0
        for value in values or []:
            self.insert(value)

    def insert(self, value: Value) -> None:
        """Insert a value at the head in O(1) time."""
        self.head = _Node(value, self.head)
        self._size += 1

    def delete(self, value: Value) -> bool:
        """Delete the first matching value and report whether it existed."""
        previous: _Node[Value] | None = None
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


def are_delimiters_balanced(expression: str) -> bool:
    """Use a stack to validate nested parentheses, brackets, and braces."""
    pairs = {")": "(", "]": "[", "}": "{",
    }
    opening = set(pairs.values())
    stack: Stack[str] = Stack()
    for character in expression:
        if character in opening:
            stack.push(character)
        elif character in pairs:
            if stack.isEmpty() or stack.pop() != pairs[character]:
                return False
    return stack.isEmpty()


def round_robin_schedule(tasks: Iterable[Value], rounds: int) -> list[Value]:
    """Return the task order for a round-robin scheduler."""
    if rounds < 0:
        raise ValueError("rounds must be non-negative")
    queue: Queue[Value] = Queue(tasks)
    completed: list[Value] = []
    for _ in range(rounds):
        if queue.isEmpty():
            break
        task = queue.dequeue()
        completed.append(task)
        queue.enqueue(task)
    return completed


def is_palindrome(text: str) -> bool:
    """Compare both ends of a deque to test a normalized palindrome."""
    characters = [character.lower() for character in text if character.isalnum()]
    deque: Deque[str] = Deque(characters)
    while len(deque) > 1:
        if deque.removeFront() != deque.removeRear():
            return False
    return True


def remove_duplicates(values: Iterable[Value]) -> list[Value]:
    """Use a linked list to preserve first-seen order while removing repeats."""
    result: LinkedList[Value] = LinkedList()
    seen: set[Value] = set()
    for value in values:
        if value not in seen:
            seen.add(value)
            result.insert(value)
    return list(reversed(result.display()))


def benchmark_operations(size: int = 1000) -> dict[str, dict[str, float | str]]:
    """Measure representative operations and return milliseconds plus complexity."""
    if size < 1:
        raise ValueError("size must be positive")

    measurements: dict[str, dict[str, float | str]] = {}
    stack = Stack(range(size))
    started = perf_counter()
    stack.push(size)
    stack.peek()
    stack.pop()
    measurements["Stack push/peek/pop"] = {"timeMs": (perf_counter() - started) * 1000, "complexity": "O(1)"}

    queue = Queue(range(size))
    started = perf_counter()
    queue.enqueue(size)
    queue.front()
    queue.dequeue()
    measurements["Queue enqueue/front/dequeue"] = {"timeMs": (perf_counter() - started) * 1000, "complexity": "O(n) dequeue"}

    deque = Deque(range(size))
    started = perf_counter()
    deque.addFront(size)
    deque.removeRear()
    deque.removeFront()
    measurements["Deque mixed operations"] = {"timeMs": (perf_counter() - started) * 1000, "complexity": "O(n) front"}

    linked_list = LinkedList(range(size))
    started = perf_counter()
    linked_list.search(size // 2)
    linked_list.delete(size // 2)
    measurements["LinkedList search/delete"] = {"timeMs": (perf_counter() - started) * 1000, "complexity": "O(n)"}
    return measurements