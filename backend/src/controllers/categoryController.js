const db = require('../database');

// Get all categories
exports.getAllCategories = (req, res) => {
    db.all("SELECT * FROM categories ORDER BY name ASC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
};

// Get a single category by ID
exports.getCategoryById = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM categories WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.json({ data: row });
    });
};

// Create a new category
exports.createCategory = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    db.run("INSERT INTO categories (name) VALUES (?)", [name], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Category created successfully', data: { id: this.lastID, name } });
    });
};

// Update an existing category
exports.updateCategory = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    db.run("UPDATE categories SET name = ? WHERE id = ?", [name, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.json({ message: 'Category updated successfully', data: { id, name } });
    });
};

// Delete a category
exports.deleteCategory = (req, res) => {
    const { id } = req.params;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION;");
        // Remove associations from post_categories
        db.run("DELETE FROM post_categories WHERE category_id = ?", [id], function(err) {
            if (err) {
                db.run("ROLLBACK;");
                res.status(500).json({ error: `Failed to remove category associations: ${err.message}` });
                return;
            }
        });

        db.run("DELETE FROM categories WHERE id = ?", [id], function(err) {
            if (err) {
                db.run("ROLLBACK;");
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                db.run("ROLLBACK;");
                res.status(404).json({ message: 'Category not found' });
                return;
            }
            db.run("COMMIT;");
            res.json({ message: 'Category deleted successfully' });
        });
    });
};