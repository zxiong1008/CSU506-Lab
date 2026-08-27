# CSU 506 Project 2 - Python API with Docker

This folder contains a Python FastAPI backend for the Search Algorithm Comparison Tool. The API handles all algorithm operations and can be run in Docker.

## 📋 API Endpoints

All endpoints are prefixed with `/api/project2`

### Health Check
- **GET** `/api/project2/health`
  - Returns: `{ "status": "healthy", "service": "CSU 506 Project 2 API" }`

### Array Elements
- **GET** `/api/project2/array-elements/{size}?array_type=unsorted|sorted`
  - Parameters:
    - `size`: Integer (1-10000) - number of elements
    - `array_type`: 'unsorted' or 'sorted' (default: 'unsorted')
  - Returns: `{ "size": int, "type": string, "elements": [int] }`

### Linear Search
- **POST** `/api/project2/linear-search`
  - Body: `{ "search_value": int, "array_size": int }`
  - Returns: 
    ```json
    {
      "algorithm": "linear-search",
      "arraySize": int,
      "searchValue": int,
      "result": {
        "found": bool,
        "index": int,
        "comparisons": int,
        "timeMs": float
      }
    }
    ```

### Binary Search
- **POST** `/api/project2/binary-search`
  - Body: `{ "search_value": int, "array_size": int }`
  - Returns: Same structure as linear search

### Benchmarks
- **GET** `/api/project2/benchmarks`
  - Returns: 
    ```json
    {
      "benchmarks": [
        {
          "arraySize": int,
          "linearSearchTime": float,
          "linearSearchComparisons": int,
          "binarySearchTime": float,
          "binarySearchComparisons": int,
          "targetValue": int
        }
      ]
    }
    ```

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

**Prerequisites:** Docker and Docker Compose installed

```bash
# From the project root directory
cd CSU506-Lab

# Start both API and frontend
docker-compose up

# Access:
# - Frontend: http://localhost:5173
# - API: http://localhost:8000
# - API Docs: http://localhost:8000/docs
```

### Option 2: Run API Only (Docker)

```bash
# Navigate to api directory
cd CSU506-Lab/api

# Build the image
docker build -t csu506-project2-api .

# Run the container
docker run -p 8000:8000 csu506-project2-api

# Access API at http://localhost:8000
```

### Option 3: Run API Locally (Development)

**Prerequisites:** Python 3.11+

```bash
# Navigate to api directory
cd CSU506-Lab/api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py

# Or use uvicorn directly:
uvicorn main:app --reload

# Access API at http://localhost:8000
```

## 📚 API Documentation

Once the API is running, interactive API documentation is available at:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

You can test all endpoints directly from the browser!

## 🔌 Connecting Frontend to API

### Development Mode

Set the API URL in your React environment. Create a `.env.local` file in `csu506-app/`:

```env
VITE_API_URL=http://localhost:8000
```

Or it defaults to `http://localhost:8000` if not specified.

### To Use the API Instead of Local Functions

The React component (`SearchAlgorithmTool.tsx`) includes an `apiClient.ts` utility with these functions:

```typescript
import {
  linearSearchAPI,
  binarySearchAPI,
  getArrayElementsAPI,
  runBenchmarksAPI,
  healthCheckAPI
} from './apiClient'

// Use instead of local functions
const result = await linearSearchAPI(searchValue, arraySize)
const array = await getArrayElementsAPI(size, 'unsorted')
const benchmarks = await runBenchmarksAPI()
```

## 📦 Docker Details

### Dockerfile Structure
- Base image: `python:3.11-slim` (lightweight)
- Working directory: `/app`
- Exposed port: `8000`
- Health check: Pings the API every 30 seconds

### docker-compose.yml Services
1. **api** - Python FastAPI backend (port 8000)
2. **frontend** - React Vite app (port 5173)

Services automatically restart unless manually stopped.

## 🛠️ Development Workflow

### Running the Full Stack

```bash
# Terminal 1: Start Docker containers
docker-compose up

# Terminal 2: Optional - run dev server for hot reload
cd csu506-app
npm run dev

# Terminal 3: Check API health
curl http://localhost:8000/api/project2/health
```

### Making Code Changes

**API Changes:**
```bash
# If you modify main.py, the container will auto-reload if using:
docker-compose up

# Or rebuild:
docker-compose up --build
```

**Frontend Changes:**
```bash
# Use npm run dev for hot reload in development
cd csu506-app
npm run dev
```

## ⚙️ Configuration

### Environment Variables

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:8000
```

**Docker Compose:**
Modify in `docker-compose.yml`:
```yaml
environment:
  - PYTHONUNBUFFERED=1
  - API_PORT=8000
```

## 🐛 Troubleshooting

### API won't start
```bash
# Check if port 8000 is already in use
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process or use a different port
docker-compose.yml -> ports: "8001:8000"
```

### Frontend can't connect to API
- Check if API is running: `curl http://localhost:8000/api/project2/health`
- Verify CORS is enabled (already in main.py)
- Check browser console for errors
- Ensure `VITE_API_URL` environment variable is set correctly

### Hot reload not working
- Add `volumes: - .:/app` to docker-compose.yml (already included)
- Ensure using `--reload` flag with uvicorn

## 📝 Example Usage

### Using cURL

```bash
# Health check
curl http://localhost:8000/api/project2/health

# Linear search
curl -X POST http://localhost:8000/api/project2/linear-search \
  -H "Content-Type: application/json" \
  -d '{"search_value": 345, "array_size": 100}'

# Binary search
curl -X POST http://localhost:8000/api/project2/binary-search \
  -H "Content-Type: application/json" \
  -d '{"search_value": 345, "array_size": 100}'

# Get array elements
curl "http://localhost:8000/api/project2/array-elements/100?array_type=unsorted"

# Run benchmarks
curl http://localhost:8000/api/project2/benchmarks
```

### Using JavaScript/Fetch

```javascript
// Import the API client
import { linearSearchAPI, binarySearchAPI } from './apiClient'

// Linear search
const result = await linearSearchAPI(345, 100)
console.log(result)
// Output: { found: true, index: 12, comparisons: 13, timeMs: 0.234 }

// Binary search
const result2 = await binarySearchAPI(345, 1000)
console.log(result2)
```

## 🔄 Switching Between Local and API

The codebase supports both local execution and API calls:

**Local Mode** (current):
```typescript
import { linearSearch, binarySearch } from './searchUtils'
searchResult = linearSearch(array, target)
```

**API Mode**:
```typescript
import { linearSearchAPI } from './apiClient'
searchResult = await linearSearchAPI(target, arraySize)
```

To switch: Update `SearchAlgorithmTool.tsx` to use the API functions.

## 📊 Performance Comparison

**Local Execution (Frontend):**
- Faster for small datasets
- Runs in browser, doesn't require network
- No server overhead

**API Execution (Backend):**
- Better for large datasets (10,000+ elements)
- Scalable - can handle multiple concurrent requests
- Server-side computation
- Enables analytics and logging
- Better separation of concerns

## 📞 Support

For issues or questions:
1. Check API documentation at `http://localhost:8000/docs`
2. Check console logs in browser DevTools
3. Check Docker logs: `docker-compose logs api`
4. Review error messages in `main.py` output

## 📄 License

Part of CSU 506 course project
