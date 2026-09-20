import { useState } from 'react'
import './Project4Tool.css'
import { runProject5BenchmarksAPI } from './apiClient'

type Mode = 'hash-table' | 'priority-queue'

type Benchmarks = {
  hash_table?: { time_ms?: number; lookups?: number; capacity?: number }
  linear_search?: { time_ms?: number; lookups?: number }
  speedup?: number
}

class VisualHashTable {
  private capacity: number = 11
  private buckets: Array<Array<[string, number]>> = Array.from({ length: this.capacity }, () => [])

  private hash(key: string) {
    let total = 0
    for (let index = 0; index < key.length; index += 1) {
      total += (index + 1) * key.charCodeAt(index)
    }
    return total % this.capacity
  }

  insert(key: string, value: number) {
    const index = this.hash(key)
    const bucket = this.buckets[index]
    const existing = bucket.find(([currentKey]) => currentKey === key)
    if (existing) {
      existing[1] = value
      return
    }
    bucket.push([key, value])
  }

  get(key: string) {
    const bucket = this.buckets[this.hash(key)]
    const entry = bucket.find(([currentKey]) => currentKey === key)
    return entry ? entry[1] : null
  }

  delete(key: string) {
    const bucket = this.buckets[this.hash(key)]
    const index = bucket.findIndex(([currentKey]) => currentKey === key)
    if (index < 0) return false
    bucket.splice(index, 1)
    return true
  }

  contains(key: string) {
    return this.get(key) !== null
  }

  items() {
    return this.buckets.flatMap((bucket) => bucket.map(([key, value]) => ({ key, value })))
  }
}

class DemoPriorityQueue {
  private heap: Array<[string, number]> = []

  insert(task: string, priority: number) {
    this.heap.push([task, priority])
    this.heap.sort((left, right) => right[1] - left[1])
  }

  search(task: string) {
    return this.heap.some(([currentTask]) => currentTask === task)
  }

  delete(task: string) {
    const nextHeap = this.heap.filter(([currentTask]) => currentTask !== task)
    const deleted = nextHeap.length !== this.heap.length
    this.heap = nextHeap
    return deleted
  }

  peek() {
    if (!this.heap.length) return null
    return this.heap[0]
  }

  extractMax() {
    if (!this.heap.length) return null
    const [task, priority] = this.heap.shift()!
    return { task, priority }
  }

  extractMin() {
    if (!this.heap.length) return null
    const minimum = this.heap.reduce((best, current) => current[1] < best[1] ? current : best, this.heap[0])
    const index = this.heap.findIndex(([task, priority]) => task === minimum[0] && priority === minimum[1])
    if (index < 0) return null
    const [task, priority] = this.heap.splice(index, 1)[0]
    return { task, priority }
  }

  items() {
    return [...this.heap]
  }
}

