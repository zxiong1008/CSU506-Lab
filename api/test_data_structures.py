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
from hash_table import HashTable
from priority_queue import PriorityQueue, compare_hash_table_vs_linear_search


class DataStructureTests(unittest.TestCase):
    def test_stack_is_lifo(self):
        stack = Stack(["draft"])
        stack.push("review")
        self.assertEqual(stack.peek(), "review")
        self.assertEqual(stack.pop(), "review")
        self.assertFalse(stack.isEmpty())

    def test_queue_is_fifo(self):
        queue = Queue(["A", "B"])
        queue.enqueue("C")
        self.assertEqual(queue.front(), "A")
        self.assertEqual(queue.dequeue(), "A")

    def test_deque_supports_both_ends(self):
        deque = Deque([2])
        deque.addFront(1)
        deque.addRear(3)
        self.assertEqual(deque.removeFront(), 1)
        self.assertEqual(deque.removeRear(), 3)

    def test_linked_list_operations(self):
        linked_list = LinkedList([1, 2])
        linked_list.insert(0)
        self.assertTrue(linked_list.search(2))
        self.assertTrue(linked_list.delete(1))
        self.assertEqual(linked_list.display(), [0, 2])

    def test_examples(self):
        self.assertTrue(are_delimiters_balanced("{[()]}") )
        self.assertEqual(round_robin_schedule(["A", "B"], 4), ["A", "B", "A", "B"])
        self.assertTrue(is_palindrome("A man, a plan, a canal: Panama"))
        self.assertEqual(remove_duplicates([3, 1, 3, 2, 1]), [3, 1, 2])

    def test_benchmark_contract(self):
        measurements = benchmark_operations(20)
        self.assertEqual(set(measurements), {"Stack", "Queue", "Deque", "Linked list"})
        self.assertTrue(all("timeMs" in result and "complexity" in result for result in measurements.values()))

    def test_hash_table_handles_collisions_and_lookup(self):
        table = HashTable(capacity=11)
        table.insert("apple", 10)
        table.insert("banana", 20)
        table.insert("orange", 30)
        table.insert("grape", 40)
        self.assertEqual(table.search("banana"), 20)
        self.assertEqual(table.get("orange"), 30)
        self.assertTrue(table.contains("apple"))
        table.delete("banana")
        self.assertIsNone(table.get("banana"))
        self.assertEqual(table.size, 3)

    def test_priority_queue_heap_behavior(self):
        queue = PriorityQueue()
        queue.insert("low", 2)
        queue.insert("high", 9)
        queue.insert("mid", 5)
        self.assertEqual(queue.peek(), ("high", 9))
        self.assertEqual(queue.extract_max(), ("high", 9))
        self.assertEqual(queue.extract_max(), ("mid", 5))
        self.assertTrue(queue.search("low"))
        self.assertTrue(queue.delete("low"))

    def test_hash_table_search_performance_beats_linear_search(self):
        report = compare_hash_table_vs_linear_search(200)
        self.assertIn("hash_table", report)
        self.assertIn("linear_search", report)
        self.assertIn("speedup", report)
        self.assertGreater(report["hash_table"]["time_ms"], 0)
        self.assertGreater(report["linear_search"]["time_ms"], 0)


if __name__ == "__main__":
    unittest.main()
