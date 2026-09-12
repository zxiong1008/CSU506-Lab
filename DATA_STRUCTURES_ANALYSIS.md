# Linear Data Structures Analysis

## Overview

The four implementations in `api/data_structures.py` all store a sequence of
values, but each exposes a different rule for adding and removing data. Choosing
the rule that matches the problem makes an algorithm easier to reason about and
can avoid unnecessary work. The implementations deliberately use Python lists
for the Stack, Queue, and Deque so that the costs of list operations are visible.
The LinkedList uses nodes connected by references, which demonstrates a
different trade-off between access and insertion.

## Stack

A Stack is last-in, first-out (LIFO): the most recently pushed value is the
first value returned by `pop`. `push`, `pop`, and `peek` operate at the end of a
Python list and are normally O(1) amortized. A stack is appropriate when work
must be reversed or nested work must be completed before its caller. Common
examples are browser back history, undo operations, function-call management,
depth-first search, and matching delimiters.

The included `are_delimiters_balanced` algorithm pushes opening delimiters and
requires each closing delimiter to match the most recent opening delimiter.
This is a direct fit for LIFO behavior: a queue would lose the nesting order.
The main weakness of a stack is that it does not support fair processing of
items waiting in arrival order.

## Queue

A Queue is first-in, first-out (FIFO): an item waits behind earlier arrivals.
`enqueue` appends to the list and `dequeue` removes index zero. Appending is
O(1) amortized, but removing from the front of a Python list is O(n) because
the remaining elements must shift. A Queue is still the clearest model for
printer jobs, customer service, breadth-first search, network buffering, and
round-robin scheduling.

The `round_robin_schedule` example gives each task one turn, then puts it back
at the rear. This prevents a task from monopolizing the processor and shows why
FIFO ordering matters. For production code with frequent removals at the front,
`collections.deque` would improve the implementation to O(1) at both ends;
this coursework version keeps the requested Python-list representation.

## Deque

A Deque, or double-ended queue, permits insertion and removal at both ends.
This makes it more flexible than a Stack or Queue and supports sliding windows,
task prioritization, undo/redo variants, and palindrome checks. In this list
implementation, rear operations are O(1) amortized while front insertion and
removal are O(n) because list elements shift. A standard-library deque would
make both ends O(1), but it would hide the list-performance lesson.

The `is_palindrome` example removes one character from the front and one from
the rear until the middle is reached. A Stack alone can inspect one direction,
and a Queue alone cannot efficiently compare both ends, so the Deque expresses
the algorithm most naturally.

## Linked List

A singly LinkedList stores each value in a node containing a value and a link to
the next node. Inserting at the head is O(1), and deleting by value is O(n)
because the list must first find the matching node. Searching and displaying all
values are also O(n), and indexed access is O(n) because nodes are visited
sequentially. Unlike a Python list, nodes do not need a contiguous block of
memory and inserting at the head does not shift existing values.

The trade-off is extra memory for links and poor random access. Linked lists are
useful when a program performs many local insertions and removals, or when a
sequence grows without shifting a large contiguous array. They are less useful
when the program frequently asks for the value at a numeric index; a Python
list is better for that workload. The included duplicate-removal example uses
a linked list to preserve first-seen order after filtering repeated values.

## Performance Comparison

| Structure | Main operations | Typical cost in this implementation | Best fit |
| --- | --- | --- | --- |
| Stack | push, pop, peek | O(1) amortized | nested or reversible work |
| Queue | enqueue, front, dequeue | O(1), O(1), O(n) | fair arrival-order processing |
| Deque | add/remove at either end | rear O(1), front O(n) | compare or process both ends |
| LinkedList | insert at head, search, delete by value | O(1), O(n), O(n) | frequent head insertion and sequential traversal |

`benchmark_operations()` measures representative operations in milliseconds,
but timing is hardware- and workload-dependent. Big O complexity is the more
reliable comparison: it predicts how operation cost changes as the collection
grows. The test program validates both the individual operations and the
problem-solving examples with `python api/test_data_structures.py`.

## Conclusion

No structure is universally fastest. Use a Stack for LIFO dependency chains, a
Queue for FIFO fairness, a Deque when both ends matter, and a LinkedList when
linked sequential storage and local insertion are more important than random
access. In real applications, the standard library often provides optimized
versions, but implementing these structures directly makes their behavior,
invariants, and performance trade-offs explicit.