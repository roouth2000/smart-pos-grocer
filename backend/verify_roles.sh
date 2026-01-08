#!/bin/bash

# Create Permission
echo "Creating Permission..."
PERM_RESPONSE=$(curl -s -X POST http://localhost:5000/api/permissions \
  -H "Content-Type: application/json" \
  -d '{"name": "Create Product", "slug": "create-product", "group_name": "Product"}')
echo $PERM_RESPONSE

PERM_ID=$(echo $PERM_RESPONSE | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$PERM_ID" ]; then
  echo "Failed to create permission or extract ID"
  exit 1
fi

echo "Created Permission ID: $PERM_ID"

# Create Role
echo "Creating Role..."
ROLE_RESPONSE=$(curl -s -X POST http://localhost:5000/api/roles \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Product Manager\", \"slug\": \"product-manager\", \"permissions\": [\"$PERM_ID\"]}")
echo $ROLE_RESPONSE

# List Roles
echo "Listing Roles..."
curl -s http://localhost:5000/api/roles
