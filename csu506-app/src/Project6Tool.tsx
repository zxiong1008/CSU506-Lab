import { useEffect, useMemo, useState } from 'react'
import './Project6Tool.css'
import {
  getProject6DemoAPI,
  runProject6BenchmarksAPI,
  runTreeMapOperationAPI,
  runTreeOperationAPI,
  type TreeBenchmark,
  type TreeNodeData,
  type TreeOperationResult,
} from './apiClient'

type Mode = 'tree' | 'map'
type Point = { node: TreeNodeData; x: number; y: number; id: string }
type Edge = { from: Point; to: Point }

function layoutTree(root: TreeNodeData | null) {
  const nodes: Point[] = []
  const edges: Edge[] = []
  let index = 0
  function place(node: TreeNodeData | null, depth: number, id: string): void {
    if (!node) return
    place(node.left, depth + 1, `${id}L`)
    nodes.push({ node, x: 42 + index * 68, y: 38 + depth * 76, id })
    index += 1
    place(node.right, depth + 1, `${id}R`)
  }
  place(root, 0, 'root')
  const points = new Map(nodes.map((point) => [point.id, point]))
  function connect(node: TreeNodeData | null, id: string): void {
    if (!node) return
    const parent = points.get(id)!
    if (node.left) {
      const child = points.get(`${id}L`)!
      edges.push({ from: parent, to: child })
      connect(node.left, `${id}L`)
    }
    if (node.right) {
      const child = points.get(`${id}R`)!
      edges.push({ from: parent, to: child })
      connect(node.right, `${id}R`)
    }
  }
  connect(root, 'root')
  return { nodes, edges, width: Math.max(720, 84 + nodes.length * 68), height: Math.max(150, ...nodes.map(({ y }) => y + 38)) }
}

function valueLabel(value: unknown) {
  if (typeof value === 'string') return value
  const encoded = JSON.stringify(value)
  return encoded === undefined ? String(value) : encoded
}

function parseMapValue(input: string): unknown {
  try { return JSON.parse(input) } catch { return input }
}

