"""Hash table implementation using chaining to resolve collisions."""

from __future__ import annotations

from typing import Generic, Hashable, TypeVar, Iterable

Key = TypeVar("Key", bound=Hashable)
Value = TypeVar("Value")


class HashTable(Generic[Key, Value]):
    """A simple hash table that stores key-value pairs in buckets.

    Collision handling uses chaining: each bucket is a dictionary of key -> value.
    This makes insertion, search, and deletion straightforward while allowing
    multiple distinct keys to share the same hash index without corruption.
    """

    def __init__(self, capacity: int = 17, load_factor: float = 0.75) -> None:
        if capacity <= 0:
            raise ValueError("capacity must be positive")
        if not 0 < load_factor < 1:
            raise ValueError("load factor must be between 0 and 1")

        self.capacity = capacity
        self.load_factor = load_factor
        self._buckets: list[dict[Key, Value]] = [{} for _ in range(capacity)]
        self._size = 0

    def _hash(self, key: Key) -> int:
        text = str(key)
        total = 0
        for index, character in enumerate(text):
            total += (index + 1) * ord(character)
        return total % self.capacity

    def _resize_if_needed(self) -> None:
        if self._size / self.capacity < self.load_factor:
            return

        previous_buckets = self._buckets
        self.capacity *= 2
        self._buckets = [{} for _ in range(self.capacity)]
        self._size = 0

        for bucket in previous_buckets:
            for key, value in bucket.items():
                self.insert(key, value)

    @property
    def size(self) -> int:
        return self._size

    def insert(self, key: Key, value: Value) -> None:
        index = self._hash(key)
        bucket = self._buckets[index]
        if key in bucket:
            bucket[key] = value
            return

        bucket[key] = value
        self._size += 1
        self._resize_if_needed()

    def search(self, key: Key) -> Value | None:
        bucket = self._buckets[self._hash(key)]
        return bucket.get(key)

    def get(self, key: Key) -> Value | None:
        return self.search(key)

    def contains(self, key: Key) -> bool:
        return key in self._buckets[self._hash(key)]

    def delete(self, key: Key) -> Value | None:
        bucket = self._buckets[self._hash(key)]
        if key not in bucket:
            return None

        value = bucket.pop(key)
        self._size -= 1
        return value

    def items(self) -> list[tuple[Key, Value]]:
        all_items: list[tuple[Key, Value]] = []
        for bucket in self._buckets:
            all_items.extend(bucket.items())
        return all_items

    def __len__(self) -> int:
        return self._size

    def __contains__(self, key: Key) -> bool:
        return self.contains(key)

    def __getitem__(self, key: Key) -> Value:
        value = self.search(key)
        if value is None:
            raise KeyError(key)
        return value

    def __setitem__(self, key: Key, value: Value) -> None:
        self.insert(key, value)

    def __delitem__(self, key: Key) -> None:
        deleted = self.delete(key)
        if deleted is None:
            raise KeyError(key)

    def __repr__(self) -> str:
        return f"HashTable(size={self._size}, capacity={self.capacity})"


__all__ = ["HashTable"]


def compare_hash_table_vs_linear_search(size: int = 200) -> dict[str, dict[str, float | int] | float]:
    """Measure average search time for hash table lookup versus linear search."""
    if size < 1:
        raise ValueError("size must be positive")

    from time import perf_counter

    records = [(f"key_{index}", index * 17 + 3) for index in range(size)]
    table = HashTable(capacity=max(17, size * 2))
    for key, value in records:
        table.insert(key, value)

    targets = [records[index][0] for index in range(0, size, 2)]

    start = perf_counter()
    for key in targets:
        table.search(key)
    hash_time = (perf_counter() - start) * 1000

    start = perf_counter()
    for key in targets:
        for candidate_key, candidate_value in records:
            if candidate_key == key:
                break
    linear_time = (perf_counter() - start) * 1000

    speedup = linear_time / hash_time if hash_time > 0 else 0.0
    return {
        "hash_table": {
            "time_ms": round(hash_time, 4),
            "lookups": len(targets),
            "capacity": table.capacity,
        },
        "linear_search": {
            "time_ms": round(linear_time, 4),
            "lookups": len(targets),
        },
        "speedup": round(speedup, 2),
    }
