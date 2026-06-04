# 🚀 GodoTech Community Platform

Halo teman-teman! Ini adalah repository untuk project website komunitas **GodoTech**. Website ini berfungsi sebagai wadah untuk para pengembang Godot Engine agar bisa berbagi proyek, mencari partner, dan berdiskusi.

## 🛠 Tech Stack
*   **Backend:** Node.js, Express.js, SQLite.
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript.

## 🚀 Cara Menjalankan Project (Lokal)

### 1. Persiapan
*   Clone repository ini ke laptop masing-masing:
    `git clone https://github.com/SanZ877/GodoTech.git`
*   Masuk ke folder `backend`, lalu install library yang dibutuhkan:
    ```bash
    cd backend
    npm install
    ```

### 2. Jalankan Backend
*   Buka terminal di folder `backend`, jalankan perintah:
    ```bash
    node server.js
    ```
*   Pastikan ada tulisan `Server running on http://localhost:3000`.

### 3. Jalankan Frontend
Agar fitur login dan chat bisa berjalan, website harus dijalankan melalui server lokal (bukan sekadar buka file `index.html`):

*   **Opsi A (Paling Mudah):** Pakai VS Code, install extension **"Live Server"**, lalu klik kanan pada `index.html` dan pilih **"Open with Live Server"**.
*   **Opsi B (Terminal):** Masuk ke folder `frontend` dan jalankan:
    `py -m http.server 8000`
    Lalu buka di browser: `http://localhost:8000`

## 💡 Cara Menambah Fitur Baru
Kita semua masih belajar, jadi jangan takut untuk bereksplorasi! Supaya project kita rapi, ikuti aturan ini:

1. **Buat Branch Baru:** Sebelum ngoding, buat "jalur" sendiri supaya kode utama aman.
   - `git checkout -b fitur-namakamu` (contoh: `git checkout -b fitur-chat-global`)
2. **Update Data:** Kalau fitur kalian butuh data contoh, tambahkan perintah `INSERT` di file `backend/seed_data.js`. Setelah itu, jalankan `node seed_data.js` agar database di laptop semua orang terupdate.
3. **Testing:** Cek *console browser* (tekan F12) untuk memastikan tidak ada pesan error merah.
4. **Push:** Kalau sudah oke, kirim perubahan kalian:
   - `git add .`
   - `git commit -m "menambah fitur [nama fitur]"`
   - `git push origin fitur-namakamu`

## ⚠️ Aturan Penting
* **Dilarang Push Database:** File `.db` itu sifatnya lokal di laptop masing-masing. Jangan di-push ke GitHub karena akan menyebabkan konflik dan error buat teman yang lain.
* **Komunikasi:** Kalau kalian menemukan error yang susah dipecahkan atau mau nambah tabel database baru, kabari di grup ya! Jangan *merge* ke branch `main` kalau belum didiskusikan bareng.

## 🌐 Cara Demo (Ngrok)
Kalau mau menunjukkan hasil kerja kalian ke teman kelompok secara online, kalian bisa pakai **Ngrok**:
1. Jalankan server backend (seperti langkah 2).
2. Di terminal lain, ketik: `ngrok http 3000`
3. Copy link yang muncul dan kirim ke grup. (Cukup satu orang saja yang melakukan ini saat demo).

---
**Semangat ngodingnya!** Kalau ada yang bingung soal cara pakai Git atau struktur kodenya, tanya langsung aja ya!