function Project6Tool({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('tree')
  const [treeValues, setTreeValues] = useState<number[]>([])
  const [mapEntries, setMapEntries] = useState<Array<{ key: string; value: unknown }>>([])
  const [treeState, setTreeState] = useState<TreeOperationResult | null>(null)
  const [mapState, setMapState] = useState<TreeOperationResult | null>(null)
  const [treeInput, setTreeInput] = useState('500')
  const [mapKey, setMapKey] = useState('student-01')
  const [mapValue, setMapValue] = useState('new value')
  const [benchmarks, setBenchmarks] = useState<TreeBenchmark[]>([])
  const [treeZoom, setTreeZoom] = useState(1)
  const [message, setMessage] = useState('Loading the 50-item sample dataset…')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    async function loadDemo() {
      try {
        const demo = await getProject6DemoAPI()
        const [tree, map] = await Promise.all([
          runTreeOperationAPI(demo.treeValues, 'search', demo.treeValues[0]),
          runTreeMapOperationAPI(demo.mapEntries, 'search', demo.mapEntries[0].key),
        ])
        if (!active) return
        setTreeValues(demo.treeValues)
        setMapEntries(demo.mapEntries)
        setTreeState(tree)
        setMapState(map)
        setMessage(`Loaded ${demo.treeValues.length} numeric tree keys and ${demo.mapEntries.length} map entries with mixed value types.`)
      } catch (cause) {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Could not load the Project 6 API.')
          setMessage('API connection failed. Start the backend and reload this tool.')
        }
      }
    }
    void loadDemo()
    return () => { active = false }
  }, [])

  const layout = useMemo(() => layoutTree(treeState?.root ?? null), [treeState?.root])
  const shownEntries = mapState?.entries ?? mapEntries

  async function operateOnTree(operation: 'insert' | 'search' | 'delete') {
    const value = Number(treeInput)
    if (!Number.isFinite(value)) {
      setError('Enter a valid numeric key.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await runTreeOperationAPI(treeValues, operation, value)
      setTreeState(result)
      if (operation === 'insert' && result.result) setTreeValues((current) => [...current, value])
      if (operation === 'delete' && result.result) setTreeValues((current) => current.filter((item) => item !== value))
      setMessage(operation === 'search'
        ? result.result ? `${value} is present in the BST.` : `${value} was not found in the BST.`
        : operation === 'insert'
          ? result.result ? `Inserted ${value} into the BST.` : `${value} already exists; duplicate ignored.`
          : result.result ? `Deleted ${value} from the BST.` : `${value} was not found; tree unchanged.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'BST operation failed.')
    } finally {
      setLoading(false)
    }
  }

  async function operateOnMap(operation: 'insert' | 'search' | 'delete') {
    const key = mapKey.trim()
    if (!key) {
      setError('Enter a non-empty string key.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const value = parseMapValue(mapValue)
      const result = await runTreeMapOperationAPI(mapEntries, operation, key, value)
      setMapState(result)
      if (operation === 'insert') {
        setMapEntries((current) => {
          const index = current.findIndex((entry) => entry.key === key)
          if (index < 0) return [...current, { key, value }]
          return current.map((entry) => entry.key === key ? { key, value } : entry)
        })
      } else if (operation === 'delete' && result.found) {
        setMapEntries((current) => current.filter((entry) => entry.key !== key))
      }
      setMessage(operation === 'search'
        ? result.found ? `${key} → ${valueLabel(result.result)}` : `${key} was not found in the map.`
        : operation === 'insert' ? `Stored ${key} → ${valueLabel(value)}.`
          : result.found ? `Deleted ${key} from the map.` : `${key} was not found; map unchanged.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Map operation failed.')
    } finally {
      setLoading(false)
    }
  }

  async function loadBenchmarks() {
    setLoading(true)
    setError(null)
    try {
      setBenchmarks(await runProject6BenchmarksAPI())
      setMessage('Tree-backed Map and list-backed Map lookup benchmarks completed.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Benchmark request failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="project6-page">
      <header className="project6-topbar"><button className="back-link" type="button" onClick={onBack}>← Requirements</button><span>CSU 506 <b>•</b> PROJECT 06</span></header>
      <main className="project6-content">
        <section className="project6-heading">
          <div><p className="project6-kicker">INTERACTIVE PROJECT / TREE DATA STRUCTURES</p><h1>Keep your data<br /><em>in order</em><span>.</span></h1><p>Build and manipulate a BST, inspect its balance and traversals, and use it as an ordered key-value map.</p></div>
          <div className="project6-count"><strong>50</strong><span>sample keys<br />to explore</span></div>
        </section>

        <nav className="project6-tabs" aria-label="Choose tree demonstration">
          <button className={mode === 'tree' ? 'active' : ''} type="button" onClick={() => setMode('tree')}>Binary search tree<small>INSERT · SEARCH · DELETE</small></button>
          <button className={mode === 'map' ? 'active' : ''} type="button" onClick={() => setMode('map')}>Tree-backed Map<small>HETEROGENEOUS VALUES</small></button>
        </nav>

        <section className="project6-workspace">
          <div className="project6-panel project6-controls">
            <div className="project6-panel-heading"><div><span>LIVE DEMO</span><h2>{mode === 'tree' ? 'BST operations' : 'Map operations'}</h2></div><b>{mode === 'tree' ? 'O(h)' : 'O(h)'}</b></div>
            {mode === 'tree' ? <>
              <label htmlFor="tree-key">Numeric key</label>
              <input id="tree-key" type="number" value={treeInput} onChange={(event) => setTreeInput(event.target.value)} />
              <div className="project6-button-row"><button disabled={loading} type="button" onClick={() => void operateOnTree('insert')}>Insert</button><button disabled={loading} type="button" className="secondary" onClick={() => void operateOnTree('search')}>Search</button><button disabled={loading} type="button" className="secondary" onClick={() => void operateOnTree('delete')}>Delete</button></div>
              <p className="project6-hint">Duplicate inserts are ignored. Deleting a node with two children uses its in-order successor.</p>
            </> : <>
              <label htmlFor="map-key">String key</label><input id="map-key" value={mapKey} onChange={(event) => setMapKey(event.target.value)} placeholder="e.g. student-01" />
              <label htmlFor="map-value">Value (JSON when valid; otherwise text)</label><input id="map-value" value={mapValue} onChange={(event) => setMapValue(event.target.value)} placeholder={'e.g. "hello", 42, true, null, {"grade":"A"}'} />
              <div className="project6-button-row"><button disabled={loading} type="button" onClick={() => void operateOnMap('insert')}>Put / update</button><button disabled={loading} type="button" className="secondary" onClick={() => void operateOnMap('search')}>Get</button><button disabled={loading} type="button" className="secondary" onClick={() => void operateOnMap('delete')}>Delete</button></div>
              <p className="project6-hint">Keys stay sorted by the BST; values may be numbers, strings, booleans, arrays, objects, or null.</p>
            </>}
            {error && <div className="project6-error" role="alert">{error}</div>}
            <div className="project6-message" role="status">{message}</div>
          </div>

          <div className="project6-panel project6-stats">
            <div className="project6-panel-heading"><div><span>STRUCTURE HEALTH</span><h2>{mode === 'tree' ? 'Tree properties' : 'Map properties'}</h2></div><span className={mode === 'tree' ? treeState?.balanced ? 'project6-badge balanced' : 'project6-badge unbalanced' : mapState?.balanced ? 'project6-badge balanced' : 'project6-badge unbalanced'}>{(mode === 'tree' ? treeState?.balanced : mapState?.balanced) ? 'Balanced' : 'Unbalanced'}</span></div>
            <div className="project6-stat-grid"><div><small>ITEMS</small><strong>{mode === 'tree' ? treeState?.size ?? 0 : mapState?.size ?? 0}</strong></div><div><small>HEIGHT</small><strong>{mode === 'tree' ? treeState?.height ?? 0 : mapState?.height ?? 0}</strong></div><div><small>MINIMUM</small><strong>{String(mode === 'tree' ? treeState?.minimum ?? '—' : mapState?.minimum ?? '—')}</strong></div><div><small>MAXIMUM</small><strong>{String(mode === 'tree' ? treeState?.maximum ?? '—' : mapState?.maximum ?? '—')}</strong></div></div>
            <p className="project6-complexity-note">Search, insert, and delete take O(h): O(log n) when balanced, but O(n) in a worst-case chain.</p>
          </div>
        </section>

        {mode === 'tree' ? <>
          <section className="project6-panel project6-visual-panel">
            <div className="project6-section-heading"><div><span>STRUCTURE VIEW</span><h2>Tree after operations</h2></div><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><small>Zoom</small><button type="button" aria-label="Zoom out" title="Zoom out" onClick={() => setTreeZoom((current) => Math.max(0.6, Number((current - 0.2).toFixed(1))))}>−</button><output aria-label="Current zoom">{Math.round(treeZoom * 100)}%</output><button type="button" aria-label="Zoom in" title="Zoom in" onClick={() => setTreeZoom((current) => Math.min(2, Number((current + 0.2).toFixed(1))))}>+</button><button type="button" aria-label="Reset zoom" title="Reset zoom" onClick={() => setTreeZoom(1)}>Reset</button></div></div>
            <div className="project6-tree-scroll"><svg role="img" aria-label="Binary search tree visualization" width="100%" height="auto" viewBox={`0 0 ${layout.width} ${layout.height}`} style={{ transform: `scale(${treeZoom})`, transformOrigin: 'top center' }}>
              <title>Current binary search tree</title>
              {layout.edges.map(({ from, to }) => <line key={`${from.id}-${to.id}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="project6-edge" />)}
              {layout.nodes.map(({ node, x, y, id }) => <g key={id}><circle cx={x} cy={y} r="22" className="project6-node" /><text x={x} y={y + 4} textAnchor="middle" className="project6-node-label">{node.value}</text></g>)}
            </svg></div>
            {!treeState?.root && <p className="project6-empty">The tree is empty. Insert a key to create its root.</p>}
          </section>
          <section className="project6-panel project6-traversals">
            <div className="project6-section-heading"><div><span>ORDERED OUTPUT</span><h2>Traversal examples</h2></div><small>In-order is ascending for a BST</small></div>
            {(['inorder', 'preorder', 'postorder'] as const).map((order) => <div className="project6-traversal-row" key={order}><strong>{order === 'inorder' ? 'In-order' : order === 'preorder' ? 'Pre-order' : 'Post-order'}</strong><code>{treeState?.[order]?.join(' · ') || '—'}</code></div>)}
          </section>
        </> : <section className="project6-panel project6-map-panel">
          <div className="project6-section-heading"><div><span>SORTED MAP CONTENTS</span><h2>Key-value entries</h2></div><small>{shownEntries.length} entries · heterogeneous values supported</small></div>
          <div className="project6-map-list">{shownEntries.map(({ key, value }) => <div key={key}><strong>{key}</strong><code>{valueLabel(value)}</code></div>)}</div>
        </section>}

        <section className="project6-panel project6-benchmark-panel">
          <div className="project6-section-heading"><div><span>LOOKUP PERFORMANCE</span><h2>Tree Map vs. list-based Map</h2></div><button type="button" disabled={loading} onClick={() => void loadBenchmarks()}>{loading ? 'Running…' : 'Run benchmarks'}</button></div>
          <p>Successful lookups target the last inserted key in a list map (its linear-scan worst case). Tree insertion order is shuffled deterministically; timings are runtime-dependent.</p>
          {benchmarks.length > 0 ? <div className="project6-table-wrap"><table><thead><tr><th>Items</th><th>BST height</th><th>Tree map</th><th>List map</th><th>List comparisons / lookup</th><th>Observed speedup</th></tr></thead><tbody>{benchmarks.map((row) => <tr key={row.size}><td>{row.size.toLocaleString()}</td><td>{row.treeHeight}</td><td>{row.treeMapTimeMs.toFixed(4)} ms</td><td>{row.listMapTimeMs.toFixed(4)} ms</td><td>{row.listComparisonsPerSearch}</td><td>{row.speedup?.toFixed(2) ?? '—'}×</td></tr>)}</tbody></table></div> : <p className="project6-empty">Run the benchmark to populate measured results for 50, 200, and 1,000 entries.</p>}
          <div className="project6-benchmark-note"><span><b>Tree map:</b> O(log n) average for balanced input; O(n) worst case.</span><span><b>List map:</b> O(n) search; simple storage, but no ordered operations.</span></div>
        </section>
      </main>
    </div>
  )
}

export default Project6Tool
