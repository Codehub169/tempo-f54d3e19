#!/bin/bash
# This script is used to build the frontend and start the backend application.

# Exit immediately if a command exits with a non-zero status.
set -e
# Treat unset variables as an error when substituting.
set -u
# Cause a pipeline to return the exit status of the last command in the pipe that returned a non-zero status.
set -o pipefail

# Check if script is run from project root by verifying presence of frontend and backend directories
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
  echo "Error: This script must be run from the project root directory," >&2
  echo "which should contain 'frontend' and 'backend' subdirectories." >&2
  exit 1
fi

# Navigate to the frontend directory and build the frontend
echo "Navigating to frontend directory..."
cd frontend

echo "Installing frontend dependencies..."
npm install

echo "Building frontend application..."
npm run build

# Navigate back to the project root directory
echo "Navigating back to project root directory..."
cd ..

# Navigate to the backend directory
echo "Navigating to backend directory..."
cd backend

# Install backend dependencies
# If you are using npm:
echo "Installing backend dependencies..."
npm install
# If you are using yarn:
# echo "Installing backend dependencies..."
# yarn install

# Start the Node.js server using the npm start script
# This will execute the 'start' script defined in backend/package.json
echo "Starting backend server..."
npm start
