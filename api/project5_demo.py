"""Project 5 demo script for hash table and priority queue operations."""

from __future__ import annotations

from hash_table import HashTable, compare_hash_table_vs_linear_search
from priority_queue import PriorityQueue


def demo_hash_table() -> None:
    table = HashTable(capacity=11)
    records = {
        "A1": 110,
        "B2": 220,
        "C3": 330,
        "D4": 440,
        "E5": 550,
        "F6": 660,
    }

    for key, value in records.items():
        table.insert(key, value)

    print("Hash table demo:")
    print(f"  Search A1 -> {table.search('A1')}")
    print(f"  Contains B2 -> {table.contains('B2')}")
    table.delete("C3")
    print(f"  After deleting C3, search C3 -> {table.search('C3')}")
    print(f"  Current size -> {table.size}")
    print()


def demo_priority_queue() -> None:
    queue = PriorityQueue()
    queue.insert("task-1", 10)
    queue.insert("task-2", 25)
    queue.insert("task-3", 18)
    queue.insert("task-4", 30)

    print("Priority queue demo:")
    print(f"  Peek -> {queue.peek()}")
    print(f"  Extract max -> {queue.extract_max()}")
    print(f"  Extract max -> {queue.extract_max()}")
    print(f"  Search task-2 -> {queue.search('task-2')}")
    print(f"  Delete task-3 -> {queue.delete('task-3')}")
    print(f"  Extract min -> {queue.extract_min()}")
    print()


def demo_performance() -> None:
    report = compare_hash_table_vs_linear_search(200)
    print("Performance comparison (200 lookups):")
    print(f"  Hash table time: {report['hash_table']['time_ms']} ms")
    print(f"  Linear search time: {report['linear_search']['time_ms']} ms")
    print(f"  Speedup: {report['speedup']}x")


if __name__ == "__main__":
    demo_hash_table()
    demo_priority_queue()
    demo_performance()
