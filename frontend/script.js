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
async function sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input.value) return;
    // Logika pengiriman API bisa ditambahkan di sini
    console.log("Mengirim:", input.value);
    input.value = '';
}

// Kemahiran Logic
function updateRank(projectCount) {
    const rankEl = document.getElementById('user-rank');
    let rank = "Beginner";
    if (projectCount > 10) rank = "Expert";
    else if (projectCount > 3) rank = "Intermediate";
    
    rankEl.innerText = rank;
    rankEl.className = `status-tag badge-${rank.toLowerCase()}`;
}

// Initial Data Fetch
async function init() {
    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();

        const talentContainer = document.getElementById('matchmaking-list');
        talentContainer.innerHTML = users.map(user => `
            <div class="talent-item">
                <div class="avatar-placeholder"></div>
                <div>
                    <div>${user.username}</div>
                    <div class="badge-${user.skill_level.toLowerCase()}">${user.skill_level}</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
    }
}

init();

