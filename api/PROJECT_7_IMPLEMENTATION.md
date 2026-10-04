# Project 7: Graph Systems and Algorithms

## Components

- `graph_adjacency_matrix.py` implements a weighted graph with a square adjacency matrix, graph edits, neighbor enumeration, BFS/DFS traces, and matrix-optimized Dijkstra.
- `graph_adjacency_list.py` implements the same public graph operations with per-vertex neighbor dictionaries and heap-based Dijkstra.
- `project7.py` validates API graph payloads, constructs either implementation, provides the deterministic sample network, and serializes representation snapshots.
- `main.py` exposes the Project 7 REST endpoints under `/api/project7`.
- `test_graphs.py` checks both implementations for graph edits, traversals, shortest paths, directed edges, and invalid input.
- `../PROJECT_7_ANALYSIS.md` contains the representation comparison and selection guide.
- `../csu506-app/src/Project7Tool.tsx` is the interactive graph editor and visualizer.

## API routes

- `GET /api/project7/health` checks service status.
- `GET /api/project7/demo` returns seven vertices and ten weighted edges for a repeatable undirected network.
- `POST /api/project7/state` accepts `{ "vertices": ["A", "B"], "edges": [{"source":"A","target":"B","weight":3}], "representation":"list", "directed":false }` and returns edges, counts, complexity notes, and either matrix or list storage.
- `POST /api/project7/operation` accepts the graph state plus `operation` (`add_vertex`, `remove_vertex`, `add_edge`, or `remove_edge`) and the matching `vertex`, `source`, `target`, and optional `weight` values. The result includes whether a change occurred.
- `POST /api/project7/traversal` accepts graph state plus `{ "algorithm":"bfs|dfs", "start":"A" }`. Returns the reachable visit order and step trace, including frontier/visited snapshots.
- `POST /api/project7/shortest-path` accepts graph state plus `{ "start":"A", "destination":"G" }`. Returns Dijkstra's route, total weight, and relaxation trace. Weights must be finite and non-negative.

The API is stateless: clients submit their current graph on each request. Vertex labels must be unique non-empty strings; payloads are limited to 100 vertices and 1,000 edges. Edges are undirected by default, or directed when `directed` is true. A matrix cell of `null` means no edge, so a zero-weight edge is valid.

## Run and test

From `api/`, run the focused suite with:

```text
python -m unittest test_graphs.py
```

Start the API with `python main.py` (after installing `requirements.txt`) or use the repository Docker Compose setup. Start the frontend in `csu506-app/` using `npm run dev`, choose Project 07, open the working tool, and use the representation switch, graph editor, algorithm tabs, and trace step controls.

## Demonstration result

For the included sample, the shortest route from A to G is `A → C → B → D → E → F → G`, with total weight 14. BFS from A visits `A, B, C, D, E, F, G`; DFS uses alphabetical neighbor order and follows a depth-first branch. Isolated or unreachable vertices are omitted from traversal order and produce a no-route shortest-path result when selected as a destination.
