"""Weighted graph stored as an adjacency matrix."""

from __future__ import annotations

from collections import deque
import math
from typing import Any


class Graph:
    """A weighted directed or undirected graph backed by a square matrix."""

    def __init__(self, vertices: list[str] | None = None, directed: bool = False):
        self.vertices: list[str] = []
        self.directed = directed
        self.matrix: list[list[float | None]] = []
        for vertex in vertices or []:
            self.add_vertex(vertex)

    def add_vertex(self, vertex: str) -> bool:
        if vertex in self.vertices:
            return False
        self.vertices.append(vertex)
        for row in self.matrix:
            row.append(None)
        self.matrix.append([None] * len(self.vertices))
        return True

    def remove_vertex(self, vertex: str) -> bool:
        if vertex not in self.vertices:
            return False
        index = self.vertices.index(vertex)
        self.vertices.pop(index)
        self.matrix.pop(index)
        for row in self.matrix:
            row.pop(index)
        return True

    def add_edge(self, source: str, target: str, weight: float = 1) -> None:
        self._require_vertices(source, target)
        if not isinstance(weight, (int, float)) or isinstance(weight, bool) or (isinstance(weight, float) and not math.isfinite(weight)) or weight < 0:
            raise ValueError("edge weights must be finite non-negative numbers")
        source_index, target_index = self.vertices.index(source), self.vertices.index(target)
        self.matrix[source_index][target_index] = weight
        if not self.directed:
            self.matrix[target_index][source_index] = weight

    def remove_edge(self, source: str, target: str) -> bool:
        self._require_vertices(source, target)
        source_index, target_index = self.vertices.index(source), self.vertices.index(target)
        existed = self.matrix[source_index][target_index] is not None
        self.matrix[source_index][target_index] = None
        if not self.directed:
            self.matrix[target_index][source_index] = None
        return existed

    def neighbors(self, vertex: str) -> list[tuple[str, float]]:
        index = self._vertex_index(vertex)
        return [(name, weight) for name, weight in zip(self.vertices, self.matrix[index]) if weight is not None]

    def edges(self) -> list[dict[str, Any]]:
        result: list[dict[str, Any]] = []
        for row, source in enumerate(self.vertices):
            for column, target in enumerate(self.vertices):
                weight = self.matrix[row][column]
                if weight is not None and (self.directed or row <= column):
                    result.append({"source": source, "target": target, "weight": weight})
        return result

    def display(self) -> dict[str, Any]:
        return {"vertices": self.vertices[:], "matrix": [row[:] for row in self.matrix], "edges": self.edges()}

    def bfs(self, start: str) -> dict[str, Any]:
        self._vertex_index(start)
        queue = deque([start])
        visited = {start}
        order: list[str] = []
        steps: list[dict[str, Any]] = [{"action": "enqueue", "vertex": start, "frontier": list(queue), "visited": []}]
        while queue:
            current = queue.popleft()
            order.append(current)
            steps.append({"action": "visit", "vertex": current, "frontier": list(queue), "visited": order[:]})
            for neighbor, _ in sorted(self.neighbors(current)):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
                    steps.append({"action": "enqueue", "vertex": neighbor, "frontier": list(queue), "visited": order[:]})
        return {"order": order, "steps": steps, "visited": order}

    def dfs(self, start: str) -> dict[str, Any]:
        self._vertex_index(start)
        stack = [start]
        visited: set[str] = set()
        order: list[str] = []
        steps: list[dict[str, Any]] = [{"action": "push", "vertex": start, "frontier": stack[:], "visited": []}]
        while stack:
            current = stack.pop()
            if current in visited:
                steps.append({"action": "skip", "vertex": current, "frontier": stack[:], "visited": order[:]})
                continue
            visited.add(current)
            order.append(current)
            steps.append({"action": "visit", "vertex": current, "frontier": stack[:], "visited": order[:]})
            for neighbor, _ in reversed(sorted(self.neighbors(current))):
                if neighbor not in visited:
                    stack.append(neighbor)
                    steps.append({"action": "push", "vertex": neighbor, "frontier": stack[:], "visited": order[:]})
        return {"order": order, "steps": steps, "visited": order}

    def shortest_path(self, start: str, destination: str) -> dict[str, Any]:
        self._require_vertices(start, destination)
        distances = {vertex: float("inf") for vertex in self.vertices}
        previous: dict[str, str | None] = {vertex: None for vertex in self.vertices}
        distances[start] = 0
        unsettled = set(self.vertices)
        steps: list[dict[str, Any]] = [{"action": "start", "vertex": start, "distance": 0}]
        while unsettled:
            current = min(unsettled, key=lambda vertex: distances[vertex])
            if distances[current] == float("inf"):
                break
            distance = distances[current]
            unsettled.remove(current)
            steps.append({"action": "settle", "vertex": current, "distance": distance})
            if current == destination:
                break
            for neighbor, weight in self.neighbors(current):
                if neighbor not in unsettled:
                    continue
                candidate = distance + weight
                if candidate < distances[neighbor]:
                    distances[neighbor] = candidate
                    previous[neighbor] = current
                    steps.append({"action": "relax", "vertex": neighbor, "from": current, "distance": candidate})
        if distances[destination] == float("inf"):
            return {"found": False, "path": [], "distance": None, "steps": steps}
        path: list[str] = []
        current: str | None = destination
        while current is not None:
            path.append(current)
            current = previous[current]
        path.reverse()
        return {"found": True, "path": path, "distance": distances[destination], "steps": steps}

    def _vertex_index(self, vertex: str) -> int:
        try:
            return self.vertices.index(vertex)
        except ValueError as error:
            raise ValueError(f"Unknown vertex: {vertex}") from error

    def _require_vertices(self, source: str, target: str) -> None:
        self._vertex_index(source)
        self._vertex_index(target)
