import { useMemo, useState } from 'react'

type SortStep = {
  pass: number
  array: number[]
  compared: [number, number]
  swapped: boolean
}

function bubbleSortWithSteps(values: number[]): { sorted: number[]; steps: SortStep[] } {
  const data = [...values]
  const steps: SortStep[] = []

  for (let end = data.length - 1; end > 0; end -= 1) {
    let swapped = false
    for (let index = 0; index < end; index += 1) {
      if (data[index] > data[index + 1]) {
        ;[data[index], data[index + 1]] = [data[index + 1], data[index]]
        swapped = true
      }
      steps.push({ pass: steps.length + 1, array: [...data], compared: [index, index + 1], swapped })
    }
    if (!swapped) break
  }

  return { sorted: data, steps }
}

function quickselect(values: number[], k: number): number {
  const data = [...values]

  const select = (left: number, right: number): number => {
    const pivot = data[right]
    let tracker = left

    for (let index = left; index < right; index += 1) {
      if (data[index] <= pivot) {
        ;[data[tracker], data[index]] = [data[index], data[tracker]]
        tracker += 1
      }
    }

    ;[data[tracker], data[right]] = [data[right], data[tracker]]

    if (tracker === k - 1) return data[tracker]
    if (k - 1 < tracker) return select(left, tracker - 1)
    return select(tracker + 1, right)
  }

  if (k < 1 || k > data.length) {
    throw new Error('k must be between 1 and the list length')
  }

  return select(0, data.length - 1)
}

function setUnion(left: number[], right: number[]): number[] {
  return [...new Set([...left, ...right])].sort((a, b) => a - b)
}

function setIntersection(left: number[], right: number[]): number[] {
  return [...new Set(left.filter((value) => right.includes(value)))].sort((a, b) => a - b)
}

function setDifference(left: number[], right: number[]): number[] {
  return [...new Set(left.filter((value) => !right.includes(value)))].sort((a, b) => a - b)
}

function setSymmetricDifference(left: number[], right: number[]): number[] {
  const leftOnly = setDifference(left, right)
  const rightOnly = setDifference(right, left)
  return [...new Set([...leftOnly, ...rightOnly])].sort((a, b) => a - b)
}

