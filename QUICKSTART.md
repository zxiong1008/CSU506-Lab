# 🚀 Quick Start Guide - CSU 506 Project 2 with Docker API

## Project Structure

```
CSU506-Lab/
├── api/                          # Python FastAPI Backend
│   ├── main.py                  # FastAPI application (all endpoints)
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile               # Container configuration
│   ├── .dockerignore            # Files to exclude from Docker build
│   └── README.md                # Detailed API documentation
├── csu506-app/                  # React Frontend
│   ├── src/
│   │   ├── SearchAlgorithmTool.tsx  # Main component (uses local functions)
│   │   ├── apiClient.ts             # NEW: API utility functions
│   │   ├── searchUtils.ts           # Local algorithm implementations
│   │   └── ...
│   ├── Dockerfile.frontend      # Frontend container configuration
│   └── .env.example             # Environment variables template
├── docker-compose.yml           # Docker orchestration (run everything)
└── QUICKSTART.md               # This file
```

## ⚡ Option 1: Fastest Setup (Recommended)

### One Command to Run Everything:

```bash
# From CSU506-Lab directory
cd "c:\Users\Admin\Desktop\CSUG\CSU506-Lab"
docker-compose up
```

**Then access:**
- Frontend: http://localhost:5173
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs (interactive Swagger UI)

**Stop everything:**
```bash
docker-compose down
```

---

## 🐳 Option 2: Run API Only in Docker

### Start just the API backend:

```bash
cd api
docker build -t csu506-api .
docker run -p 8000:8000 csu506-api
```

**Then run frontend separately:**
```bash
cd csu506-app
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- API: http://localhost:8000

---

## 💻 Option 3: Run Locally (Development)

### Prerequisites:
- Python 3.11+
- Node.js 18+

### Start API:
```bash
cd api
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

### In another terminal, start Frontend:
```bash
cd csu506-app
npm install  # if first time
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- API: http://localhost:8000

---

## 📋 API Endpoints (All have `/api/project2` prefix)

### Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| GET | `/array-elements/{size}?array_type=unsorted\|sorted` | Get array data |
| POST | `/linear-search` | Linear search O(n) |
| POST | `/binary-search` | Binary search O(log n) |
| GET | `/benchmarks` | Performance comparison |

### Example Requests

```bash
# Health check
curl http://localhost:8000/api/project2/health

# Get 100 unsorted elements
curl http://localhost:8000/api/project2/array-elements/100?array_type=unsorted

# Linear search for value 345 in 100 elements
curl -X POST http://localhost:8000/api/project2/linear-search \
  -H "Content-Type: application/json" \
  -d '{"search_value": 345, "array_size": 100}'

# Run all benchmarks
curl http://localhost:8000/api/project2/benchmarks
```

---

## 🔄 Switching Frontend to Use API

### Current: Local Execution
The frontend currently uses local JavaScript functions.

### To Enable API:
Edit `csu506-app/src/SearchAlgorithmTool.tsx`:

**Change from:**
```typescript
import { linearSearch, binarySearch, ... } from './searchUtils'
```

**To:**
```typescript
import { linearSearchAPI, binarySearchAPI, ... } from './apiClient'
```

Then update the `handleSearch` function to use:
```typescript
searchResult = await linearSearchAPI(target, arraySize)
```

---

## 🌐 Environment Variables

### Frontend (.env.local)
Create in `csu506-app/`:
```env
VITE_API_URL=http://localhost:8000
```

### Docker Compose
Edit `docker-compose.yml` to change ports or environment:
```yaml
api:
  ports:
    - "8001:8000"  # Use port 8001 instead of 8000
frontend:
  environment:
    - VITE_API_URL=http://localhost:8001
```

---

## 📊 What Each Component Does

### Python API (`api/main.py`)

**Features:**
- ✅ Linear search implementation (O(n))
- ✅ Binary search implementation (O(log n))
- ✅ Static data arrays (consistent across runs)
- ✅ Performance benchmarking
- ✅ CORS enabled for frontend
- ✅ Auto-documentation at `/docs`
- ✅ Health checks
- ✅ Error handling

**Endpoints have `/api/project2` prefix for organization**

### React Frontend (`csu506-app/`)

**Features:**
- ✅ Algorithm selection (Linear vs Binary)
- ✅ Array size control (100-10,000 elements)
- ✅ Interactive search interface
- ✅ Results display (found/not found, index, comparisons, time)
- ✅ Benchmark runner
- ✅ Big O notation education
- ✅ Array element table
- ✅ Works with local functions OR API

---

## 🛠️ Troubleshooting

### Problem: "Port 8000 already in use"
```bash
# Kill process on Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -i :8000
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Problem: "Cannot connect to API from frontend"
1. Check if API is running: `curl http://localhost:8000/api/project2/health`
2. Check `.env.local` has correct `VITE_API_URL`
3. Check browser console (F12) for CORS errors
4. Verify port in docker-compose.yml matches your setup

### Problem: "ModuleNotFoundError" in Python API
```bash
# Reinstall dependencies
cd api
pip install -r requirements.txt --force-reinstall

# Or rebuild Docker image
docker-compose up --build
```

### Problem: "npm run build fails"
```bash
# Clear cache and reinstall
cd csu506-app
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📈 Performance Notes

**Local Execution** (Current):
- ✅ No network latency
- ✅ Instant results
- ✅ No server dependency
- ❌ Runs in browser (may be slower for large datasets)

**API Execution**:
- ❌ Network latency (~1-5ms)
- ✅ Better for large datasets (10,000+ elements)
- ✅ Server-side computation
- ✅ Scalable
- ✅ Better for production

---

## 📚 Further Reading

- **API Details**: See `api/README.md`
- **Interactive API Docs**: http://localhost:8000/docs (when running)
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Docker Docs**: https://docs.docker.com/

---

## 🎯 Next Steps

1. **Start containers**: `docker-compose up`
2. **Access frontend**: http://localhost:5173
3. **Try the tool**: Select algorithm, enter search value
4. **View API docs**: http://localhost:8000/docs
5. **Run benchmarks**: Click "Run Performance Benchmarks"
6. **Switch to API mode**: Edit SearchAlgorithmTool.tsx (optional)

---

## ✅ Verification Checklist

After starting the stack, verify:

- [ ] Frontend loads at http://localhost:5173
- [ ] API responds to `curl http://localhost:8000/api/project2/health`
- [ ] Search works (try finding a value)
- [ ] Benchmarks run successfully
- [ ] Array table displays elements
- [ ] Big O analysis section appears
- [ ] No errors in browser console (F12)
- [ ] No errors in Docker logs (`docker-compose logs`)

---

## 💡 Pro Tips

### View API Documentation
Open http://localhost:8000/docs in your browser while API is running. You can test all endpoints interactively!

### Monitor Docker Logs
```bash
# All services
docker-compose logs -f

# Just API
docker-compose logs -f api

# Just Frontend
docker-compose logs -f frontend
```

### Development Workflow
```bash
# Terminal 1: Start Docker
docker-compose up

# Terminal 2: Frontend hot-reload (optional)
cd csu506-app && npm run dev

# Terminal 3: Test API
curl http://localhost:8000/api/project2/health
```

### Building a Production Image
```bash
# Build optimized images
docker-compose build --no-cache

# Push to registry
docker tag csu506-project2-api your-registry/csu506-project2-api
docker push your-registry/csu506-project2-api
```

---

**🎉 You're all set!** Enjoy exploring the search algorithms with the power of Docker and microservices! 🚀
