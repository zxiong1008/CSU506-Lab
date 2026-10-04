# Project 7 Analysis: Adjacency Matrix vs. Adjacency List

## 1. A graph is a model, not a single storage format

A graph represents entities as vertices and relationships as edges. In this project, vertices are labels and edges carry non-negative numeric weights. The example network can stand for places joined by roads, with the weight representing distance, time, or another additive cost. The same information can be stored as a matrix or as a list of neighbors. Choosing between them affects memory, editing, lookup, and traversal costs, even though both representations describe the same graph.

Let $V$ be the number of vertices, $E$ the number of edges, and $d(v)$ the degree of vertex $v$. The implementation supports directed and undirected graphs. In an undirected graph each connection is reflected in both directions; in a directed graph an edge from $u$ to $v$ does not imply an edge from $v$ to $u$. The matrix uses `null` to mean no connection, so an edge whose weight is zero remains distinguishable from an absent edge.

## 2. Adjacency matrix

A matrix is a $V \times V$ table. The cell at row $u$, column $v$ records whether the edge exists and, if it does, its weight. For an undirected graph the matrix is symmetric. The implementation keeps an ordered vertex array beside the matrix so labels can be mapped to row and column indexes.

### Costs and strengths

The matrix uses $O(V^2)$ storage regardless of how many edges exist. Adding an edge and checking whether a specific edge exists are $O(1)$ after locating the endpoint indexes. Adding a vertex requires extending every row and adding a row, so it takes $O(V)$. Removing a vertex deletes one row and one column and takes $O(V^2)$ with the current Python list representation. Enumerating all neighbors of one vertex scans a row and takes $O(V)$.

The matrix makes a strong fit when a graph is dense: when a substantial fraction of possible vertex pairs are connected, the cells are not mostly empty, and the constant-time edge test is useful. It is also attractive when algorithms repeatedly ask whether particular pairs are connected or need a simple, predictable layout. Matrix-based Dijkstra in this project selects the unsettled vertex by scanning the remaining vertices and scans matrix rows for relaxations, giving $O(V^2)$ time and $O(V)$ auxiliary distance state (not counting the matrix and returned trace).

Its weakness is that space is paid for every possible pair. If a city network has thousands of locations but only a few roads per location, almost every cell contains `null`. Adding or removing vertices can also require substantial array movement. Traversing a sparse matrix wastes time examining absent edges.

## 3. Adjacency list

A list representation stores an entry for each vertex and only its actual neighbors. This implementation uses a dictionary of neighbor dictionaries, which supports convenient label-based access and stores edge weights with the neighbor labels. In an undirected graph each logical edge appears in two neighbor dictionaries; the API and display layer show it once. Directed edges appear only in their source's list.

### Costs and strengths

The structure uses $O(V + E)$ space (with the constant factor for undirected edges and Python dictionary overhead understood). Adding a vertex is $O(1)$ average. Adding an edge and checking for a particular neighbor are $O(1)$ average with the dictionaries used here. Removing a vertex deletes its own neighbor dictionary and checks the remaining dictionaries to remove incoming references, so it takes $O(V + E)$ in this implementation. Iterating a vertex's neighbors takes $O(d(v))$, which avoids scanning non-edges.

This makes adjacency lists a natural default for sparse graphs and for workloads dominated by BFS, DFS, or algorithms that need to inspect each edge. BFS and DFS take $O(V + E)$ over the reachable component when the traversal uses a queue/stack and a visited set. The Project 7 trace captures frontier and visited snapshots to make the process visible; copying those snapshots adds output-sensitive overhead beyond the core traversal. Heap-based Dijkstra in the list implementation takes $O((V + E) \log V)$ under the usual binary-heap analysis (the implementation uses lazy duplicate heap entries) and requires $O(V + E)$ graph storage plus $O(V)$ distances/predecessors and heap state.

A list's main trade-off is edge lookup: locating a neighbor in an ordinary sequence costs $O(d(v))$. The project uses dictionaries, so lookup by neighbor label is average $O(1)$, but a matrix still provides a simpler constant-time indexed test. Dictionaries also have larger per-entry overhead than a compact numeric matrix. For a very dense graph, the list can use as much or more practical memory despite its better asymptotic form.

## 4. Side-by-side comparison

| Operation | Adjacency matrix | Adjacency list in this project |
|---|---:|---:|
| Space | $O(V^2)$ | $O(V + E)$ |
| Add vertex | $O(V)$ | $O(1)$ average |
| Add edge | $O(1)$ after index lookup | $O(1)$ average |
| Remove vertex | $O(V^2)$ | $O(V + E)$ |
| Test edge | $O(1)$ after index lookup | $O(1)$ average dictionary lookup |
| Enumerate neighbors | $O(V)$ | $O(d(v))$ |
| BFS / DFS core | $O(V^2)$ | $O(V + E)$ |
| Dijkstra variant here | $O(V^2)$ | $O((V + E) \log V)$ |

These bounds describe the representation and algorithm operations; mapping labels to matrix indexes also requires lookup in the ordered vertex array in this educational implementation. A production matrix graph might maintain a label-to-index dictionary to make that mapping average $O(1)$.

## 5. Algorithm behavior and correctness

BFS uses a FIFO queue. It visits the start vertex, then all vertices one edge away, then two edges away, and so on. With equal-cost edges, BFS also yields a minimum-edge-count route, though it does not optimize arbitrary weights. DFS uses a stack and follows one branch as deeply as possible before backtracking. The project sorts neighbor labels before adding them to the frontier so that demo output is deterministic across requests. Both algorithms maintain a visited set, which prevents cycles from causing repeated expansion. They return only vertices reachable from the selected start; a disconnected component is not silently merged into the result.

Dijkstra's algorithm maintains the best known distance from the start and a predecessor for each vertex. When a shorter candidate route is found through a neighbor, its distance and predecessor are updated. Non-negative weights are required: a negative edge could improve a route after a vertex had been settled, violating Dijkstra's key assumption. If the destination remains at infinity, the API returns `found: false`, an empty path, and a null distance. Otherwise, following predecessor links reconstructs the optimal route. Tests exercise competing routes, directed reachability, zero-weight edges, and unreachable targets.

## 6. Selection guide

Choose an adjacency matrix when the graph is dense, the number of vertices is moderate, or repeated edge-existence checks dominate. It is also useful when a compact, fixed-size index domain makes pairwise operations easy to reason about. Choose an adjacency list when the graph is sparse, changes frequently, or algorithms mostly visit actual neighbors. For road maps, dependency graphs, and many social networks, the number of relationships is usually far below $V^2$, making lists an effective starting point.

Neither choice is universally faster. Measure representative workloads, including graph density, vertex additions/removals, edge queries, traversals, and shortest-path requests. Consider implementation overhead too: Python dictionaries are flexible but memory-heavy, while packed arrays can make matrix storage compact. This project therefore exposes both representations over the same demo graph, allowing the user to change storage without changing the graph's meaning and to inspect where the trade-offs come from.
