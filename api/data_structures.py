"""Project 4 exports and problem-solving examples."""

from __future__ import annotations

from time import perf_counter
from typing import Iterable, TypeVar

from deque import Deque
from linked_list import LinkedList
from custom_queue import Queue
from stack import Stack

Value = TypeVar("Value")


def are_delimiters_balanced(expression: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"
    }
    stack: Stack[str] = Stack()
    for character in expression:
        if character in "([{":
            stack.push(character)
        elif character in pairs:
            if stack.isEmpty() or stack.pop() != pairs[character]:
                return False
    return stack.isEmpty()


def round_robin_schedule(tasks: Iterable[Value], rounds: int) -> list[Value]:
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
    characters = [character.lower() for character in text if character.isalnum()]
    deque: Deque[str] = Deque(characters)
    while len(deque) > 1:
        if deque.removeFront() != deque.removeRear():
            return False
    return True


def remove_duplicates(values: Iterable[Value]) -> list[Value]:
    result: LinkedList[Value] = LinkedList()
    seen: set[Value] = set()
    for value in values:
        if value not in seen:
            seen.add(value)
            result.insert(value)
    return list(reversed(result.display()))


def benchmark_operations(size: int = 1000) -> dict[str, dict[str, object]]:
    if size < 1:
        raise ValueError("size must be positive")
    measurements: dict[str, dict[str, object]] = {}
    cases = [
        ("Stack", [
            ("push", lambda: Stack(range(size)).push(size), "O(1)"),
            ("pop", lambda: Stack(range(size)).pop(), "O(1)"),
            ("peek", lambda: Stack(range(size)).peek(), "O(1)"),
            ("isEmpty", lambda: Stack(range(size)).isEmpty(), "O(1)"),
        ]),
        ("Queue", [
            ("enqueue", lambda: Queue(range(size)).enqueue(size), "O(1)"),
            ("dequeue", lambda: Queue(range(size)).dequeue(), "O(n)"),
            ("front", lambda: Queue(range(size)).front(), "O(1)"),
            ("isEmpty", lambda: Queue(range(size)).isEmpty(), "O(1)"),
        ]),
        ("Deque", [
            ("addFront", lambda: Deque(range(size)).addFront(size), "O(n)"),
            ("addRear", lambda: Deque(range(size)).addRear(size), "O(1)"),
            ("removeFront", lambda: Deque(range(size)).removeFront(), "O(n)"),
            ("removeRear", lambda: Deque(range(size)).removeRear(), "O(1)"),
            ("isEmpty", lambda: Deque(range(size)).isEmpty(), "O(1)"),
        ]),
        ("Linked list", [
            ("insert", lambda: LinkedList(range(size)).insert(size), "O(1)"),
            ("delete", lambda: LinkedList(range(size)).delete(size // 2), "O(n)"),
            ("search", lambda: LinkedList(range(size)).search(size // 2), "O(n)"),
            ("display", lambda: LinkedList(range(size)).display(), "O(n)"),
            ("isEmpty", lambda: LinkedList(range(size)).__len__() == 0, "O(1)"),
        ]),
    ]
    for name, operations in cases:
        operation_results: dict[str, dict[str, float | str]] = {}
        for operation_name, operation, complexity in operations:
            started = perf_counter()
            operation()
            operation_results[operation_name] = {
                "timeMs": (perf_counter() - started) * 1000,
                "complexity": complexity,
            }
        first_operation = next(iter(operation_results.values()))
        measurements[name] = {
            "timeMs": first_operation["timeMs"],
            "complexity": first_operation["complexity"],
            "operations": operation_results,
        }
    return measurements


__all__ = [
    "Deque", "LinkedList", "Queue", "Stack", "are_delimiters_balanced",
    "benchmark_operations", "is_palindrome", "remove_duplicates", "round_robin_schedule",
]
