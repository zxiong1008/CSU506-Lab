import unittest

from binary_search_tree import BinarySearchTree
from project6 import compare_tree_map_vs_list, demo_data
from tree_map import TreeMap


class BinarySearchTreeTests(unittest.TestCase):
    def test_insert_search_traversals_and_extrema(self):
        tree = BinarySearchTree([8, 3, 10, 1, 6, 14, 4, 7, 13])
        self.assertTrue(tree.search(6))
        self.assertFalse(tree.search(12))
        self.assertEqual(tree.inorder(), [1, 3, 4, 6, 7, 8, 10, 13, 14])
        self.assertEqual(tree.preorder(), [8, 3, 1, 6, 4, 7, 10, 14, 13])
        self.assertEqual(tree.postorder(), [1, 4, 7, 6, 3, 13, 14, 10, 8])
        self.assertEqual(tree.minimum(), 1)
        self.assertEqual(tree.maximum(), 14)
        self.assertFalse(tree.insert(6))

    def test_delete_leaf_one_child_two_children_and_missing(self):
        tree = BinarySearchTree([8, 3, 10, 1, 6, 14, 4, 7, 13])
        self.assertTrue(tree.delete(1))
        self.assertTrue(tree.delete(14))
        self.assertTrue(tree.delete(8))
        self.assertFalse(tree.delete(404))
        self.assertEqual(tree.inorder(), [3, 4, 6, 7, 10, 13])
        self.assertEqual(len(tree), 6)

    def test_empty_and_balance_detection(self):
        empty = BinarySearchTree()
        self.assertIsNone(empty.minimum())
        self.assertIsNone(empty.maximum())
        self.assertTrue(empty.is_balanced())
        self.assertEqual(empty.height(), 0)
        self.assertTrue(BinarySearchTree([4, 2, 6, 1, 3, 5, 7]).is_balanced())
        self.assertFalse(BinarySearchTree([1, 2, 3, 4, 5]).is_balanced())

    def test_fifty_distinct_data_items(self):
        values = [((index * 37) % 101) for index in range(50)]
        tree = BinarySearchTree(values)
        self.assertEqual(len(tree), 50)
        self.assertEqual(tree.inorder(), sorted(set(values)))
        self.assertEqual(len(tree.preorder()), 50)
        self.assertEqual(len(tree.postorder()), 50)


class TreeMapTests(unittest.TestCase):
    def test_tree_map_stores_mixed_value_types(self):
        entries = [
            ("text", "hello"),
            ("number", 42),
            ("flag", True),
            ("array", [1, 2]),
            ("object", {"grade": "A"}),
            ("nothing", None),
        ]
        tree_map = TreeMap(entries)
        self.assertEqual(tree_map.get("number"), 42)
        self.assertEqual(tree_map.get("object"), {"grade": "A"})
        self.assertTrue(tree_map.contains("nothing"))
        self.assertIsNone(tree_map.get("nothing"))
        self.assertEqual([key for key, _ in tree_map.items()], sorted(key for key, _ in entries))
        self.assertEqual(tree_map.put("number", 99), 42)
        self.assertEqual(tree_map.get("number"), 99)
        self.assertTrue(tree_map.delete("text"))
        self.assertFalse(tree_map.contains("text"))
        self.assertFalse(tree_map.delete("missing"))

    def test_seed_data_has_fifty_heterogeneous_values(self):
        demo = demo_data()
        self.assertEqual(len(demo["treeValues"]), 50)
        self.assertEqual(len(demo["mapEntries"]), 50)
        value_types = {type(entry["value"]) for entry in demo["mapEntries"]}
        self.assertGreaterEqual(len(value_types), 5)

    def test_lookup_benchmark_contract(self):
        result = compare_tree_map_vs_list(size=50, searches=5)
        self.assertEqual(result["size"], 50)
        self.assertEqual(result["listComparisonsPerSearch"], 50)
        self.assertGreater(result["treeMapTimeMs"], 0)
        self.assertGreater(result["listMapTimeMs"], 0)


if __name__ == "__main__":
    unittest.main()
