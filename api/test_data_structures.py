#!/usr/bin/env python3
"""Executable tests and demonstrations for the linear data structures."""

import unittest

from data_structures import (
    Deque,
    LinkedList,
    Queue,
    Stack,
    are_delimiters_balanced,
    benchmark_operations,
    is_palindrome,
    remove_duplicates,
    round_robin_schedule,
)


class LinearDataStructureTests(unittest.TestCase):
    def test_stack_lifo_operations(self) -> None:
        stack = Stack([1, 2])
        stack.push(3)
        self.assertEqual(stack.peek(), 3)
        self.assertEqual(stack.pop(), 3)
        self.assertEqual(stack.pop(), 2)
        self.assertFalse(stack.isEmpty())

    def test_queue_fifo_operations(self) -> None:
        queue = Queue([1, 2])
        queue.enqueue(3)
        self.assertEqual(queue.front(), 1)
        self.assertEqual([queue.dequeue(), queue.dequeue(), queue.dequeue()], [1, 2, 3])
        self.assertTrue(queue.isEmpty())

    def test_deque_both_ends(self) -> None:
        deque = Deque[int]()
        deque.addRear(2)
        deque.addFront(1)
        deque.addRear(3)
        self.assertEqual(deque.removeFront(), 1)
        self.assertEqual(deque.removeRear(), 3)
        self.assertEqual(deque.removeFront(), 2)
        self.assertTrue(deque.isEmpty())

    def test_linked_list_operations(self) -> None:
        linked_list = LinkedList([1, 2, 3])
        self.assertEqual(linked_list.display(), [3, 2, 1])
        self.assertTrue(linked_list.search(2))
        self.assertTrue(linked_list.delete(2))
        self.assertFalse(linked_list.search(2))
        self.assertFalse(linked_list.delete(99))

    def test_empty_removals_are_explicit(self) -> None:
        for structure, operation in (
            (Stack(), "pop"),
            (Queue(), "dequeue"),
            (Deque(), "removeFront"),
        ):
            with self.assertRaises(IndexError):
                getattr(structure, operation)()

    def test_problem_solving_examples(self) -> None:
        self.assertTrue(are_delimiters_balanced("{[a + b] * (c - d)}"))
        self.assertFalse(are_delimiters_balanced("([)]"))
        self.assertEqual(round_robin_schedule(["A", "B", "C"], 5), ["A", "B", "C", "A", "B"])
        self.assertTrue(is_palindrome("A man, a plan, a canal: Panama"))
        self.assertFalse(is_palindrome("CSU 506"))
        self.assertEqual(remove_duplicates([3, 1, 3, 2, 1]), [3, 1, 2])

    def test_benchmark_contract(self) -> None:
        results = benchmark_operations(20)
        self.assertEqual(len(results), 4)
        for result in results.values():
            self.assertGreaterEqual(result["timeMs"], 0)
            self.assertIn("complexity", result)


if __name__ == "__main__":
    unittest.main(verbosity=2)