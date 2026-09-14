# Project 4: Linear Data Structure Lab

## Overview

Project 4 adds a complete linear-data-structure study to the CSU 506 coursework app. It is implemented independently from Project 1 and focuses on four separate structures: a list-backed Stack, Queue, and Deque, plus a singly LinkedList.

## Source files

- `api/stack.py`: `push`, `pop`, `peek`, and `isEmpty`.
- `api/queue.py`: `enqueue`, `dequeue`, `front`, and `isEmpty`.
- `api/deque.py`: `addFront`, `addRear`, `removeFront`, `removeRear`, and `isEmpty`.
- `api/linked_list.py`: `insert`, `delete`, `search`, and `display`.
- `api/data_structures.py`: four problem-solving algorithms and benchmark orchestration.
- `api/test_data_structures.py`: unit tests for operations, examples, and benchmark output.
- `csu506-app/src/Project4Requirements.tsx`: requirements and deliverables page.
- `csu506-app/src/Project4Tool.tsx`: interactive test program and performance snapshot.

## Problem-solving examples

1. **Balanced delimiters:** a Stack matches closing symbols with the most recent opening symbol.
2. **Round-robin scheduling:** a Queue cycles tasks fairly by moving the front task to the rear after each time slice.
3. **Palindrome checking:** a Deque compares characters from both ends until the middle is reached.
4. **Duplicate removal:** a LinkedList stores first-seen values while a set tracks membership.

## Verification

From the repository root:

```powershell
Push-Location api
python -m unittest test_data_structures.py
python -m py_compile main.py data_structures.py stack.py queue.py deque.py linked_list.py
Pop-Location

Push-Location csu506-app
npm run build
Pop-Location
```

The FastAPI endpoints are `/api/project4/health`, `/api/project4/examples`, and `/api/project4/benchmarks?size=1000`.
