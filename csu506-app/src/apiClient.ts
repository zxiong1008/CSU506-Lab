/**
 * API utility for communicating with the Project 2 backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_PROJECT2_URL = `${API_BASE_URL}/api/project2`
const API_PROJECT3_URL = `${API_BASE_URL}/api/project3`
const API_PROJECT4_URL = `${API_BASE_URL}/api/project4`
const API_PROJECT5_URL = `${API_BASE_URL}/api/project5`
const API_PROJECT6_URL = `${API_BASE_URL}/api/project6`
const API_PROJECT7_URL = `${API_BASE_URL}/api/project7`

export interface SearchResult {
  found: boolean
  index: number
  comparisons: number
  timeMs: number
}

export interface BenchmarkResult {
  arraySize: number
  linearSearchTime: number
  linearSearchComparisons: number
  binarySearchTime: number
  binarySearchComparisons: number
  targetValue: number
}

export interface SortingBenchmarkResult {
  algorithm: 'bubble' | 'selection' | 'insertion' | 'merge'
  dataset: 'random' | 'sorted' | 'reverse' | 'partial'
  size: number
  timeMs: number | null
  status: 'measured' | 'limit'
}

export interface LinearStructureBenchmark {
  timeMs: number
  complexity: string
  operations: Record<string, {
    timeMs: number
    complexity: string
  }>
}

export type LinearStructureBenchmarks = Record<string, LinearStructureBenchmark>

export interface TreeNodeData {
  value: number | string
  left: TreeNodeData | null
  right: TreeNodeData | null
}

export interface TreeDemoData {
  treeValues: number[]
  mapEntries: Array<{ key: string; value: unknown }>
}

export interface TreeBenchmark {
  size: number
  searches: number
  target: number
  treeMapTimeMs: number
  listMapTimeMs: number
  treeMapComplexity: string
  listMapComplexity: string
  listComparisonsPerSearch: number
  treeHeight: number
  speedup: number | null
}

export interface TreeOperationResult {
  operation: string
  value?: number
  key?: string
  result: unknown
  found?: boolean
  root: TreeNodeData | null
  size: number
  height: number
  balanced: boolean
  minimum: number | string | null
  maximum: number | string | null
  inorder?: number[]
  preorder?: number[]
  postorder?: number[]
  entries?: Array<{ key: string; value: unknown }>
}

export type GraphRepresentation = 'matrix' | 'list'
export type GraphEdge = { source: string; target: string; weight: number }
export type GraphState = {
  representation: GraphRepresentation
  directed: boolean
  vertices: string[]
  edges: GraphEdge[]
  adjacency?: Record<string, Record<string, number>>
  matrix?: Array<Array<number | null>>
  vertexCount: number
  edgeCount: number
  complexities: Record<string, string>
}
export type GraphTraceStep = {
  action: string
  vertex: string
  from?: string
  distance?: number
  frontier?: string[]
  visited?: string[]
}
export type GraphAlgorithmResult = GraphState & {
  algorithm: 'bfs' | 'dfs' | 'dijkstra'
  order?: string[]
  path?: string[]
  distance?: number | null
  found?: boolean
  steps: GraphTraceStep[]
}
export type GraphDemoData = { vertices: string[]; edges: GraphEdge[]; directed: boolean }

async function project7Request<T>(path: string, payload?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_PROJECT7_URL}${path}`, {
    method: payload ? 'POST' : 'GET',
    headers: payload ? { 'Content-Type': 'application/json' } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail ?? `Project 7 API Error: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export function getProject7DemoAPI(): Promise<GraphDemoData> {
  return project7Request('/demo')
}

export function getGraphStateAPI(vertices: string[], edges: GraphEdge[], representation: GraphRepresentation, directed: boolean): Promise<GraphState> {
  return project7Request('/state', { vertices, edges, representation, directed })
}

export function runGraphOperationAPI(
  graph: Pick<GraphState, 'vertices' | 'edges' | 'representation' | 'directed'>,
  operation: 'add_vertex' | 'remove_vertex' | 'add_edge' | 'remove_edge',
  values: { vertex?: string; source?: string; target?: string; weight?: number },
): Promise<GraphState & { operation: string; result: boolean }> {
  return project7Request('/operation', { ...graph, operation, ...values })
}

export function runGraphTraversalAPI(
  graph: Pick<GraphState, 'vertices' | 'edges' | 'representation' | 'directed'>,
  algorithm: 'bfs' | 'dfs',
  start: string,
): Promise<GraphAlgorithmResult> {
  return project7Request('/traversal', { ...graph, algorithm, start })
}

export function runGraphShortestPathAPI(
  graph: Pick<GraphState, 'vertices' | 'edges' | 'representation' | 'directed'>,
  start: string,
  destination: string,
): Promise<GraphAlgorithmResult> {
  return project7Request('/shortest-path', { ...graph, start, destination })
}

async function project6Request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_PROJECT6_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail ?? `Project 6 API Error: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export function getProject6DemoAPI(): Promise<TreeDemoData> {
  return project6Request('/demo')
}

export function runTreeOperationAPI(values: number[], operation: 'insert' | 'search' | 'delete', value: number): Promise<TreeOperationResult> {
  return project6Request('/tree/operation', { method: 'POST', body: JSON.stringify({ values, operation, value }) })
}

export function runTreeMapOperationAPI(
  entries: Array<{ key: string; value: unknown }>,
  operation: 'insert' | 'search' | 'delete',
  key: string,
  value?: unknown,
): Promise<TreeOperationResult> {
  return project6Request('/map/operation', { method: 'POST', body: JSON.stringify({ entries, operation, key, value }) })
}

export async function runProject6BenchmarksAPI(): Promise<TreeBenchmark[]> {
  const data = await project6Request<{ benchmarks: TreeBenchmark[] }>('/benchmarks')
  return data.benchmarks
}

export async function linearSearchAPI(searchValue: number, arraySize: number = 100): Promise<SearchResult> {
  try {
    const response = await fetch(
      `${API_PROJECT2_URL}/linear-search?search_value=${searchValue}&array_size=${arraySize}`,
      { method: 'POST' }
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error('Linear search API error:', error)
    throw error
  }
}

export async function binarySearchAPI(searchValue: number, arraySize: number = 100): Promise<SearchResult> {
  try {
    const response = await fetch(
      `${API_PROJECT2_URL}/binary-search?search_value=${searchValue}&array_size=${arraySize}`,
      { method: 'POST' }
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error('Binary search API error:', error)
    throw error
  }
}

export async function getArrayElementsAPI(size: number, arrayType: 'sorted' | 'unsorted' = 'unsorted'): Promise<number[]> {
  try {
    const response = await fetch(
      `${API_PROJECT2_URL}/array-elements/${size}?array_type=${arrayType}`
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.elements
  } catch (error) {
    console.error('Get array elements API error:', error)
    throw error
  }
}

export async function runBenchmarksAPI(): Promise<BenchmarkResult[]> {
  try {
    const response = await fetch(`${API_PROJECT2_URL}/benchmarks`)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.benchmarks
  } catch (error) {
    console.error('Benchmarks API error:', error)
    throw error
  }
}

export async function healthCheckAPI(): Promise<boolean> {
  try {
    const response = await fetch(`${API_PROJECT2_URL}/health`)
    return response.ok
  } catch (error) {
    console.error('Health check error:', error)
    return false
  }
}

export async function runSortingBenchmarksAPI(): Promise<SortingBenchmarkResult[]> {
  const response = await fetch(`${API_PROJECT3_URL}/benchmarks`)
  if (!response.ok) throw new Error(`Sorting API Error: ${response.status}`)
  const data = await response.json()
  return data.benchmarks
}

export async function runLinearStructureBenchmarksAPI(size: number = 10000): Promise<LinearStructureBenchmarks> {
  const response = await fetch(`${API_PROJECT4_URL}/benchmarks?size=${size}`)
  if (!response.ok) throw new Error(`Data structure API Error: ${response.status}`)
  const data = await response.json()
  return data.benchmarks
}

export async function runProject5BenchmarksAPI(size: number = 200): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_PROJECT5_URL}/benchmarks?size=${size}`)
  if (!response.ok) throw new Error(`Project 5 API Error: ${response.status}`)
  return response.json()
}