function Project5Tool({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('hash-table')
  const [hashTable, setHashTable] = useState(() => new VisualHashTable())
  const [queue, setQueue] = useState(() => new DemoPriorityQueue())
  const [keyInput, setKeyInput] = useState('alice')
  const [valueInput, setValueInput] = useState('96')
  const [message, setMessage] = useState('Ready to demo a hash table or priority queue.')
  const [benchmarks, setBenchmarks] = useState<Benchmarks | null>(null)
  const [loading, setLoading] = useState(false)

  const hashItems = hashTable.items()
  const queueItems = queue.items()

  function resetHashTable() {
    setHashTable(new VisualHashTable())
    setMessage('Hash table reset.')
  }

  function addHashEntry() {
    if (!keyInput.trim()) return
    const parsed = Number(valueInput)
    hashTable.insert(keyInput.trim(), Number.isFinite(parsed) ? parsed : 0)
    setHashTable(new VisualHashTable())
    const nextTable = new VisualHashTable()
    hashItems.forEach((entry) => nextTable.insert(entry.key, entry.value))
    nextTable.insert(keyInput.trim(), Number.isFinite(parsed) ? parsed : 0)
    setHashTable(nextTable)
    setMessage(`Inserted ${keyInput.trim()} with score ${Number.isFinite(parsed) ? parsed : 0}.`)
  }

  function searchHashEntry() {
    const value = hashTable.get(keyInput.trim())
    setMessage(value === null ? `${keyInput.trim()} is not in the hash table.` : `${keyInput.trim()} → ${value}`)
  }

  function deleteHashEntry() {
    const deleted = hashTable.delete(keyInput.trim())
    setHashTable(new VisualHashTable())
    const nextTable = new VisualHashTable()
    hashTable.items().forEach((entry) => {
      if (entry.key !== keyInput.trim()) nextTable.insert(entry.key, entry.value)
    })
    setHashTable(nextTable)
    setMessage(deleted ? `${keyInput.trim()} was removed.` : `${keyInput.trim()} was not found.`)
  }

  function addQueueEntry() {
    if (!keyInput.trim()) return
    const priorityValue = Number(valueInput)
    const nextQueue = new DemoPriorityQueue()
    queue.items().forEach(([task, priority]) => nextQueue.insert(task, priority))
    nextQueue.insert(keyInput.trim(), Number.isFinite(priorityValue) ? priorityValue : 0)
    setQueue(nextQueue)
    setMessage(`Inserted ${keyInput.trim()} at priority ${Number.isFinite(priorityValue) ? priorityValue : 0}.`)
  }

  function searchQueueEntry() {
    const found = queue.search(keyInput.trim())
    setMessage(found ? `${keyInput.trim()} is present in the priority queue.` : `${keyInput.trim()} was not found in the priority queue.`)
  }

  function deleteQueueEntry() {
    const nextQueue = new DemoPriorityQueue()
    queue.items().forEach(([task, priority]) => nextQueue.insert(task, priority))
    const removed = nextQueue.delete(keyInput.trim())
    setQueue(nextQueue)
    setMessage(removed ? `${keyInput.trim()} was removed from the priority queue.` : `${keyInput.trim()} was not in the priority queue.`)
  }

  function popQueueEntry() {
    const nextQueue = new DemoPriorityQueue()
    queue.items().forEach(([task, priority]) => nextQueue.insert(task, priority))
    const entry = nextQueue.extractMax()
    setQueue(nextQueue)
    setMessage(entry ? `Extracted max: ${entry.task} with priority ${entry.priority}.` : 'The priority queue is empty.')
  }

  function popMinQueueEntry() {
    const nextQueue = new DemoPriorityQueue()
    queue.items().forEach(([task, priority]) => nextQueue.insert(task, priority))
    const entry = nextQueue.extractMin()
    setQueue(nextQueue)
    setMessage(entry ? `Extracted min: ${entry.task} with priority ${entry.priority}.` : 'The priority queue is empty.')
  }

  async function loadBenchmarks() {
    setLoading(true)
    try {
      const result = await runProject5BenchmarksAPI(200)
      setBenchmarks(result.benchmarks as Benchmarks)
      setMessage('Project 5 benchmark comparison loaded successfully.')
    } catch {
      setMessage('Project 5 benchmark endpoint unavailable. Start the backend on http://localhost:8000.')
    } finally {
      setLoading(false)
    }
  }

  const benchmarkData = benchmarks as any

  return (
    <div className="project4-tool-page">
      <header className="project4-topbar"><button className="back-link" type="button" onClick={onBack}>← Requirements</button><span>CSU 506 <b>•</b> PROJECT 05</span></header>
      <main className="project4-content">
        <div className="project4-heading">
          <div>
            <p className="project4-kicker">INTERACTIVE PROJECT / HASH TABLE &amp; PRIORITY QUEUE</p>
            <h1>Fast lookup,<br /><em>fast dispatch</em><span>.</span></h1>
            <p>Compare direct access against linear scans and see how a heap keeps the highest-priority item ready.</p>
          </div>
          <div className="project4-count"><strong>02</strong><span>structures<br />to explore</span></div>
        </div>

        <section className="project4-tabs" role="tablist" aria-label="Choose structure">
          {(['hash-table', 'priority-queue'] as Mode[]).map((item) => (
            <button key={item} type="button" className={mode === item ? 'active' : ''} onClick={() => setMode(item)}>
              {item === 'hash-table' ? 'Hash table' : 'Priority queue'}
              <small>{item === 'hash-table' ? 'DIRECT LOOKUP' : 'MAX PRIORITY'}</small>
            </button>
          ))}
        </section>

        <section className="project4-main-grid">
          <div className="project4-playground">
            <div className="project4-panel-header">
              <div>
                <span>LIVE DEMO</span>
                <h2>{mode === 'hash-table' ? 'Hash table' : 'Priority queue'}</h2>
              </div>
              <b>{mode === 'hash-table' ? 'O(1) avg' : 'O(log n)'}</b>
            </div>

            <div className="project4-items" style={{ display: 'grid', gridTemplateColumns: mode === 'hash-table' ? 'repeat(auto-fit, minmax(90px, 1fr))' : 'repeat(auto-fit, minmax(110px, 1fr))' }}>
              {mode === 'hash-table'
                ? hashItems.length
                  ? hashItems.map((entry) => <div key={entry.key} className="project4-item"><span>{entry.key}</span><small>{entry.value}</small></div>)
                  : <span className="project4-empty">No hash entries yet</span>
                : queueItems.length
                  ? queueItems.map(([task, priority], index) => <div key={`${task}-${index}`} className="project4-item"><span>{task}</span><small>{priority}</small></div>)
                  : <span className="project4-empty">No queued tasks yet</span>}
            </div>

            <div className="project4-controls">
              <input value={keyInput} onChange={(event) => setKeyInput(event.target.value)} placeholder={mode === 'hash-table' ? 'Enter key' : 'Enter task'} aria-label="Enter key or task" />
              <input value={valueInput} onChange={(event) => setValueInput(event.target.value)} placeholder={mode === 'hash-table' ? 'Enter score' : 'Enter priority'} aria-label="Enter value or priority" />
              {mode === 'hash-table' ? (
                <>
                  <button type="button" onClick={addHashEntry}>Insert</button>
                  <button type="button" className="secondary" onClick={searchHashEntry}>Search</button>
                  <button type="button" className="secondary" onClick={deleteHashEntry}>Delete</button>
                  <button type="button" className="secondary" onClick={resetHashTable}>Reset</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={addQueueEntry}>Insert</button>
                  <button type="button" className="secondary" onClick={searchQueueEntry}>Search</button>
                  <button type="button" className="secondary" onClick={deleteQueueEntry}>Delete</button>
                  <button type="button" className="secondary" onClick={popQueueEntry}>Extract max</button>
                  <button type="button" className="secondary" onClick={popMinQueueEntry}>Extract min</button>
                </>
              )}
            </div>

            <p className="project4-message"><i />{message}</p>
          </div>

          <aside className="project4-complexity">
            <span>PERFORMANCE SNAPSHOT</span>
            <h2>Core trade-offs</h2>
            <div className="complexity-row"><span>Hash lookup</span><strong>O(1) avg</strong></div>
            <div className="complexity-row"><span>Linear search</span><strong>O(n)</strong></div>
            <div className="complexity-row"><span>Priority select</span><strong>O(1) peek / O(log n) reorder</strong></div>
            <p>The hash table is ideal when you need direct key lookups. The priority queue shines when task urgency matters more than ordering by key.</p>
            <button type="button" className="benchmark-button" onClick={loadBenchmarks} disabled={loading}>{loading ? 'Loading...' : benchmarks ? 'Refresh benchmark' : 'Load benchmark'} <span>→</span></button>
          </aside>
        </section>

        {benchmarkData && (
          <section className="project4-benchmark-results">
            <div className="project4-section-heading"><span>BENCHMARK</span><strong>HASH TABLE VS LINEAR SEARCH</strong></div>
            <div className="benchmark-table" role="table" aria-label="Hash table performance results">
              <div className="benchmark-row benchmark-header" role="row">
                <span>Structure</span>
                <span>Lookups</span>
                <span>Time</span>
                <span>Result</span>
              </div>
              <div className="benchmark-row" role="row">
                <strong>Hash table</strong>
                <span>{benchmarkData.hash_table?.lookups ?? 0}</span>
                <span>{Number(benchmarkData.hash_table?.time_ms ?? 0).toFixed(3)} ms</span>
                <span>{benchmarkData.speedup ? `${Number(benchmarkData.speedup).toFixed(2)}x` : 'N/A'}</span>
              </div>
              <div className="benchmark-row" role="row">
                <strong>Linear search</strong>
                <span>{benchmarkData.linear_search?.lookups ?? 0}</span>
                <span>{Number(benchmarkData.linear_search?.time_ms ?? 0).toFixed(3)} ms</span>
                <span>Baseline</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default Project5Tool
