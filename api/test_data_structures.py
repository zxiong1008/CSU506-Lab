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


if __name__ == "__main__":
    unittest.main()
