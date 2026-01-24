#!/bin/bash

# Blog API Test Script
# This script demonstrates all the endpoints of the Blog API

BASE_URL="http://localhost:3000"

echo "==================================="
echo "Blog API Test Script"
echo "==================================="
echo ""

# Test 1: Get all posts
echo "1. GET /posts - Get all posts"
curl -s "$BASE_URL/posts" | jq '.'
echo ""
echo ""

# Test 2: Get all posts with pagination
echo "2. GET /posts?limit=1&offset=0 - Get posts with pagination"
curl -s "$BASE_URL/posts?limit=1&offset=0" | jq '.'
echo ""
echo ""

# Test 3: Get a specific post
echo "3. GET /posts/1 - Get post by ID"
curl -s "$BASE_URL/posts/1" | jq '.'
echo ""
echo ""

# Test 4: Create a new post
echo "4. POST /posts - Create a new post"
NEW_POST=$(curl -s -X POST "$BASE_URL/posts" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Blog Post",
    "content": "This is the content of my new blog post about TypeScript and OpenAPI!",
    "author": "Test User"
  }')
echo "$NEW_POST" | jq '.'
NEW_POST_ID=$(echo "$NEW_POST" | jq -r '.id')
echo ""
echo ""

# Test 5: Get the newly created post
echo "5. GET /posts/$NEW_POST_ID - Get the newly created post"
curl -s "$BASE_URL/posts/$NEW_POST_ID" | jq '.'
echo ""
echo ""

# Test 6: Update the post
echo "6. PUT /posts/$NEW_POST_ID - Update the post"
curl -s -X PUT "$BASE_URL/posts/$NEW_POST_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Blog Post Title",
    "content": "This is the updated content!"
  }' | jq '.'
echo ""
echo ""

# Test 7: Get comments for post 1
echo "7. GET /posts/1/comments - Get comments for post 1"
curl -s "$BASE_URL/posts/1/comments" | jq '.'
echo ""
echo ""

# Test 8: Add a comment to post 1
echo "8. POST /posts/1/comments - Add a comment"
curl -s -X POST "$BASE_URL/posts/1/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Great article! Very informative.",
    "author": "Jane Doe"
  }' | jq '.'
echo ""
echo ""

# Test 9: Get comments again to see the new one
echo "9. GET /posts/1/comments - Get comments again"
curl -s "$BASE_URL/posts/1/comments" | jq '.'
echo ""
echo ""

# Test 10: Test 404 - Non-existent post
echo "10. GET /posts/999999 - Test 404 for non-existent post"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/posts/999999"
echo ""
echo ""

# Test 11: View OpenAPI spec
echo "11. GET /openapi.json - View OpenAPI specification"
curl -s "$BASE_URL/openapi.json" | jq '.info, .paths | keys'
echo ""
echo ""

echo "==================================="
echo "All tests completed!"
echo "==================================="
