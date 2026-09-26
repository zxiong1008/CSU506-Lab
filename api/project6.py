"""Project 6 tree demos and reproducible benchmark helpers."""

from __future__ import annotations

from random import Random
from time import perf_counter
from typing import Any

from binary_search_tree import BinarySearchTree
from tree_map import TreeMap


def demo_data() -> dict[str, Any]:
    """Return 50 tree keys and 50 map entries with heterogeneous value types."""
    random = Random(506)
    tree_values = random.sample(range(10, 1000), 50)
    value_samples: list[Any] = [
        98, "algorithm", True, 3.14, None, {"grade": "A"}, ["tree", "map"], False,
        "balanced", 0,
    ]
    entries = [
        {"key": f"student-{index + 1:02d}", "value": value_samples[index % len(value_samples)]}
        for index in range(50)
    ]
    random.shuffle(entries)
    return {"treeValues": tree_values, "mapEntries": entries}


def tree_snapshot(tree: BinarySearchTree[int]) -> dict[str, Any]:
    return {
        "root": tree.to_nested_dict(),
        "size": len(tree),
        "height": tree.height(),
        "balanced": tree.is_balanced(),
        "minimum": tree.minimum(),
        "maximum": tree.maximum(),
        "inorder": tree.inorder(),
        "preorder": tree.preorder(),
        "postorder": tree.postorder(),
    }


def map_snapshot(tree_map: TreeMap[str, Any]) -> dict[str, Any]:
    return {
        "root": tree_map.tree.to_nested_dict(),
        "size": len(tree_map),
        "height": tree_map.tree.height(),
        "balanced": tree_map.tree.is_balanced(),
        "minimum": tree_map.tree.minimum(),
        "maximum": tree_map.tree.maximum(),
        "entries": [{"key": key, "value": value} for key, value in tree_map.items()],
    }


def compare_tree_map_vs_list(size: int = 1000, searches: int = 100) -> dict[str, Any]:
    """Measure repeated successful lookups in a BST-backed and list-backed map."""
    if size < 2 or size > 10000:
        raise ValueError("size must be between 2 and 10000")
    if searches < 1 or searches > 10000:
        raise ValueError("searches must be between 1 and 10000")

    entries = [(index, f"value-{index}") for index in range(size)]
    list_map = entries[:]
    Random(size).shuffle(entries)
    tree_map = TreeMap(entries)
    target = size - 1

    started = perf_counter()
    for _ in range(searches):
        tree_map.get(target)
    tree_time_ms = (perf_counter() - started) * 1000

    started = perf_counter()
    for _ in range(searches):
        next((value for key, value in list_map if key == target), None)
    list_time_ms = (perf_counter() - started) * 1000

    return {
        "size": size,
        "searches": searches,
        "target": target,
        "treeMapTimeMs": tree_time_ms,
        "listMapTimeMs": list_time_ms,
        "treeMapComplexity": "O(h), O(log n) when balanced; O(n) worst case",
        "listMapComplexity": "O(n)",
        "listComparisonsPerSearch": size,
        "treeHeight": tree_map.tree.height(),
        "speedup": list_time_ms / tree_time_ms if tree_time_ms > 0 else None,
    }
