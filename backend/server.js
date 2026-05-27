const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize database
const db = new sqlite3.Database('./godot_community.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the godot_community database.');
});

// Create table and insert sample data
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT,
        skill_level TEXT,
        project_title TEXT
    )`);

    // Check if table is empty before inserting
    db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare(`INSERT INTO users (username, email, skill_level, project_title) VALUES (?, ?, ?, ?)`);
            stmt.run("GodotNewbie", "newbie@example.com", "Beginner", "First Platformer");
            stmt.run("GodoDev", "dev@example.com", "Intermediate", "2D RPG Engine");
            stmt.run("MasterGodot", "master@example.com", "Expert", "3D Open World RPG");
            stmt.finalize();
            console.log("Sample data inserted.");
        }
    });
});

// GET all users
app.get('/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET users by skill_level
app.get('/users/skill/:level', (req, res) => {
    const { level } = req.params;
    db.all(`SELECT * FROM users WHERE skill_level = ?`, [level], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
