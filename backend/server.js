const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize database
const db = new sqlite3.Database('./godot_community.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the godot_community database.');
});

// Server sudah siap tanpa inisialisasi tabel di sini
// Semua tabel dan data sampel sekarang dikelola oleh seed_data.js
// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, user) => {
        if (err || !user) return res.status(401).json({ message: "Login Gagal" });
        res.json({ userId: user.id, username: user.username });
    });
});

app.post('/signup', (req, res) => {
    const { username, email, password, role } = req.body;
    db.run(`INSERT INTO users (username, email, password, role, skill_level) VALUES (?, ?, ?, ?, ?)`,
        [username, email, password, role, 'Beginner'],
        function(err) {
            if (err) return res.status(500).json({ error: "Gagal register: " + err.message });
            res.json({ userId: this.lastID, username });
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

// Chat APIs
app.get('/messages/:roomId', (req, res) => {
    db.all(`SELECT m.*, u.username FROM messages m JOIN users u ON m.user_id = u.id WHERE m.room_id = ? ORDER BY m.timestamp ASC`, [req.params.roomId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/messages', (req, res) => {
    const { userId, roomId, content } = req.body;
    db.run(`INSERT INTO messages (user_id, room_id, content) VALUES (?, ?, ?)`, [userId, roomId, content], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// Cukup pasang ini agar Express otomatis membaca folder frontend kamu
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});