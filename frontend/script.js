// Navigation Logic
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    document.getElementById(`page-${pageId}`).classList.add('active');
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(link.getAttribute('data-page'));
    });
});

// Chat Logic
let currentRoom = 'global';
async function loadMessages() {
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;

    const res = await fetch(`http://localhost:3000/messages/${currentRoom}`);
    const messages = await res.json();

    chatContainer.innerHTML = messages.map(m => `
        <div class="msg ${m.user_id == localStorage.getItem('userId') ? 'right' : 'left'}-msg">
            <div class="msg-bubble">
                <div class="msg-info">
                    <div class="msg-info-name">${m.username}</div>
                    <div class="msg-info-time">${new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                <div class="msg-text">${m.content}</div>
            </div>
        </div>
    `).join('');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function changeRoom(roomId) {
    currentRoom = roomId;
    loadMessages();
}

document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const content = input.value;
    if (!content) return;

    await fetch('http://localhost:3000/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: localStorage.getItem('userId'), roomId: currentRoom, content })
    });
    input.value = '';
    loadMessages();
});

// Refresh chat periodically
setInterval(loadMessages, 3000);

// Kemahiran Logic
function updateRank(projectCount) {
    const rankEl = document.getElementById('user-rank');
    let rank = "Beginner";
    if (projectCount > 10) rank = "Expert";
    else if (projectCount > 3) rank = "Intermediate";

    rankEl.innerText = rank;
    rankEl.className = `status-tag badge-${rank.toLowerCase()}`;
}

async function handleLogin() {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('userId', data.userId);
        document.getElementById('page-login').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
        init();
    } else {
        alert("Login Gagal!");
    }
}

// Initial Data Fetch
async function init() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    document.getElementById('page-login').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';

    loadProjects();
    loadMatchmaking('all');
}

// Render Projects di Dashboard
async function loadProjects() {
    const container = document.getElementById('dashboard-projects');
    if (!container) return; // Mencegah error jika elemen tidak ditemukan
    try {
        const res = await fetch('http://localhost:3000/projects');
        const projects = await res.json();
        container.innerHTML = projects.map(p => `
            <div class="card">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <small>By: ${p.username}</small>
            </div>
    `).join('');
    } catch (err) {
        console.error("Gagal load project:", err);
}
}

// Render Matchmaking dengan Filter
async function loadMatchmaking(role = 'all') {
    const container = document.getElementById('matchmaking-list');
    if (!container) return; // Mencegah error jika elemen tidak ditemukan

    try {
        const res = await fetch(`http://localhost:3000/matchmaking/${role}`);
        const talents = await res.json();

        if (talents.length === 0) {
            container.innerHTML = "<p>Belum ada talent.</p>";
            return;
        }

        container.innerHTML = talents.map(t => `
            <div class="talent-item">
                <div class="avatar-placeholder"></div>
                <div>
                    <div>${t.username}</div>
                    <div class="status-tag">${t.role}</div>
                    <div class="badge-${t.skill_level.toLowerCase()}">${t.skill_level}</div>
                </div>
            </div>
    `).join('');
    } catch (err) {
        console.error("Gagal load matchmaking:", err);
    }
}

// Tambahkan event listener untuk tombol filter
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => loadMatchmaking(btn.dataset.role));
});

init();

db.serialize(() => {
    // Pastikan tabel ada
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT,
        skill_level TEXT,
        project_title TEXT
    )`);

    // Tambahkan kolom jika belum ada (mengabaikan error jika kolom sudah ada)
    const columns = ['password', 'role', 'project_count'];
    columns.forEach(col => {
        db.run(`ALTER TABLE users ADD COLUMN ${col} TEXT`, (err) => {
            if (err) console.log(`Kolom ${col} mungkin sudah ada atau terjadi kesalahan.`);
        });
    });

    // Update data sampel setelah kolom dipastikan ada
    db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
        if (row && row.count < 5) {
            const stmt = db.prepare(`INSERT OR IGNORE INTO users (username, email, skill_level, project_title, password, role, project_count) VALUES (?, ?, ?, ?, ?, ?, ?)`);
            stmt.run("GodotNewbie", "newbie@example.com", "Beginner", "First Platformer", "123", "Programmer", 1);
            stmt.run("Artist2D", "art2d@godotech.com", "Beginner", "Pixel Art Pack", "123", "2D Artist", 1);
            stmt.run("Artist3D", "art3d@godotech.com", "Intermediate", "Low Poly Assets", "123", "3D Artist", 5);
            stmt.run("SoundDev", "sound@godotech.com", "Expert", "Godot SFX", "123", "Sound Designer", 12);
            stmt.finalize();
            console.log("Sample users updated/inserted.");
        }
    });
});

