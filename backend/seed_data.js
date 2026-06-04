const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./godot_community.db');

db.serialize(() => {
    // 1. Buat Tabel
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, skill_level TEXT, project_title TEXT, password TEXT DEFAULT '123', role TEXT DEFAULT 'Programmer', project_count INTEGER DEFAULT 0)`);
    db.run(`CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, title TEXT, description TEXT, genre TEXT, status TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, room_id TEXT DEFAULT 'global', content TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    db.run(`CREATE TABLE IF NOT EXISTS rooms (id TEXT PRIMARY KEY, name TEXT)`);

    // 2. Isi Data Awal (Hanya room saja)
    db.run(`INSERT OR IGNORE INTO rooms (id, name) VALUES ('global', 'Global'), ('programmer', 'Programmer'), ('artist', 'Artist')`);
    
    console.log("Database & Tabel berhasil disiapkan (User kosong)!");
});
db.close();

