import { useEffect, useMemo, useState } from 'react'
import './Project7Tool.css'
import {
  getGraphStateAPI,
  getProject7DemoAPI,
  runGraphOperationAPI,
  runGraphShortestPathAPI,
  runGraphTraversalAPI,
  type GraphAlgorithmResult,
  type GraphEdge,
  type GraphRepresentation,
  type GraphState,
} from './apiClient'

type Algorithm = 'bfs' | 'dfs' | 'dijkstra'
type Coordinate = { x: number; y: number }

function Project7Tool({ onBack }: { onBack: () => void }) {
  const [graph, setGraph] = useState<GraphState | null>(null)
  const [representation, setRepresentation] = useState<GraphRepresentation>('list')
  const [directed, setDirected] = useState(false)
  const [algorithm, setAlgorithm] = useState<Algorithm>('bfs')
  const [mutation, setMutation] = useState<'add_vertex' | 'remove_vertex' | 'add_edge' | 'remove_edge'>('add_edge')
  const [vertexInput, setVertexInput] = useState('H')
  const [sourceInput, setSourceInput] = useState('A')
  const [targetInput, setTargetInput] = useState('G')
  const [weightInput, setWeightInput] = useState('1')
  const [startInput, setStartInput] = useState('A')
  const [destinationInput, setDestinationInput] = useState('G')
  const [result, setResult] = useState<GraphAlgorithmResult | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [message, setMessage] = useState('Loading the sample weighted network…')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    async function initialize() {
      try {
        const demo = await getProject7DemoAPI()
        const state = await getGraphStateAPI(demo.vertices, demo.edges, 'list', demo.directed)
        if (!active) return
        setGraph(state)
        setMessage(`Loaded ${state.vertexCount} vertices and ${state.edgeCount} weighted roads.`)
      } catch (cause) {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Could not load Project 7.')
          setMessage('API connection failed. Start the backend and reload this tool.')
        }
      }
    }
    void initialize()
    return () => { active = false }
  }, [])

  const coordinates = useMemo(() => {
    const points: Record<string, Coordinate> = {}
    if (!graph?.vertices.length) return points
    const centerX = 360
    const centerY = 215
    const radius = Math.min(160, 70 + graph.vertices.length * 12)
    graph.vertices.forEach((vertex, index) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * index) / graph.vertices.length
      points[vertex] = { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius }
    })
    return points
  }, [graph?.vertices])

  const currentStep = result?.steps[stepIndex]
  const visited = new Set(currentStep?.visited ?? [])
  if (result?.algorithm === 'dijkstra' && currentStep) {
    result.steps.slice(0, stepIndex + 1).filter((step) => step.action === 'settle').forEach((step) => visited.add(step.vertex))
  }
  const currentVertex = currentStep?.vertex
  const path = result?.algorithm === 'dijkstra' && result.found ? result.path ?? [] : []

  async function switchRepresentation(nextRepresentation: GraphRepresentation, nextDirected = directed) {
    if (!graph) return
    setLoading(true)
    setError(null)
    try {
      const state = await getGraphStateAPI(graph.vertices, graph.edges, nextRepresentation, nextDirected)
      setGraph(state)
      setRepresentation(nextRepresentation)
      setDirected(nextDirected)
      setResult(null)
      setMessage(`Showing the same network as an adjacency ${nextRepresentation === 'list' ? 'list' : 'matrix'}.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not rebuild graph.')
    } finally {
      setLoading(false)
    }
  }

  async function applyMutation() {
    if (!graph) return
    const mutationValues: { vertex?: string; source?: string; target?: string; weight?: number } = {}
    if (mutation === 'add_vertex' || mutation === 'remove_vertex') {
      if (!vertexInput.trim()) { setError('Enter a vertex label.'); return }
      mutationValues.vertex = vertexInput.trim()
    } else {
      if (!sourceInput.trim() || !targetInput.trim()) { setError('Enter both endpoint labels.'); return }
      mutationValues.source = sourceInput.trim()
      mutationValues.target = targetInput.trim()
      if (mutation === 'add_edge') {
        const weight = Number(weightInput)
        if (!Number.isFinite(weight) || weight < 0) { setError('Enter a non-negative edge weight.'); return }
        mutationValues.weight = weight
      }
    }
    setLoading(true)
    setError(null)
    try {
      const updated = await runGraphOperationAPI(graph, mutation, mutationValues)
      setGraph(updated)
      setResult(null)
      setMessage(updated.result ? `${mutation.replace('_', ' ')} completed.` : `No change: the requested vertex or edge was not present, or the vertex already exists.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Graph operation failed.')
    } finally {
      setLoading(false)
    }
  }

  async function runSelectedAlgorithm() {
    if (!graph) return
    setLoading(true)
    setError(null)
    try {
      const nextResult = algorithm === 'dijkstra'
        ? await runGraphShortestPathAPI(graph, startInput.trim(), destinationInput.trim())
        : await runGraphTraversalAPI(graph, algorithm, startInput.trim())
      setResult(nextResult)
      setStepIndex(0)
      if (algorithm === 'dijkstra') {
        setMessage(nextResult.found
          ? `Shortest route: ${(nextResult.path ?? []).join(' → ')} · total weight ${nextResult.distance}.`
          : `No route connects ${startInput} to ${destinationInput}.`)
      } else {
        setMessage(`${algorithm.toUpperCase()} reached ${nextResult.order?.length ?? 0} of ${graph.vertexCount} vertices in this component.`)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Graph algorithm failed.')
    } finally {
      setLoading(false)
    }
  }

  async function resetDemo() {
    setLoading(true)
    setError(null)
    try {
      const demo = await getProject7DemoAPI()
      const state = await getGraphStateAPI(demo.vertices, demo.edges, representation, directed)
      setGraph(state)
      setResult(null)
      setMessage('Sample network restored.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not reset the sample graph.')
    } finally {
      setLoading(false)
    }
  }

  function isPathEdge(edge: GraphEdge) {
    return path.some((vertex, index) => index < path.length - 1 && (
      (vertex === edge.source && path[index + 1] === edge.target) ||
      (!directed && vertex === edge.target && path[index + 1] === edge.source)
    ))
  }

  return <div className="project7-page">
    <header className="project7-topbar"><button className="back-link" type="button" onClick={onBack}>← Requirements</button><span>CSU 506 <b>•</b> PROJECT 07</span></header>
    <main className="project7-content">
      <section className="project7-heading"><div><p className="project7-kicker">INTERACTIVE PROJECT / GRAPH REPRESENTATIONS</p><h1>Connections<br /><em>in motion</em><span>.</span></h1><p>Manipulate one weighted graph, compare how it is stored, then trace searches and shortest routes through it.</p></div><div className="project7-count"><strong>{graph?.vertexCount ?? '—'}</strong><span>vertices<br />in the network</span></div></section>

      <section className="project7-representation-row">
        <div><span className="project7-label">STORAGE REPRESENTATION</span><div className="project7-switch"><button type="button" className={representation === 'list' ? 'active' : ''} disabled={loading} onClick={() => void switchRepresentation('list')}>Adjacency list</button><button type="button" className={representation === 'matrix' ? 'active' : ''} disabled={loading} onClick={() => void switchRepresentation('matrix')}>Adjacency matrix</button></div></div>
        <label className="project7-directed"><input type="checkbox" checked={directed} disabled={loading} onChange={(event) => void switchRepresentation(representation, event.target.checked)} /> Directed graph</label>
        <button className="project7-reset" type="button" disabled={loading} onClick={() => void resetDemo()}>Reset sample</button>
      </section>

      <section className="project7-top-grid">
        <div className="project7-panel project7-manipulator"><div className="project7-panel-heading"><div><span>GRAPH EDITOR</span><h2>Add or remove connections</h2></div><b>{graph?.complexities.addEdge ?? 'O(1)'}</b></div>
          <label htmlFor="graph-mutation">Operation</label><select id="graph-mutation" value={mutation} onChange={(event) => setMutation(event.target.value as typeof mutation)}><option value="add_vertex">Add vertex</option><option value="remove_vertex">Remove vertex</option><option value="add_edge">Add weighted edge</option><option value="remove_edge">Remove edge</option></select>
          {mutation === 'add_vertex' || mutation === 'remove_vertex' ? <><label htmlFor="graph-vertex">Vertex label</label><input id="graph-vertex" value={vertexInput} onChange={(event) => setVertexInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && void applyMutation()} placeholder="e.g. H" /></> : <div className="project7-edge-inputs"><div><label htmlFor="graph-source">From</label><input id="graph-source" value={sourceInput} onChange={(event) => setSourceInput(event.target.value)} placeholder="A" /></div><div><label htmlFor="graph-target">To</label><input id="graph-target" value={targetInput} onChange={(event) => setTargetInput(event.target.value)} placeholder="B" /></div>{mutation === 'add_edge' && <div><label htmlFor="graph-weight">Weight</label><input id="graph-weight" type="number" min="0" step="any" value={weightInput} onChange={(event) => setWeightInput(event.target.value)} /></div>}</div>}
          <button className="project7-primary" type="button" disabled={loading || !graph} onClick={() => void applyMutation()}>{loading ? 'Working…' : 'Apply graph operation'} <span>→</span></button>
          <p className="project7-message" role="status">{message}</p>{error && <p className="project7-error" role="alert">{error}</p>}
        </div>
        <div className="project7-panel project7-algorithm-panel"><div className="project7-panel-heading"><div><span>ALGORITHM LAB</span><h2>Explore the network</h2></div><b>{algorithm === 'bfs' ? 'O(V + E)' : algorithm === 'dfs' ? 'O(V + E)' : 'Dijkstra'}</b></div>
          <div className="project7-algorithm-tabs" role="tablist" aria-label="Choose graph algorithm">{(['bfs', 'dfs', 'dijkstra'] as const).map((item) => <button type="button" key={item} className={algorithm === item ? 'active' : ''} onClick={() => { setAlgorithm(item); setResult(null) }}>{item === 'bfs' ? 'BFS' : item === 'dfs' ? 'DFS' : 'Shortest path'}</button>)}</div>
          <div className="project7-edge-inputs"><div><label htmlFor="graph-start">{algorithm === 'dijkstra' ? 'Start' : 'Starting vertex'}</label><input id="graph-start" value={startInput} onChange={(event) => setStartInput(event.target.value)} placeholder="A" /></div>{algorithm === 'dijkstra' && <div><label htmlFor="graph-destination">Destination</label><input id="graph-destination" value={destinationInput} onChange={(event) => setDestinationInput(event.target.value)} placeholder="G" /></div>}</div>
          <button className="project7-primary secondary-action" type="button" disabled={loading || !graph} onClick={() => void runSelectedAlgorithm()}>{loading ? 'Running…' : algorithm === 'dijkstra' ? 'Find minimum-weight route' : `Run ${algorithm.toUpperCase()}`} <span>→</span></button>
          <p className="project7-algorithm-note">{algorithm === 'bfs' ? 'BFS explores neighbors layer by layer using a queue.' : algorithm === 'dfs' ? 'DFS follows a branch using a stack, then backtracks.' : 'Dijkstra finds a minimum-weight path; edge weights must be non-negative.'}</p>
        </div>
      </section>

      <section className="project7-panel project7-visual-panel"><div className="project7-section-heading"><div><span>LIVE GRAPH VISUALIZATION</span><h2>{directed ? 'Directed' : 'Undirected'} weighted network</h2></div><small>{graph?.vertexCount ?? 0} vertices · {graph?.edgeCount ?? 0} edges</small></div>
        {graph?.vertices.length ? <div className="project7-svg-wrap"><svg role="img" aria-label="Weighted graph visualization" viewBox="0 0 720 440"><title>Interactive graph structure with traversal and route highlights</title><defs><marker id="project7-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#9aaba4" /></marker><marker id="project7-arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#e8794e" /></marker></defs>
          {graph.edges.map((edge, index) => { const from = coordinates[edge.source]; const to = coordinates[edge.target]; if (!from || !to) return null; const active = isPathEdge(edge); const midpointX = (from.x + to.x) / 2; const midpointY = (from.y + to.y) / 2; return <g key={`${edge.source}-${edge.target}-${index}`}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={active ? 'project7-edge active' : 'project7-edge'} markerEnd={directed ? active ? 'url(#project7-arrow-active)' : 'url(#project7-arrow)' : undefined} /><rect x={midpointX - 15} y={midpointY - 12} width="30" height="20" rx="7" className="project7-weight-bg" /><text x={midpointX} y={midpointY + 2} textAnchor="middle" className="project7-weight">{edge.weight}</text></g> })}
          {graph.vertices.map((vertex) => { const point = coordinates[vertex]; const nodeVisited = visited.has(vertex) || path.includes(vertex); const nodeCurrent = currentVertex === vertex; return <g key={vertex} className="project7-vertex"><circle cx={point.x} cy={point.y} r="26" className={nodeCurrent ? 'project7-node current' : nodeVisited ? 'project7-node visited' : 'project7-node'} /><text x={point.x} y={point.y + 5} textAnchor="middle" className="project7-node-label">{vertex}</text></g> })}
        </svg></div> : <p className="project7-empty">Add vertices and edges to start building the graph.</p>}
        {result?.algorithm === 'dijkstra' && result.found && <div className="project7-route-result"><span>OPTIMAL ROUTE</span><strong>{(result.path ?? []).join(' → ')}</strong><b>Total weight {result.distance}</b></div>}
        {result && <div className="project7-trace"><div className="project7-trace-header"><div><span>STEP-BY-STEP TRACE</span><strong>{result.algorithm === 'dijkstra' ? 'Dijkstra relaxations' : `${result.algorithm.toUpperCase()} frontier`}</strong></div><div className="project7-step-controls"><button type="button" aria-label="Previous step" disabled={stepIndex <= 0} onClick={() => setStepIndex((index) => Math.max(0, index - 1))}>←</button><span>Step {Math.min(stepIndex + 1, result.steps.length)} / {result.steps.length}</span><button type="button" aria-label="Next step" disabled={stepIndex >= result.steps.length - 1} onClick={() => setStepIndex((index) => Math.min(result.steps.length - 1, index + 1))}>→</button></div></div>
          {currentStep && <p className="project7-current-step"><b>{currentStep.action}</b> {currentStep.vertex}{currentStep.from ? ` from ${currentStep.from}` : ''}{currentStep.distance !== undefined ? ` · distance ${currentStep.distance}` : ''}{currentStep.frontier ? ` · frontier [${currentStep.frontier.join(', ')}]` : ''}</p>}
          <div className="project7-step-list">{result.steps.map((step, index) => <button key={`${step.action}-${step.vertex}-${index}`} type="button" className={index === stepIndex ? 'active' : ''} onClick={() => setStepIndex(index)}><span>{String(index + 1).padStart(2, '0')}</span><b>{step.action}</b><span>{step.vertex}{step.from ? ` ← ${step.from}` : ''}</span>{step.distance !== undefined && <i>{step.distance}</i>}</button>)}</div>
          {result.order && <div className="project7-order"><span>VISIT ORDER</span><strong>{result.order.join(' → ')}</strong></div>}
        </div>}
      </section>

      <section className="project7-panel project7-storage-panel"><div className="project7-section-heading"><div><span>UNDERLYING STORAGE</span><h2>{representation === 'list' ? 'Adjacency list' : 'Adjacency matrix'}</h2></div><small>{representation === 'list' ? 'Space: O(V + E)' : 'Space: O(V²)'}</small></div>
        {representation === 'list' ? <div className="project7-adjacency-list">{graph?.vertices.map((vertex) => <div key={vertex}><strong>{vertex}</strong><span>{(graph.adjacency?.[vertex] ? Object.entries(graph.adjacency[vertex]) : []).map(([neighbor, weight]) => `${neighbor} (${weight})`).join(' · ') || 'no neighbors'}</span></div>)}</div> : <div className="project7-matrix-wrap"><table><thead><tr><th>Vertex</th>{graph?.vertices.map((vertex) => <th key={vertex}>{vertex}</th>)}</tr></thead><tbody>{graph?.matrix?.map((row, index) => <tr key={graph.vertices[index]}><th>{graph.vertices[index]}</th>{row.map((weight, column) => <td key={`${index}-${column}`}>{weight === null ? '·' : weight}</td>)}</tr>)}</tbody></table></div>}
        <p className="project7-complexity-note">Current representation complexity — add vertex: <b>{graph?.complexities.addVertex}</b>; remove vertex: <b>{graph?.complexities.removeVertex}</b>; storage: <b>{graph?.complexities.space}</b>.</p>
      </section>
      <section className="project7-takeaway"><span>SELECTION RULE</span><p><b>Choose a matrix</b> for dense graphs and constant-time edge checks. <b>Choose a list</b> for sparse graphs, lower memory use, and efficient neighbor traversal.</p></section>
    </main>
  </div>
}

export default Project7Tool
