# Perfect Hashing vs. Non-Perfect Hashing

A hash function maps a key to an index in the table. If the mapping is ideal, each key gets a unique slot, and the table is called a perfect hash table. In a perfect hash, there are no collisions, and search is very fast because each lookup lands exactly on the desired location. Perfect hashing is possible when the set of keys is known in advance and the table is sized to avoid collisions.

For example, suppose the set of keys is known to be `{"A", "B", "C", "D"}` and the table has four slots. A simple arrangement can assign each string to a different index, such as `A -> 0`, `B -> 1`, `C -> 2`, and `D -> 3`. In that case, the table is a perfect hash because each key maps to a unique slot. This is useful in static environments where the data does not change often.

In contrast, a non-perfect hash function allows collisions. This is the common case for dynamic data sets, where the keys are not known ahead of time and the table must handle insertion and deletion as the program runs. A non-perfect hash function may map two different keys to the same table index, which requires a collision resolution strategy such as chaining or linear probing. The current implementation uses chaining, which stores multiple entries in the same bucket when they hash to the same location.

Example of a non-perfect hash:

- `"apple"` might map to slot 4
- `"papel"` might also map to slot 4
- `"orange"` might map to slot 9

Because slot 4 is shared, the bucket for slot 4 stores both records. Search still works because the program checks the bucket contents rather than assuming each slot holds only one item. This makes the table flexible and practical for real-world applications.

The key tradeoff is between simplicity and performance. A perfect hash can provide extremely fast retrieval and no collision resolution overhead, but it requires knowledge of the full key set in advance. A non-perfect hash is easier to maintain and works well for changing datasets, but it requires additional logic to resolve collisions and may require resizing when the table becomes crowded.

A typical application of perfect hashing is a read-only lookup table for known identifiers, such as configuration names or command words. Non-perfect hashing is used in ordinary dictionaries, caches, symbol tables, and many database and language runtime features that must support dynamic updates.

This project uses non-perfect hashing intentionally, because it demonstrates the standard design used in real software: a simple hash function, collision resolution by chaining, and automatic resizing when the table becomes full. The result is a working and easy-to-understand implementation that matches the expected behavior for a general-purpose hash table.
