const db = require('../database');

// Get all tags
exports.getAllTags = (req, res) => {
    db.all("SELECT * FROM tags ORDER BY name ASC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
};

// Get a single tag by ID
exports.getTagById = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM tags WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }
        res.json({ data: row });
    });
};

// Create a new tag
exports.createTag = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    db.run("INSERT INTO tags (name) VALUES (?)", [name], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Tag created successfully', data: { id: this.lastID, name } });
    });
};

// Update an existing tag
exports.updateTag = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    db.run("UPDATE tags SET name = ? WHERE id = ?", [name, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }
        res.json({ message: 'Tag updated successfully', data: { id, name } });
    });
};

// Delete a tag
exports.deleteTag = (req, res) => {
    const { id } = req.params;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION;");
        // Remove associations from post_tags
        db.run("DELETE FROM post_tags WHERE tag_id = ?", [id], function(err) {
            if (err) {
                db.run("ROLLBACK;");
                res.status(500).json({ error: `Failed to remove tag associations: ${err.message}` });
                return;
            }
        });

        db.run("DELETE FROM tags WHERE id = ?", [id], function(err) {
            if (err) {
                db.run("ROLLBACK;");
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                db.run("ROLLBACK;");
                res.status(404).json({ message: 'Tag not found' });
                return;
            }
            db.run("COMMIT;");
            res.json({ message: 'Tag deleted successfully' });
        });
    });
};