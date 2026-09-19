# Hash Table and Priority Queue Analysis

Hash tables are a central idea in data structures because they provide near-constant-time access to information when implemented well. A hash table stores data using a hash function that maps a key to an index in an array-like structure known as a bucket table. The goal is to transform a key into a compact integer and then use that integer to locate the value without scanning every entry in the collection. In this implementation, a simple weighted hash function is used for string keys:

`hash(key) = sum((position + 1) * ord(character)) mod capacity`

This method is easy to explain and easy to test. It spreads keys across the table using the letters’ ASCII values and the position of each character. If the table size is 17 or 31, the modulo operation keeps the result inside the valid range. The formula is intentionally simple, which helps maintain readability while still producing a useful distribution.

The chosen collision handling method is chaining. Each bucket contains a dictionary, so if two different keys hash to the same index, both are stored at that bucket. This prevents data loss and keeps the implementation robust. For example, if the keys `"apple"` and `"papel"` happen to produce the same index, both key-value pairs remain in the same bucket. Search and deletion still work by checking the bucket’s dictionary directly. Chaining is a practical choice because it keeps the code straightforward and makes the behavior easy to reason about.

The system also includes a binary heap-based priority queue. A binary heap is a complete binary tree stored as a list. The heap property ensures that each parent contains a value greater than or equal to its children in a max-heap. This means the root always represents the highest-priority item. Inserting a new item moves it upward until the heap property is restored. Removing the root extracts the maximum priority value and rebalances the heap from the top.

Priority queues are useful in scheduling, event simulation, and graph algorithms such as Dijkstra’s algorithm. In this implementation, each item is paired with a numeric priority, and the heap organizes them so that the most urgent item is always available at the front. The queue also supports search and delete operations, which are useful in demo work and testing.

The performance comparison is designed to highlight the major difference between hash table lookup and linear search. A linear search examines every element in the data set until it finds a match. That means a list of size `n` requires `O(n)` time in the worst case. By contrast, a hash table uses the hash function to jump directly to the correct bucket, reducing average lookup to `O(1)`.

The code includes a benchmark helper that creates a dataset of 200 entries, searches for repeated targets in both structures, and reports elapsed time in milliseconds. The result is consistently faster for the hash table because the lookup does not need to traverse the entire list. This matches the theoretical expectation and demonstrates why a hash table is preferred when fast lookup is needed.

From a design perspective, the key tradeoff is space versus performance. A hash table uses extra memory to store bucket arrays and may resize when it becomes crowded. The implementation includes a load factor check so that the table grows when it becomes too full. This reduces the risk of long chains and keeps performance close to constant time. The priority queue, by comparison, stores a complete binary tree in a list and provides efficient access to the highest-priority item without the need for a full sort operation.

Together, these structures illustrate two essential ideas in algorithm design: hashing for direct access and heaps for ordered access. The hash table solves the problem of quick membership and value lookup, while the priority queue solves the problem of selecting the most important item efficiently. Both are foundational tools in modern software engineering and algorithm analysis.
