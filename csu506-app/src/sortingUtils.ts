export type DatasetType = 'random' | 'sorted' | 'reverse' | 'partial'
export type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge'

export const DATASET_TYPES: DatasetType[] = ['random', 'sorted', 'reverse', 'partial']
export const DATASET_LABELS: Record<DatasetType, string> = {
  random: 'Random',
  sorted: 'Already sorted',
  reverse: 'Reverse sorted',
  partial: 'Partially sorted',
}
export const SORT_ALGORITHMS: SortAlgorithm[] = ['bubble', 'selection', 'insertion', 'merge']
export const ALGORITHM_LABELS: Record<SortAlgorithm, string> = {
  bubble: 'Bubble sort',
  selection: 'Selection sort',
  insertion: 'Insertion sort',
  merge: 'Merge sort',
}
export const DATASET_SIZES = [1000, 5000, 10000, 50000]

export function bubbleSort(input: number[]): number[] {
  const values = [...input]
  for (let end = values.length - 1; end > 0; end -= 1) {
    let swapped = false
    for (let index = 0; index < end; index += 1) {
      if (values[index] > values[index + 1]) {
        ;[values[index], values[index + 1]] = [values[index + 1], values[index]]
        swapped = true
      }
    }
    if (!swapped) break
  }
  return values
}

export function selectionSort(input: number[]): number[] {
  const values = [...input]
  for (let start = 0; start < values.length - 1; start += 1) {
    let minimum = start
    for (let index = start + 1; index < values.length; index += 1) {
      if (values[index] < values[minimum]) minimum = index
    }
    if (minimum !== start) {
      ;[values[start], values[minimum]] = [values[minimum], values[start]]
    }
  }
  return values
}

export function insertionSort(input: number[]): number[] {
  const values = [...input]
  for (let index = 1; index < values.length; index += 1) {
    const current = values[index]
    let position = index - 1
    while (position >= 0 && values[position] > current) {
      values[position + 1] = values[position]
      position -= 1
    }
    values[position + 1] = current
  }
  return values
}

export function mergeSort(input: number[]): number[] {
  if (input.length < 2) return [...input]
  const midpoint = Math.floor(input.length / 2)
  const left = mergeSort(input.slice(0, midpoint))
  const right = mergeSort(input.slice(midpoint))
  const merged: number[] = []
  let leftIndex = 0
  let rightIndex = 0
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) merged.push(left[leftIndex++])
    else merged.push(right[rightIndex++])
  }
  return merged.concat(left.slice(leftIndex), right.slice(rightIndex))
}

export const SORT_FUNCTIONS: Record<SortAlgorithm, (input: number[]) => number[]> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
}

export function generateDataset(size: number, type: DatasetType): number[] {
  const values = Array.from({ length: size }, (_, index) => ((index * 7919 + 104729) % (size * 10)) + index / size)
  if (type === 'random') {
    for (let index = values.length - 1; index > 0; index -= 1) {
      const swapIndex = (index * 31 + 17) % (index + 1)
      ;[values[index], values[swapIndex]] = [values[swapIndex], values[index]]
    }
    return values
  }
  const sorted = [...values].sort((left, right) => left - right)
  if (type === 'sorted') return sorted
  if (type === 'reverse') return sorted.reverse()
  const cutoff = Math.floor(size * 0.8)
  for (let index = cutoff; index < size; index += 1) {
    const swapIndex = (index * 13 + 7) % size
    ;[sorted[index], sorted[swapIndex]] = [sorted[swapIndex], sorted[index]]
  }
  return sorted
}

export function isSorted(values: number[]): boolean {
  for (let index = 1; index < values.length; index += 1) {
    if (values[index - 1] > values[index]) return false
  }
  return true
}
