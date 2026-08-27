from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time
from typing import List, Dict, Any

app = FastAPI(
    title="CSU 506 Project 2 API",
    description="Search Algorithm Comparison API",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static data arrays
STATIC_UNSORTED_100 = [
    342, 891, 156, 723, 489, 234, 567, 901, 445, 612, 378, 834, 521, 678, 289, 756, 403, 920, 614, 371,
    845, 192, 689, 523, 876, 412, 735, 628, 501, 764, 289, 456, 801, 534, 671, 345, 912, 456, 789, 123,
    654, 987, 321, 234, 567, 876, 543, 210, 876, 432, 987, 654, 321, 876, 109, 765, 432, 876, 543, 210,
    567, 234, 876, 543, 210, 987, 654, 321, 876, 432, 765, 432, 876, 543, 210, 567, 234, 876, 543, 210,
    987, 654, 321, 876, 432, 765, 432, 876, 543, 210, 567, 234, 876, 543, 210, 987, 654, 321, 876, 432,
]

STATIC_SORTED_100 = sorted(STATIC_UNSORTED_100)


def generate_unsorted_array(size: int) -> List[int]:
    """Generate static unsorted array by repeating the base pattern."""
    if size <= 100:
        return STATIC_UNSORTED_100[:size]
    
    result = []
    base_size = len(STATIC_UNSORTED_100)
    offset = 0
    
    while len(result) < size:
        for i in range(base_size):
            if len(result) < size:
                result.append(STATIC_UNSORTED_100[i] + offset * 100)
        offset += 1
    
    return result


def generate_sorted_array(size: int) -> List[int]:
    """Generate static sorted array by repeating the base pattern."""
    if size <= 100:
        return STATIC_SORTED_100[:size]
    
    result = []
    base_size = len(STATIC_SORTED_100)
    offset = 0
    
    while len(result) < size:
        for i in range(base_size):
            if len(result) < size:
                result.append(STATIC_SORTED_100[i] + offset * 2000)
        offset += 1
    
    return result


def linear_search(array: List[int], target: int) -> Dict[str, Any]:
    """Linear search - O(n) complexity."""
    start_time = time.perf_counter()
    comparisons = 0
    
    for i, value in enumerate(array):
        comparisons += 1
        if value == target:
            elapsed = (time.perf_counter() - start_time) * 1000  # Convert to ms
            return {
                "found": True,
                "index": i,
                "comparisons": comparisons,
                "timeMs": elapsed
            }
    
    elapsed = (time.perf_counter() - start_time) * 1000  # Convert to ms
    return {
        "found": False,
        "index": -1,
        "comparisons": comparisons,
        "timeMs": elapsed
    }


def binary_search(array: List[int], target: int) -> Dict[str, Any]:
    """Binary search - O(log n) complexity."""
    start_time = time.perf_counter()
    comparisons = 0
    left = 0
    right = len(array) - 1
    
    while left <= right:
        comparisons += 1
        mid = (left + right) // 2
        mid_value = array[mid]
        
        if mid_value == target:
            elapsed = (time.perf_counter() - start_time) * 1000  # Convert to ms
            return {
                "found": True,
                "index": mid,
                "comparisons": comparisons,
                "timeMs": elapsed
            }
        elif mid_value < target:
            left = mid + 1
        else:
            right = mid - 1
    
    elapsed = (time.perf_counter() - start_time) * 1000  # Convert to ms
    return {
        "found": False,
        "index": -1,
        "comparisons": comparisons,
        "timeMs": elapsed
    }


# API Routes with /api/project2 prefix

@app.get("/api/project2/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "CSU 506 Project 2 API"}


@app.get("/api/project2/array-elements/{size}")
async def get_array_elements(size: int, array_type: str = "unsorted"):
    """
    Get array elements.
    
    Args:
        size: Number of elements (100-10000)
        array_type: 'unsorted' or 'sorted'
    
    Returns:
        Array of integers
    """
    if size < 1 or size > 10000:
        raise HTTPException(status_code=400, detail="Size must be between 1 and 10000")
    
    if array_type == "sorted":
        array = generate_sorted_array(size)
    else:
        array = generate_unsorted_array(size)
    
    return {
        "size": size,
        "type": array_type,
        "elements": array
    }


@app.post("/api/project2/linear-search")
async def perform_linear_search(search_value: int, array_size: int = 100):
    """
    Perform linear search on unsorted array.
    
    Args:
        search_value: Value to search for
        array_size: Size of array to generate
    
    Returns:
        Search result with found status, index, comparisons, and time
    """
    if array_size < 1 or array_size > 10000:
        raise HTTPException(status_code=400, detail="Array size must be between 1 and 10000")
    
    array = generate_unsorted_array(array_size)
    result = linear_search(array, search_value)
    
    return {
        "algorithm": "linear-search",
        "arraySize": array_size,
        "searchValue": search_value,
        "result": result
    }


@app.post("/api/project2/binary-search")
async def perform_binary_search(search_value: int, array_size: int = 100):
    """
    Perform binary search on sorted array.
    
    Args:
        search_value: Value to search for
        array_size: Size of array to generate
    
    Returns:
        Search result with found status, index, comparisons, and time
    """
    if array_size < 1 or array_size > 10000:
        raise HTTPException(status_code=400, detail="Array size must be between 1 and 10000")
    
    array = generate_sorted_array(array_size)
    result = binary_search(array, search_value)
    
    return {
        "algorithm": "binary-search",
        "arraySize": array_size,
        "searchValue": search_value,
        "result": result
    }


@app.get("/api/project2/benchmarks")
async def run_benchmarks():
    """
    Run performance benchmarks on different array sizes.
    
    Returns:
        Benchmark results comparing linear and binary search
    """
    sizes = [100, 1000, 10000]
    results = []
    
    for size in sizes:
        sorted_array = generate_sorted_array(size)
        # Target a value near the end to show worst case for linear
        target_value = sorted_array[int(size * 0.8)]
        
        linear_result = linear_search(sorted_array, target_value)
        binary_result = binary_search(sorted_array, target_value)
        
        results.append({
            "arraySize": size,
            "linearSearchTime": linear_result["timeMs"],
            "linearSearchComparisons": linear_result["comparisons"],
            "binarySearchTime": binary_result["timeMs"],
            "binarySearchComparisons": binary_result["comparisons"],
            "targetValue": target_value
        })
    
    return {
        "benchmarks": results
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
