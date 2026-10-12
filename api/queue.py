from __future__ import annotations

import importlib.util
import os
import sysconfig
from typing import Generic, Iterable, TypeVar

Value = TypeVar("Value")


_stdlib_queue_path = os.path.join(sysconfig.get_paths()["stdlib"], "queue.py")
_stdlib_queue_spec = importlib.util.spec_from_file_location("_stdlib_queue", _stdlib_queue_path)
if _stdlib_queue_spec is not None and _stdlib_queue_spec.loader is not None:
    _stdlib_queue_module = importlib.util.module_from_spec(_stdlib_queue_spec)
    _stdlib_queue_spec.loader.exec_module(_stdlib_queue_module)
    for _name in dir(_stdlib_queue_module):
        if not _name.startswith("__") and _name not in {"Queue"}:
            globals()[_name] = getattr(_stdlib_queue_module, _name)


class Queue(Generic[Value]):
    """First-in, first-out collection backed by a Python list."""

    def __init__(self, values: Iterable[Value] | None = None) -> None:
        self._items = list(values or [])

    def enqueue(self, value: Value) -> None:
        self._items.append(value)

    def dequeue(self) -> Value:
        if self.isEmpty():
            raise IndexError("dequeue from empty queue")
        return self._items.pop(0)

    def front(self) -> Value:
        if self.isEmpty():
            raise IndexError("front from empty queue")
        return self._items[0]

    def isEmpty(self) -> bool:
        return not self._items

    def display(self) -> list[Value]:
        return list(self._items)

    def __len__(self) -> int:
        return len(self._items)
