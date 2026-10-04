"""Shared Project 7 graph construction, validation, and demonstration data."""

from __future__ import annotations

import math
from typing import Any

from graph_adjacency_list import Graph as AdjacencyListGraph
from graph_adjacency_matrix import Graph as AdjacencyMatrixGraph

DEMO_VERTICES = ["A", "B", "C", "D", "E", "F", "G"]
DEMO_EDGES = [
    {"source": "A", "target": "B", "weight": 4},
    {"source": "A", "target": "C", "weight": 2},
    {"source": "B", "target": "C", "weight": 1},
    {"source": "B", "target": "D", "weight": 5},
    {"source": "C", "target": "D", "weight": 8},
    {"source": "C", "target": "E", "weight": 10},
    {"source": "D", "target": "E", "weight": 2},
    {"source": "D", "target": "F", "weight": 6},
    {"source": "E", "target": "F", "weight": 3},
    {"source": "F", "target": "G", "weight": 1},
]


def build_graph(payload: dict[str, Any]):
    representation = payload.get("representation", "list")
    if representation not in {"matrix", "list"}:
        raise ValueError("representation must be 'matrix' or 'list'")
    vertices = payload.get("vertices", [])
    edges = payload.get("edges", [])
    directed = payload.get("directed", False)
    if not isinstance(vertices, list) or len(vertices) > 100:
        raise ValueError("vertices must be a list of at most 100 labels")
    if any(not isinstance(vertex, str) or not vertex.strip() for vertex in vertices):
        raise ValueError("each vertex label must be a non-empty string")
    if len(set(vertices)) != len(vertices):
        raise ValueError("vertex labels must be unique")
    if not isinstance(edges, list) or len(edges) > 1000:
        raise ValueError("edges must be a list of at most 1000 connections")
    if not isinstance(directed, bool):
        raise ValueError("directed must be a boolean")

    graph_type = AdjacencyMatrixGraph if representation == "matrix" else AdjacencyListGraph
    graph = graph_type(vertices, directed=directed)
    for edge in edges:
        if not isinstance(edge, dict):
            raise ValueError("each edge must be an object")
        source, target = edge.get("source"), edge.get("target")
        weight = edge.get("weight", 1)
        if not isinstance(source, str) or not isinstance(target, str):
            raise ValueError("each edge must have string source and target labels")
        if not isinstance(weight, (int, float)) or isinstance(weight, bool) or (isinstance(weight, float) and not math.isfinite(weight)) or weight < 0:
            raise ValueError("edge weights must be finite non-negative numbers")
        graph.add_edge(source, target, weight)
    return graph, representation


def graph_snapshot(graph, representation: str, directed: bool) -> dict[str, Any]:
    structure = graph.display()
    return {
        "representation": representation,
        "directed": directed,
        "vertices": structure["vertices"],
        "edges": structure["edges"],
        "adjacency": structure.get("adjacency"),
        "matrix": structure.get("matrix"),
        "vertexCount": len(graph.vertices),
        "edgeCount": len(structure["edges"]),
        "complexities": {
            "addVertex": "O(V)" if representation == "matrix" else "O(1) average",
            "addEdge": "O(1)",
            "removeVertex": "O(V²)" if representation == "matrix" else "O(V + E)",
            "space": "O(V²)" if representation == "matrix" else "O(V + E)",
        },
    }


def demo_data() -> dict[str, Any]:
    return {"vertices": DEMO_VERTICES[:], "edges": [dict(edge) for edge in DEMO_EDGES], "directed": False}
