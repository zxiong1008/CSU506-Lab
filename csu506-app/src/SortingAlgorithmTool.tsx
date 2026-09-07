import { useMemo, useState } from 'react'
import './SortingAlgorithmTool.css'
import { runSortingBenchmarksAPI, type SortingBenchmarkResult } from './apiClient'
import {
  ALGORITHM_LABELS,
  DATASET_LABELS,
  DATASET_SIZES,
  DATASET_TYPES,
  SORT_ALGORITHMS,
  type DatasetType,
} from './sortingUtils'

type SortingAlgorithmToolProps = { onBack: () => void }
type BenchmarkRow = SortingBenchmarkResult

const CASE_COUNT = SORT_ALGORITHMS.length * DATASET_TYPES.length * DATASET_SIZES.length
const LIMIT_MS = 2000

function formatTime(timeMs: number | null, status: BenchmarkRow['status']) {
  if (status === 'limit') return `>${LIMIT_MS.toLocaleString()} ms`
  if (timeMs === null) return '—'
  if (timeMs < 1) return '<1 ms'
  return `${timeMs.toFixed(1)} ms`
}

function SortingAlgorithmTool({ onBack }: SortingAlgorithmToolProps) {
  const [selectedDataset, setSelectedDataset] = useState<DatasetType>('random')
  const [selectedSize, setSelectedSize] = useState(10000)
  const [results, setResults] = useState<BenchmarkRow[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const visibleResults = results.filter((result) => result.dataset === selectedDataset && result.size === selectedSize)
  const bestAlgorithm = useMemo(() => {
    const measured = visibleResults.filter((result) => result.timeMs !== null).sort((left, right) => left.timeMs! - right.timeMs!)
    return measured[0]?.algorithm
  }, [visibleResults])
  const chartResults = results.filter((result) => result.dataset === selectedDataset)
  const maxChartTime = Math.max(...chartResults.map((result) => result.timeMs ?? LIMIT_MS), 1)

  async function runBenchmarks() {
    setIsRunning(true)
    setError('')
    setResults([])
    setProgress(0)
    try {
      setProgress(10)
      const benchmarkResults = await runSortingBenchmarksAPI()
      setResults(benchmarkResults)
      setProgress(100)
    } catch (benchmarkError) {
      setError(benchmarkError instanceof Error ? benchmarkError.message : 'The benchmark could not be completed.')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="sorting-tool-page">
      <header className="sorting-tool-topbar">
        <button className="back-link" type="button" onClick={onBack}>← Project 03</button>
        <span>CSU 506 <b>•</b> PERFORMANCE LAB</span>
      </header>
      <main className="sorting-tool-content">
        <div className="sorting-tool-heading">
          <div>
            <p className="sorting-kicker">PROJECT 03 / SORTING LAB</p>
            <h1>Sorting, measured<span>.</span></h1>
            <p>Run the same datasets through four classic algorithms and turn Big O into visible evidence.</p>
          </div>
          <button className="run-benchmark-button" type="button" onClick={runBenchmarks} disabled={isRunning}>
            {isRunning ? `Running ${Math.round(progress)}%` : 'Run full benchmark'} <span>↗</span>
          </button>
        </div>
        {isRunning && <div className="benchmark-progress" aria-label="Benchmark progress"><i style={{ width: `${progress}%` }} /></div>}
        {error && <p className="benchmark-error" role="alert">{error}</p>}

        <section className="sorting-controls" aria-label="Benchmark filters">
          <div><span className="control-label">DATASET</span><div className="segmented-control">{DATASET_TYPES.map((dataset) => <button key={dataset} type="button" className={selectedDataset === dataset ? 'selected' : ''} onClick={() => setSelectedDataset(dataset)}>{DATASET_LABELS[dataset]}</button>)}</div></div>
          <div><span className="control-label">SIZE</span><div className="size-control">{DATASET_SIZES.map((size) => <button key={size} type="button" className={selectedSize === size ? 'selected' : ''} onClick={() => setSelectedSize(size)}>{size.toLocaleString()}</button>)}</div></div>
        </section>

        <section className="benchmark-layout">
          <div className="benchmark-table-panel">
            <div className="panel-header"><div><span className="control-label">TIMING REPORT</span><h2>{DATASET_LABELS[selectedDataset]} data / {selectedSize.toLocaleString()} items</h2></div>{bestAlgorithm && <span className="best-badge">BEST: {ALGORITHM_LABELS[bestAlgorithm]}</span>}</div>
            {results.length === 0 ? <div className="empty-benchmark"><strong>Ready when you are.</strong><p>The full run covers {CASE_COUNT} algorithm and dataset combinations.</p></div> : <div className="timing-table"><div className="table-row table-heading"><span>ALGORITHM</span><span>TIME</span><span>COMPLEXITY</span></div>{visibleResults.map((result) => <div className="table-row" key={`${result.algorithm}-${result.dataset}-${result.size}`}><span><b className={`algorithm-mark ${result.algorithm}`} />{ALGORITHM_LABELS[result.algorithm]}</span><strong>{formatTime(result.timeMs, result.status)}</strong><span className="complexity">{result.algorithm === 'merge' ? 'O(n log n)' : 'O(n²)'}</span></div>)}</div>}
          </div>
          <aside className="insight-panel"><span className="control-label">FIELD NOTE</span><h2>What the data says</h2><p>{bestAlgorithm ? `${ALGORITHM_LABELS[bestAlgorithm]} leads this scenario. ${bestAlgorithm === 'merge' ? 'Its O(n log n) growth keeps it dependable as the dataset expands.' : 'This win is specific to the current data shape; quadratic growth will become expensive as n grows.'}` : 'Run the benchmark to reveal the fastest choice for each data shape and size.'}</p><div className="insight-rule" /><span className="control-label">TEST COVERAGE</span><strong className="coverage-number">{results.length}<small> / {CASE_COUNT} cases</small></strong><p className="coverage-copy">Large quadratic cases are marked as a practical time limit so the browser remains usable.</p></aside>
        </section>

        <section className="chart-panel"><div className="panel-header"><div><span className="control-label">COMPARISON CHART</span><h2>How each algorithm scales on {DATASET_LABELS[selectedDataset].toLowerCase()} data</h2></div><span className="chart-unit">milliseconds</span></div><div className="chart-grid">{SORT_ALGORITHMS.map((algorithm) => <div className="chart-series" key={algorithm}><div className="chart-series-title"><b className={`algorithm-mark ${algorithm}`} />{ALGORITHM_LABELS[algorithm]}</div><div className="bars">{DATASET_SIZES.map((size) => { const result = chartResults.find((item) => item.algorithm === algorithm && item.size === size); const value = result?.timeMs ?? (result?.status === 'limit' ? LIMIT_MS : 0); return <div className="bar-column" key={size}><div className="bar-value">{result ? formatTime(result.timeMs, result.status) : '—'}</div><div className={`bar ${result?.status === 'limit' ? 'limited' : ''}`} style={{ height: `${Math.max(value / maxChartTime * 100, result ? 3 : 0)}%` }} /><span>{size >= 1000 ? `${size / 1000}k` : size}</span></div> })}</div></div>)}</div></section>
      </main>
    </div>
  )
}

export default SortingAlgorithmTool
