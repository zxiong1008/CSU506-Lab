# Project 6: BST and Tree-backed Map

## Files

- `binary_search_tree.py` implements a generic BST with duplicate-safe insert, search, delete (including two-child successor replacement), all three depth-first traversals, minimum/maximum, height, balance detection, and nested serialization.
- `tree_map.py` composes the BST with value storage to implement `put`, `get`, `contains`, `delete`, and sorted `items`.
- `project6.py` creates a repeatable 50-key / 50-entry heterogeneous demonstration and benchmarks tree-map lookup against a list-backed map.
- `test_binary_search_tree.py` tests core operations, edge cases, mixed value types, 50 unique keys, and benchmark output.
- `../PROJECT_6_EVALUATION.md` provides the written evaluation of tree use cases and trade-offs.

## API routes

- `GET /api/project6/health` reports API health.
- `GET /api/project6/demo` returns 50 numeric BST keys and 50 string-keyed map entries. Map values include strings, numbers, booleans, arrays, objects, and null.
- `POST /api/project6/tree/operation` accepts `{ "values": [8, 3, 10], "operation": "insert|search|delete", "value": 6 }` and returns the operation result, tree visualization data, size, height, balance status, min/max, and traversal orders.
- `POST /api/project6/map/operation` accepts `{ "entries": [{"key":"student-01","value":42}], "operation":"insert|search|delete", "key":"student-02", "value":"A" }` and returns the sorted map contents and tree metrics.
- `GET /api/project6/benchmarks` returns measured lookup comparisons for 50, 200, and 1,000 entries. Optional `searches` controls repeated lookup count (1–10,000).

Operations are stateless at the API layer: clients send the current collection with each operation. This makes the interactive demo reproducible and keeps user data out of server-side global state.

## Running and testing

Run the API from the repository root with Docker Compose, or run the Python API from the `api` directory after installing `requirements.txt`. Run the focused and existing data-structure tests from that same directory with:

```text
python -m unittest test_binary_search_tree.py test_data_structures.py
```

Run the frontend from `csu506-app` with `npm run dev`, then select Project 06 → View project → Open working tool. The tree tab starts with 50 keys; the map tab starts with 50 mixed-type values. Use Insert/Search/Delete or Put/Get/Delete to see the displayed tree, metrics, traversals, and entries update. Select Run benchmarks to compare lookup scaling.

## Example traversal output

For insertion order `[8, 3, 10, 1, 6, 14, 4, 7, 13]`:

- In-order: `[1, 3, 4, 6, 7, 8, 10, 13, 14]`
- Pre-order: `[8, 3, 1, 6, 4, 7, 10, 14, 13]`
- Post-order: `[1, 4, 7, 6, 3, 13, 14, 10, 8]`

In-order output is sorted because the BST invariant places smaller keys left and larger keys right. Pre-order visits the root first; post-order visits it last.
