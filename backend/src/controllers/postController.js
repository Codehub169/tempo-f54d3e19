const db = require('../database'); // This will be created in a different batch

// Helper function to run database queries with promises
const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                console.error('DB run error:', err.message);
                reject(err);
            } else {
                resolve(this); // this contains lastID and changes
            }
        });
    });
};

const getQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                console.error('DB get error:', err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const allQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                console.error('DB all error:', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await allQuery('SELECT id, title, status, created_at, updated_at FROM posts ORDER BY updated_at DESC');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await getQuery('SELECT * FROM posts WHERE id = ?', [id]);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const categories = await allQuery(`
            SELECT c.id, c.name FROM categories c
            JOIN post_categories pc ON c.id = pc.category_id
            WHERE pc.post_id = ?
        `, [id]);

        const tags = await allQuery(`
            SELECT t.id, t.name FROM tags t
            JOIN post_tags pt ON t.id = pt.tag_id
            WHERE pt.post_id = ?
        `, [id]);

        res.json({ ...post, categories, tags });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    const { title, content, status, categoryIds = [], tagIds = [] } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    db.serialize(async () => {
        try {
            const result = await runQuery(
                'INSERT INTO posts (title, content, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
                [title, content, status || 'draft', createdAt, updatedAt]
            );
            const postId = result.lastID;

            for (const categoryId of categoryIds) {
                await runQuery('INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)', [postId, categoryId]);
            }

            for (const tagId of tagIds) {
                await runQuery('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tagId]);
            }
            
            const newPost = await getQuery('SELECT * FROM posts WHERE id = ?', [postId]);
            const categories = await allQuery('SELECT c.id, c.name FROM categories c JOIN post_categories pc ON c.id = pc.category_id WHERE pc.post_id = ?', [postId]);
            const tags = await allQuery('SELECT t.id, t.name FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?', [postId]);
            
            if (!res.headersSent) {
                res.status(201).json({ ...newPost, categories, tags });
            }

        } catch (error) {
            console.error("Error in createPost transaction:", error);
            if (!res.headersSent) {
                 res.status(500).json({ error: 'Failed to create post: ' + error.message });
            }
        }
    });
};


exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, status, categoryIds = [], tagIds = [] } = req.body;
    const updatedAt = new Date().toISOString();

    db.serialize(async () => {
        try {
            const postExists = await getQuery('SELECT id FROM posts WHERE id = ?', [id]);
            if (!postExists) {
                if (!res.headersSent) {
                    return res.status(404).json({ message: 'Post not found' });
                }
                return;
            }

            await runQuery(
                'UPDATE posts SET title = ?, content = ?, status = ?, updated_at = ? WHERE id = ?',
                [title, content, status, updatedAt, id]
            );

            await runQuery('DELETE FROM post_categories WHERE post_id = ?', [id]);
            await runQuery('DELETE FROM post_tags WHERE post_id = ?', [id]);

            for (const categoryId of categoryIds) {
                await runQuery('INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)', [id, categoryId]);
            }

            for (const tagId of tagIds) {
                await runQuery('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', [id, tagId]);
            }

            const updatedPost = await getQuery('SELECT * FROM posts WHERE id = ?', [id]);
            const categories = await allQuery('SELECT c.id, c.name FROM categories c JOIN post_categories pc ON c.id = pc.category_id WHERE pc.post_id = ?', [id]);
            const tags = await allQuery('SELECT t.id, t.name FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?', [id]);

            if (!res.headersSent) {
                 res.json({ ...updatedPost, categories, tags });
            }

        } catch (error) {
            console.error("Error in updatePost transaction:", error);
             if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to update post: ' + error.message });
            }
        }
    });
};

exports.deletePost = async (req, res) => {
    const { id } = req.params;

    db.serialize(async () => {
        try {
            const postExists = await getQuery('SELECT id FROM posts WHERE id = ?', [id]);
            if (!postExists) {
                if (!res.headersSent) {
                    return res.status(404).json({ message: 'Post not found' });
                }
                return;
            }

            await runQuery('DELETE FROM post_categories WHERE post_id = ?', [id]);
            await runQuery('DELETE FROM post_tags WHERE post_id = ?', [id]);
            await runQuery('DELETE FROM posts WHERE id = ?', [id]);
            
            if (!res.headersSent) {
                res.status(204).send();
            }

        } catch (error) {
            console.error("Error in deletePost transaction:", error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to delete post: ' + error.message });
            }
        }
    });
};