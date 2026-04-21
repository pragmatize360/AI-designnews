#!/bin/bash
# Script to sync curated sources with the API database

API_URL="http://localhost:3000/api/admin/sources/sync-curated"

# POST to the sync endpoint
curl -X POST "$API_URL"

if [ $? -eq 0 ]; then
  echo "Sources sync triggered successfully."
else
  echo "Failed to trigger sources sync. Is the server running?"
fi
