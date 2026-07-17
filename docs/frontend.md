# Frontend Documentation

Dokumentasi ini menjelaskan instalasi, struktur, dan cara menjalankan aplikasi frontend (sisi client) untuk **Task Management System**.

## 🛠️ Tech Stack & Library
* **Framework**: React.js (di-build menggunakan **Vite** untuk performa cepat)
* **CSS Framework**: **Bootstrap** (melalui CDN untuk meminimalkan beban bundle dan kemudahan setup)
* **HTTP Client**: **Axios** (digunakan untuk komunikasi dengan backend REST API + request interceptors)

---

## 🚀 Setup & Menjalankan Frontend

### 1. Instalasi Dependensi
Buka terminal baru, navigasikan ke direktori `frontend/`, kemudian jalankan perintah install:
```bash
cd frontend
npm install
```

---

### 2. Konfigurasi Endpoint API
Alamat URL API backend dikonfigurasi langsung di dalam berkas `src/App.jsx` menggunakan Axios instance:
```javascript
const api = axios.create({
  baseURL: "http://localhost:5000/api" // Sesuaikan dengan port server backend Anda
});
```

---

### 3. Menjalankan Server Pengembangan (Vite)
Jalankan server lokal frontend menggunakan perintah:
```bash
npm run dev
```

Terminal akan menampilkan link server lokal Anda (biasanya **`http://localhost:5173`**). Buka link tersebut di peramban (browser) untuk mengakses aplikasi.

---

## 📂 Alur Autentikasi & State Manajemen
Aplikasi ini dikembangkan dengan pendekatan minimalis namun tetap andal:
1. **Autentikasi Tanpa Router**: Perpindahan antar-halaman (*view*) diatur secara kondisional melalui React state (`view = 'login' | 'register' | 'dashboard'`).
2. **Penyimpanan Token**: Token JWT disimpan di `localStorage` setelah berhasil login.
3. **Axios Interceptor**: Setiap request ke endpoint terlindungi otomatis melampirkan header `Authorization: Bearer <token>` menggunakan Axios Request Interceptor.
4. **Logout**: Saat logout, token dan data sesi pada `localStorage` dihapus secara bersih sebelum mengembalikan pengguna ke halaman login.
