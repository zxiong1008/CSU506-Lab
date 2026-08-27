#!/usr/bin/env python3
"""
API Test Script for CSU 506 Project 2
Tests all endpoints to verify the API is working correctly
"""

import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api/project2"

class APITester:
    def __init__(self, base_url: str = API_URL):
        self.base_url = base_url
        self.tests_passed = 0
        self.tests_failed = 0

    def print_test(self, name: str, success: bool, response: Any = None):
        """Print test result."""
        status = "✓ PASS" if success else "✗ FAIL"
        print(f"\n{status}: {name}")
        if response and success:
            if isinstance(response, dict):
                print(f"  Response: {json.dumps(response, indent=2)[:200]}...")
            else:
                print(f"  Response: {str(response)[:200]}...")
        elif response and not success:
            print(f"  Error: {response}")
        
        if success:
            self.tests_passed += 1
        else:
            self.tests_failed += 1

    def test_health(self):
        """Test health check endpoint."""
        try:
            response = requests.get(f"{self.base_url}/health")
            self.print_test("Health Check", response.status_code == 200, response.json())
        except Exception as e:
            self.print_test("Health Check", False, str(e))

    def test_get_array_unsorted(self):
        """Test getting unsorted array."""
        try:
            response = requests.get(f"{self.base_url}/array-elements/100?array_type=unsorted")
            success = response.status_code == 200
            if success:
                data = response.json()
                success = "elements" in data and len(data["elements"]) == 100
            self.print_test("Get Unsorted Array (100 elements)", success, response.json() if success else response.text)
        except Exception as e:
            self.print_test("Get Unsorted Array", False, str(e))

    def test_get_array_sorted(self):
        """Test getting sorted array."""
        try:
            response = requests.get(f"{self.base_url}/array-elements/100?array_type=sorted")
            success = response.status_code == 200
            if success:
                data = response.json()
                success = "elements" in data and len(data["elements"]) == 100
            self.print_test("Get Sorted Array (100 elements)", success, response.json() if success else response.text)
        except Exception as e:
            self.print_test("Get Sorted Array", False, str(e))

    def test_linear_search(self):
        """Test linear search."""
        try:
            payload = {
                "search_value": 345,
                "array_size": 100
            }
            response = requests.post(f"{self.base_url}/linear-search", json=payload)
            success = response.status_code == 200
            if success:
                data = response.json()
                success = "result" in data and "timeMs" in data["result"]
            self.print_test("Linear Search", success, response.json() if success else response.text)
        except Exception as e:
            self.print_test("Linear Search", False, str(e))

    def test_binary_search(self):
        """Test binary search."""
        try:
            payload = {
                "search_value": 345,
                "array_size": 100
            }
            response = requests.post(f"{self.base_url}/binary-search", json=payload)
            success = response.status_code == 200
            if success:
                data = response.json()
                success = "result" in data and "timeMs" in data["result"]
            self.print_test("Binary Search", success, response.json() if success else response.text)
        except Exception as e:
            self.print_test("Binary Search", False, str(e))

    def test_benchmarks(self):
        """Test benchmarks endpoint."""
        try:
            response = requests.get(f"{self.base_url}/benchmarks")
            success = response.status_code == 200
            if success:
                data = response.json()
                success = "benchmarks" in data and len(data["benchmarks"]) == 3
            self.print_test("Benchmarks", success, response.json() if success else response.text)
        except Exception as e:
            self.print_test("Benchmarks", False, str(e))

    def test_invalid_size(self):
        """Test error handling with invalid size."""
        try:
            response = requests.get(f"{self.base_url}/array-elements/50000?array_type=unsorted")
            success = response.status_code == 400  # Should return bad request
            self.print_test("Error Handling (Invalid Size)", success, f"Status: {response.status_code}")
        except Exception as e:
            self.print_test("Error Handling (Invalid Size)", False, str(e))

    def run_all_tests(self):
        """Run all tests."""
        print("=" * 60)
        print("CSU 506 Project 2 - API Test Suite")
        print(f"Testing API at: {self.base_url}")
        print("=" * 60)

        self.test_health()
        self.test_get_array_unsorted()
        self.test_get_array_sorted()
        self.test_linear_search()
        self.test_binary_search()
        self.test_benchmarks()
        self.test_invalid_size()

        print("\n" + "=" * 60)
        print(f"Results: {self.tests_passed} passed, {self.tests_failed} failed")
        print("=" * 60)

        if self.tests_failed == 0:
            print("\n✓ All tests passed! API is working correctly.")
            return True
        else:
            print(f"\n✗ {self.tests_failed} test(s) failed. Check the API is running.")
            return False


if __name__ == "__main__":
    import sys
    
    # Allow custom base URL as argument
    api_url = sys.argv[1] if len(sys.argv) > 1 else API_URL
    
    tester = APITester(api_url)
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)