function PortfolioTool({ onBack }: { onBack: () => void }) {
  const initialValues = [9, 4, 7, 1, 6, 3]
  const initialSetA = [1, 2, 3, 4]
  const initialSetB = [3, 4, 5, 6]

  const [values, setValues] = useState(initialValues)
  const [kValue, setKValue] = useState(3)
  const [setA, setSetA] = useState(initialSetA)
  const [setB, setSetB] = useState(initialSetB)

  const bubbleResult = useMemo(() => bubbleSortWithSteps(values), [values])
  const quickselectValue = useMemo(() => {
    try {
      return quickselect(values, kValue)
    } catch {
      return 'Invalid k'
    }
  }, [kValue, values])

  const metrics = [
    { label: 'Bubble sort', value: 'O(n²)', detail: 'good for teaching and small data' },
    { label: 'Quickselect', value: 'O(n)', detail: 'average-case selection without full sort' },
    { label: 'Set operations', value: 'O(n)', detail: 'efficient union and intersection' },
    { label: 'Graphs', value: 'O(V + E)', detail: 'BFS/DFS and shortest path' },
  ]

  const structureCoverage = [
    'Stack',
    'Queue',
    'Deque',
    'Linked list',
    'Hash table',
    'Priority queue',
    'Binary search tree',
    'Graph',
  ]

  return (
    <div style={{ padding: '2rem', background: '#0f172a', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.75rem', color: '#fbbf24', margin: 0 }}>
            Final Portfolio
          </p>
          <h1 style={{ margin: '0.35rem 0 0', fontSize: '2.1rem' }}>CSU 506 Mastery System</h1>
        </div>
        <button type="button" onClick={onBack} style={{ background: '#f59e0b', color: '#111827', border: 'none', borderRadius: 999, padding: '0.8rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}>
          Back to dashboard
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {metrics.map((metric) => (
          <div key={metric.label} style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(148, 163, 184, 0.25)', borderRadius: 20, padding: '1rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{metric.label}</div>
            <div style={{ fontSize: '1.7rem', fontWeight: 700, margin: '0.6rem 0', color: '#f8fafc' }}>{metric.value}</div>
            <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{metric.detail}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(430px, 1fr))', gap: '1.5rem' }}>
        <section style={{ background: '#111827', borderRadius: 20, padding: '1.2rem', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
          <h2 style={{ marginTop: 0 }}>Bubble sort with visualization</h2>
          <label style={{ display: 'block', marginBottom: '0.7rem' }}>
            <div style={{ marginBottom: 6, color: '#cbd5e1' }}>Input values</div>
            <input
              value={values.join(', ')}
              onChange={(event) => setValues(event.target.value.split(',').map((value) => Number(value.trim())).filter((value) => Number.isFinite(value)))}
              style={{ width: '100%', padding: '0.8rem', borderRadius: 12, border: '1px solid #475569', background: '#0f172a', color: '#f8fafc' }}
            />
          </label>
          <div style={{ marginBottom: '1rem', color: '#fbbf24' }}>Sorted result: {bubbleResult.sorted.join(', ')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {bubbleResult.steps.slice(0, 8).map((step, index) => (
              <div key={`${step.pass}-${index}`} style={{ background: '#1e293b', borderRadius: 12, padding: '0.6rem 0.8rem', minWidth: 180 }}>
                <div style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>Pass {step.pass}</div>
                <div>{step.array.join(' | ')}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: '#111827', borderRadius: 20, padding: '1.2rem', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
          <h2 style={{ marginTop: 0 }}>Quickselect</h2>
          <label style={{ display: 'block', marginBottom: '0.7rem' }}>
            <div style={{ marginBottom: 6, color: '#cbd5e1' }}>kth smallest</div>
            <input
              type="number"
              min={1}
              max={values.length}
              value={kValue}
              onChange={(event) => setKValue(Number(event.target.value))}
              style={{ width: '100%', padding: '0.8rem', borderRadius: 12, border: '1px solid #475569', background: '#0f172a', color: '#f8fafc' }}
            />
          </label>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#34d399' }}>Result: {quickselectValue}</div>
          <div style={{ marginTop: '1rem', color: '#cbd5e1' }}>Source values: {values.join(', ')}</div>
        </section>

        <section style={{ background: '#111827', borderRadius: 20, padding: '1.2rem', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
          <h2 style={{ marginTop: 0 }}>Set operations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label>
              <div style={{ marginBottom: 6, color: '#cbd5e1' }}>Set A</div>
              <input value={setA.join(', ')} onChange={(event) => setSetA(event.target.value.split(',').map((value) => Number(value.trim())).filter((value) => Number.isFinite(value)))} style={{ width: '100%', padding: '0.8rem', borderRadius: 12, border: '1px solid #475569', background: '#0f172a', color: '#f8fafc' }} />
            </label>
            <label>
              <div style={{ marginBottom: 6, color: '#cbd5e1' }}>Set B</div>
              <input value={setB.join(', ')} onChange={(event) => setSetB(event.target.value.split(',').map((value) => Number(value.trim())).filter((value) => Number.isFinite(value)))} style={{ width: '100%', padding: '0.8rem', borderRadius: 12, border: '1px solid #475569', background: '#0f172a', color: '#f8fafc' }} />
            </label>
          </div>
          <div style={{ display: 'grid', gap: '0.7rem', marginTop: '1rem' }}>
            <div><strong>Union:</strong> {setUnion(setA, setB).join(', ') || '∅'}</div>
            <div><strong>Intersection:</strong> {setIntersection(setA, setB).join(', ') || '∅'}</div>
            <div><strong>Difference:</strong> {setDifference(setA, setB).join(', ') || '∅'}</div>
            <div><strong>Symmetric difference:</strong> {setSymmetricDifference(setA, setB).join(', ') || '∅'}</div>
          </div>
        </section>

        <section style={{ background: '#111827', borderRadius: 20, padding: '1.2rem', border: '1px solid rgba(148, 163, 184, 0.2)', gridColumn: '1 / -1' }}>
          <h2 style={{ marginTop: 0 }}>Course coverage</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
            {structureCoverage.map((structure) => (
              <span key={structure} style={{ background: '#1d4ed8', color: '#eff6ff', padding: '0.5rem 0.8rem', borderRadius: 999, fontWeight: 600 }}>
                {structure}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default PortfolioTool
