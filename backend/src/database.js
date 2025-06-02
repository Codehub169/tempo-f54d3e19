const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database file.
// This will create database.sqlite in the 'backend' directory (parent of 'src').
const dbPath = path.resolve(__dirname, '../database.sqlite');

let db;

try {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      // Exit process if DB connection fails, as the app cannot function
      process.exit(1);
    } else {
      console.log('Successfully connected to the SQLite database at', dbPath);
      // Enable foreign key constraint enforcement for SQLite
      // This is important for data integrity.
      db.exec('PRAGMA foreign_keys = ON;', (error) => {
        if (error) {
          console.error("Failed to enable foreign key support:", error.message);
          // Depending on strictness, you might consider exiting here too
        } else {
          console.log("Foreign key support enabled for SQLite.");
        }
      });
      // Placeholder for schema initialization (migrations)
      // In a real application, use a migration tool or a more robust schema setup.
      // Example: 
      // db.serialize(() => {
      //   db.exec(`CREATE TABLE IF NOT EXISTS posts (...)`, (e) => { if(e) console.error('Schema creation error (posts):', e); });
      //   db.exec(`CREATE TABLE IF NOT EXISTS categories (...)`, (e) => { if(e) console.error('Schema creation error (categories):', e); });
      //   // Add other tables as needed
      // });
    }
  });
} catch (error) {
  console.error('Synchronous error during SQLite database instantiation:', error.message);
  process.exit(1);
}

module.exports = db;
