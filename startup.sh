#!/bin/bash
# This script is used to start the backend application

# Exit immediately if a command exits with a non-zero status.
set -e
# Treat unset variables as an error when substituting.
set -u
# Cause a pipeline to return the exit status of the last command in the pipe that returned a non-zero status.
set -o pipefail

# Navigate to the backend directory
# Assuming this script is run from the project root directory
cd backend

# Install dependencies
# If you are using npm:
echo "Installing dependencies..."
npm install
# If you are using yarn:
# echo "Installing dependencies..."
# yarn install

# Start the Node.js server using the npm start script
# This will execute the 'start' script defined in backend/package.json
echo "Starting backend server..."
npm start
