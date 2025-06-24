#!/bin/bash
set -e

# Wait for the database to be ready
until pg_isready -h postgres -U kaleel -d zero; do
  echo "Waiting for postgres..."
  sleep 2
done

# Seed the database
/app/db

# Start the backend
/app/host 