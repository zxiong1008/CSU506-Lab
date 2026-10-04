import './Project1Requirements.css'

type Project7RequirementsProps = { onBack: () => void; onOpenTool: () => void }

const requirements = [
  ['01', 'Two graph representations', 'Implement weighted adjacency matrix and adjacency list graphs, including directed and undirected connections.'],
  ['02', 'Graph manipulation', 'Add and remove vertices and weighted edges while keeping both representations consistent.'],
  ['03', 'Graph traversal', 'Run breadth-first and depth-first search from any vertex and show each frontier and visit step.'],
  ['04', 'Shortest paths', 'Find minimum-weight routes using Dijkstra’s algorithm; report when a destination is unreachable.'],
  ['05', 'Visualization and analysis', 'Display the graph and its stored structure, and compare representation costs and use cases.'],
]

const deliverables = [
  'Adjacency matrix and adjacency list graph source files',
  'Vertex/edge insertion and removal operations',
  'BFS and DFS implementations with step-by-step traces',
  'Dijkstra shortest-path implementation for non-negative weights',
  'Runnable sample graph and automated correctness tests',
  'Two-page representation comparison and interactive graph visualization',
]

function Project7Requirements({ onBack, onOpenTool }: Project7RequirementsProps) {
  return <div className="requirements-page">
    <header className="requirements-topbar"><button className="back-link" type="button" onClick={onBack}>← Dashboard</button><span className="tool-course">CSU 506 <b>•</b> PROJECT 07</span></header>
    <main className="requirements-content">
      <div className="requirements-kicker"><span>PROJECT 07</span><span className="requirement-status">In Progress</span></div>
      <section className="requirements-hero"><div><p className="eyebrow">PROJECT REQUIREMENTS</p><h1>Graph Systems<br /><em>&amp; Algorithms</em><span>.</span></h1><p>Build the same weighted network two ways, manipulate it, explore its reachable vertices, and find efficient routes.</p></div><button className="open-tool-button" type="button" onClick={onOpenTool}>Open working tool <span>→</span></button></section>
      <section className="requirements-grid"><div className="brief-panel"><div className="panel-heading"><span>THE BRIEF</span><strong>01</strong></div><h2>What this project should do</h2><p>Make graph storage trade-offs and algorithms tangible: edit vertices and connections, switch representations, trace BFS/DFS, and calculate weighted shortest paths.</p><div className="connection-note"><span>↗</span><div><strong>Industry connection</strong><p>Graphs model road networks, social relationships, dependencies, communication links, and routing systems. The representation changes memory use and the cost of common operations.</p></div></div></div><div className="requirements-list"><div className="panel-heading"><span>REQUIREMENTS</span><strong>05 items</strong></div>{requirements.map(([number, title, description]) => <div className="requirement-row" key={number}><span className="requirement-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></section>
      <section className="deliverables-panel"><div className="panel-heading"><span>DELIVERABLES</span><strong>06 items</strong></div><div className="deliverables-grid">{deliverables.map((item, index) => <div className="deliverable" key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</div>)}</div></section>
      <section className="analysis-panel"><div className="panel-heading"><span>ANALYSIS NOTES</span><strong>CHOOSE A REPRESENTATION</strong></div><div className="analysis-grid"><article><h3>Adjacency matrix</h3><p>A $V \times V$ table stores whether each vertex pair is connected (and its weight). It uses O(V²) space, but edge existence checks and edge insertion/removal are O(1). Prefer it for dense graphs or workloads with frequent pairwise edge checks.</p></article><article><h3>Adjacency list</h3><p>Each vertex stores only its neighbors, using O(V + E) space. Iterating neighbors takes O(degree(v)); edge lookup is O(degree(v)) here. Prefer it for sparse graphs and traversal-heavy work, where scanning every possible pair would waste time.</p></article><article><h3>BFS and DFS</h3><p>Breadth-first search explores a frontier in layers; depth-first search follows a branch before backtracking. Both take O(V + E) with adjacency lists and O(V²) with a matrix, and visit only the component reachable from the start.</p></article><article><h3>Shortest routes</h3><p>Dijkstra’s algorithm with a binary heap supports non-negative weights. This implementation takes O((V + E) log V) with adjacency lists; scanning matrix rows leads to O(V²). Use BFS instead when all edges have equal cost.</p></article></div></section>
        <section className="analysis-panel"><div className="panel-heading"><span>ANALYSIS NOTES</span><strong>CHOOSE A REPRESENTATION</strong></div><div className="analysis-grid"><article><h3>Adjacency matrix</h3><p>A V × V table stores whether each vertex pair is connected (and its weight). It uses O(V²) space, but edge existence checks and edge insertion/removal are O(1). Prefer it for dense graphs or workloads with frequent pairwise edge checks.</p></article><article><h3>Adjacency list</h3><p>Each vertex stores only its neighbors, using O(V + E) space. Iterating neighbors takes O(degree(v)); this dictionary-backed implementation has average O(1) edge lookup. Prefer it for sparse graphs and traversal-heavy work, where scanning every possible pair would waste time.</p></article><article><h3>BFS and DFS</h3><p>Breadth-first search explores a frontier in layers; depth-first search follows a branch before backtracking. Both take O(V + E) with adjacency lists and O(V²) with a matrix, and visit only the component reachable from the start.</p></article><article><h3>Shortest routes</h3><p>Dijkstra’s algorithm with a binary heap supports non-negative weights. This implementation takes O((V + E) log V) with adjacency lists; scanning matrix rows leads to O(V²). Use BFS instead when all edges have equal cost.</p></article></div></section>
    </main>
  </div>
}

export default Project7Requirements
