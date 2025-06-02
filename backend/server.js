const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./src/database'); // This initializes the DB connection as database.js is executed upon require

const postRoutes = require('./src/routes/posts');
const categoryRoutes = require('./src/routes/categories');
const tagRoutes = require('./src/routes/tags');

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
// For development, allow all origins. For production, configure specific origins.
// Example: const corsOptions = { origin: 'https://yourfrontenddomain.com' }; app.use(cors(corsOptions));
app.use(cors()); 
app.use(express.json()); // Parse JSON request bodies

// API Routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);

// Serve frontend static files in production
// Ensure this path correctly points to your frontend's build directory
const frontendBuildPath = path.resolve(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

// For any GET request that doesn't match an API route or a static file,
// serve the frontend's index.html file. This is crucial for client-side routing (SPA).
app.get('*', (req, res, next) => {
  // Check if the request is for an API endpoint. If so, it means no API route handled it.
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  // Otherwise, serve the frontend's main HTML file for SPA routing
  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      // Avoid sending another response if headers already sent (e.g. by express.static)
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error serving frontend application. Is index.html present in the build directory?' });
      }
    }
  });
});

// Global error handler
// This will catch errors passed by next(err) or synchronous errors in middleware/routes.
// For Express 4, async errors in route handlers need to be explicitly passed to next() or use a helper library like 'express-async-errors'.
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  if (res.headersSent) {
    return next(err); // Delegate to default Express error handler if response already started
  }
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong on the server!'
  });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Serving frontend application from:', frontendBuildPath);
  console.log('API endpoints are available under /api');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
        process.exit(1);
      }
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});

module.exports = app; // Export for potential testing
