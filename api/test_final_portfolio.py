import unittest

from final_portfolio import Set, bubble_sort_with_steps, quickselect


class FinalPortfolioTests(unittest.TestCase):
    def test_bubble_sort_visualization(self):
        values = [5, 1, 4, 2, 8]
        sorted_values, steps = bubble_sort_with_steps(values)

        self.assertEqual(sorted_values, [1, 2, 4, 5, 8])
        self.assertGreater(len(steps), 0)
        self.assertIn("array", steps[0])
        self.assertIn("pass", steps[0])

    def test_quickselect_kth_smallest(self):
        values = [7, 10, 4, 3, 20, 15, 8]
        self.assertEqual(quickselect(values, 1), 3)
        self.assertEqual(quickselect(values, 3), 7)
        self.assertEqual(quickselect(values, 7), 20)

    def test_set_operations(self):
        left = Set([1, 2, 3, 4])
        right = Set([3, 4, 5, 6])

        self.assertEqual(left.union(right), Set([1, 2, 3, 4, 5, 6]))
        self.assertEqual(left.intersection(right), Set([3, 4]))
        self.assertEqual(left.difference(right), Set([1, 2]))
        self.assertEqual(left.symmetric_difference(right), Set([1, 2, 5, 6]))


if __name__ == "__main__":
    unittest.main()
