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

// Update tables and insert sample data
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT,
        skill_level TEXT,
        project_title TEXT,
        password TEXT DEFAULT '123',
        role TEXT DEFAULT 'Programmer',
        project_count INTEGER DEFAULT 0
    )`);

    // Tambahkan tabel projects di db.serialize
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        description TEXT,
        genre TEXT,
        status TEXT
    )`);

    // Check if sample data exists, if not, add it
    db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
        if (row.count < 5) {
            const stmt = db.prepare(`INSERT OR IGNORE INTO users (username, email, skill_level, project_title, role, project_count) VALUES (?, ?, ?, ?, ?, ?)`);
            stmt.run("GodotNewbie", "newbie@example.com", "Beginner", "First Platformer", "Programmer", 1);
            stmt.run("GodoDev", "dev@example.com", "Intermediate", "2D RPG Engine", "Programmer", 5);
            stmt.run("MasterGodot", "master@example.com", "Expert", "3D Open World RPG", "Programmer", 12);
            stmt.run("Artist2D", "art2d@godotech.com", "Beginner", "Pixel Art Pack", "2D Artist", 1);
            stmt.run("Artist3D", "art3d@godotech.com", "Intermediate", "Low Poly Assets", "3D Artist", 5);
            stmt.run("SoundDev", "sound@godotech.com", "Expert", "Godot SFX", "Sound Designer", 12);
            stmt.finalize();
            console.log("Sample users inserted.");
        }
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, user) => {
        if (err || !user) return res.status(401).json({ message: "Login Gagal" });
        res.json({ userId: user.id, username: user.username });
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

// API untuk ambil semua project
app.get('/projects', (req, res) => {
    db.all(`SELECT p.*, u.username FROM projects p JOIN users u ON p.user_id = u.id`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API untuk matchmaking (filter berdasarkan role)
app.get('/matchmaking/:role', (req, res) => {
    const role = req.params.role === 'all' ? '%' : req.params.role;
    db.all(`SELECT id, username, role, skill_level FROM users WHERE role LIKE ?`, [role], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

