# Project 6 Evaluation: When Tree Data Structures Are Beneficial

## Overview

Trees organize data as parent-child relationships rather than as a flat sequence. A binary search tree (BST) adds an ordering rule: keys smaller than a node are placed to its left, and larger keys to its right. This structure is valuable when a program needs to find values while also preserving their order. In-order traversal visits BST keys in ascending order, while pre-order and post-order traversals expose different useful ways to process a hierarchy.

The most important qualification is that a plain BST's performance depends on its shape. If insertions produce a reasonably balanced tree, its height is proportional to $\log_2(n)$, so search, insertion, and deletion take $O(\log n)$ time. If values arrive in sorted order, an unbalanced BST can become a chain with height close to $n$; those operations then take $O(n)$. Balance detection is therefore not just a visual feature. It indicates whether the tree's structure is likely to support the performance people often associate with search trees. Production implementations commonly use AVL or red-black trees to rebalance automatically and keep the height logarithmic.

## Cases Where Trees Are a Strong Choice

Trees are especially beneficial when applications need both lookup and ordered operations. A tree can find a key and can also provide its predecessor, successor, minimum, maximum, or a range of keys without sorting the whole collection after each change. An in-order walk of a BST produces sorted values in $O(n)$ time. This makes tree structures a natural basis for ordered maps, in-memory indexes, autocomplete ranges, event timelines, and directory-like hierarchies.

The tree-backed Map in this project illustrates the ordered-map case. It stores keys in a BST and values separately, so searching and updating are guided by the key order, while iteration returns entries in sorted-key order. The keys must be mutually comparable. Values can be different types because the comparison rule applies to keys, not values. This separation is important: trying to put arbitrary mixed types directly into one BST is usually invalid because values such as strings and numbers do not share a natural ordering in many languages.

Trees also model relationships that are not simply linear. Syntax trees represent the structure of expressions; decision trees organize choices; file systems and organizational charts represent containment; and heaps represent priority relationships. The exact tree variant should match the operation: a BST is designed for ordered lookup, whereas a heap is designed to expose the minimum or maximum efficiently and does not provide general sorted search.

## Cases Where Another Structure Is Better

If a program only needs exact-key lookup and does not need sorted iteration or range queries, a hash map is often a better default. Hash maps typically provide average $O(1)$ lookup, insertion, and deletion, although they require hashing and do not inherently return keys in sorted order. If the collection is small or rarely changes, a list may be simpler and use less structural machinery; its $O(n)$ lookup can be entirely acceptable. If data is static and can be sorted once, a sorted array supports $O(\log n)$ binary search and has compact memory layout, often improving cache behavior compared with pointer-heavy trees.

A plain BST should also be avoided where untrusted or adversarial input can force a pathological shape, or where predictable worst-case timing is essential. A self-balancing tree, B-tree, or database index is more appropriate in those environments. B-trees are especially useful for storage systems because their high branching factor reduces disk and page reads. Tree nodes require links and allocation, and pointer traversal can be slower in practice than a contiguous array even when asymptotic complexity looks favorable.

## Interpreting the Performance Comparison

The interactive benchmark compares successful lookups for a tree-backed map and a list-backed map at increasing sizes. The list search targets the final key, giving it the worst-case scan of $n$ entries. The BST keys are inserted in a deterministic shuffled order to avoid the obviously degenerate result created by inserting already-sorted keys. The benchmark reports measured elapsed time, tree height, and list comparisons alongside complexity descriptions.

Measurements are evidence about this implementation and this run, not a universal ranking. Timer resolution, interpreter overhead, memory layout, and key position can change small timings. For this reason, the number of comparisons and growth rates are more informative than a single speedup figure. The list may win on a very small input because it has low overhead. As the dataset grows, the list must still inspect linearly many entries, while a balanced tree examines a path related to its height. A plain BST does not guarantee that advantage unless its shape stays favorable.

## Conclusion

Choose trees when hierarchical relationships, sorted iteration, predecessor/successor operations, or range queries are central requirements. Use a balanced search tree for dynamic ordered collections, a hash map for unordered exact lookup, a list for simple small collections, and a sorted array for compact mostly-static data. Always evaluate the operation mix, update frequency, data shape, memory costs, and worst-case requirements. Trees are most beneficial not because they are universally faster, but because they combine dynamic updates with meaningful order and hierarchy when those properties solve the actual problem.
