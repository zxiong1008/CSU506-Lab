import unittest

from graph_adjacency_list import Graph as AdjacencyListGraph
from graph_adjacency_matrix import Graph as AdjacencyMatrixGraph
from project7 import build_graph, demo_data


class GraphRepresentationTests(unittest.TestCase):
    graph_types = (AdjacencyMatrixGraph, AdjacencyListGraph)

    def test_add_remove_vertices_and_edges(self):
        for graph_type in self.graph_types:
            with self.subTest(graph=graph_type.__module__):
                graph = graph_type(["A", "B", "C"])
                self.assertTrue(graph.add_vertex("D"))
                self.assertFalse(graph.add_vertex("D"))
                graph.add_edge("A", "B", 2.5)
                graph.add_edge("B", "C")
                self.assertEqual(graph.neighbors("A"), [("B", 2.5)])
                self.assertTrue(graph.remove_edge("A", "B"))
                self.assertFalse(graph.remove_edge("A", "B"))
                graph.add_edge("A", "C", 7)
                self.assertTrue(graph.remove_vertex("C"))
                self.assertNotIn("C", graph.vertices)
                self.assertEqual(graph.edges(), [])

    def test_bfs_dfs_cover_all_reachable_vertices_with_trace(self):
        expected_bfs = ["A", "B", "C", "D"]
        expected_dfs = ["A", "B", "D", "C"]
        for graph_type in self.graph_types:
            graph = graph_type(["A", "B", "C", "D", "X"])
            for source, target in [("A", "B"), ("A", "C"), ("B", "D")]:
                graph.add_edge(source, target)
            self.assertEqual(graph.bfs("A")["order"], expected_bfs)
            self.assertEqual(graph.dfs("A")["order"], expected_dfs)
            self.assertTrue(graph.bfs("A")["steps"])
            self.assertNotIn("X", graph.bfs("A")["order"])

    def test_dijkstra_finds_weighted_optimum_and_unreachable(self):
        for graph_type in self.graph_types:
            graph = graph_type(["A", "B", "C", "D"])
            graph.add_edge("A", "B", 8)
            graph.add_edge("A", "C", 2)
            graph.add_edge("C", "B", 1)
            graph.add_edge("B", "D", 3)
            graph.add_edge("C", "D", 10)
            result = graph.shortest_path("A", "D")
            self.assertEqual(result["path"], ["A", "C", "B", "D"])
            self.assertEqual(result["distance"], 6)
            self.assertTrue(result["steps"])
            self.assertTrue(graph.shortest_path("D", "A")["found"])

    def test_directed_edges_are_one_way(self):
        for graph_type in self.graph_types:
            graph = graph_type(["A", "B"], directed=True)
            graph.add_edge("A", "B", 0)
            self.assertEqual(graph.neighbors("B"), [])
            self.assertEqual(graph.shortest_path("A", "B")["distance"], 0)
            self.assertFalse(graph.shortest_path("B", "A")["found"])

    def test_invalid_weights_are_rejected(self):
        for graph_type in self.graph_types:
            graph = graph_type(["A", "B"])
            with self.assertRaises(ValueError):
                graph.add_edge("A", "B", -1)
            with self.assertRaises(ValueError):
                graph.add_edge("A", "B", float("inf"))

    def test_project7_demo_and_payload_validation(self):
        data = demo_data()
        self.assertEqual(len(data["vertices"]), 7)
        for representation in ("matrix", "list"):
            graph, selected = build_graph({**data, "representation": representation})
            self.assertEqual(selected, representation)
            self.assertEqual(graph.shortest_path("A", "G")["distance"], 14)
        with self.assertRaises(ValueError):
            build_graph({"vertices": ["A"], "edges": [{"source": "A", "target": "missing"}]})
        with self.assertRaises(ValueError):
            build_graph({"vertices": ["A", "B"], "edges": [{"source": "A", "target": "B", "weight": -1}]})


if __name__ == "__main__":
    unittest.main()
