# Backend Documentation

Dokumentasi ini menjelaskan konfigurasi, instalasi, dan cara menjalankan server backend untuk aplikasi **Task Management System**.

## 🛠️ Tech Stack & Library
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database Driver**: `mysql2` (dengan Promise connection pool)
* **Keamanan**: `bcrypt` (password hashing) & `jsonwebtoken` (JWT authentication)
* **Development tool**: `nodemon` (auto-restart)
* **CORS**: `cors` (izin akses cross-origin)

---

## 🚀 Setup & Menjalankan Backend

### 1. Prasyarat (Prerequisites)
Pastikan Anda sudah menginstal:
* [Node.js](https://nodejs.org/) (versi LTS direkomendasikan)
* [MySQL Server](https://dev.mysql.com/downloads/mysql/)

---

### 2. Inisialisasi Environment Variables
Masuk ke direktori `backend/`, lalu salin berkas `.env.example` menjadi `.env`:
```bash
cd backend
cp .env.example .env
```

Buka berkas `.env` dan sesuaikan nilainya:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root           # Username database Anda
DB_PASSWORD=your_password  # Password database Anda
DB_NAME=task_management_db
JWT_SECRET=gunakan_kode_jwt_secret_acak_yang_kuat
```

---

### 3. Setup Database (MySQL)
Gunakan MySQL CLI, phpMyAdmin, atau tools database visual pilihan Anda untuk mengeksekusi script SQL berikut untuk membuat database dan tabel yang diperlukan:

```sql
CREATE DATABASE IF NOT EXISTS task_management_db;
USE task_management_db;

-- Tabel Users
CREATE TABLE IF NOT EXISTS users_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Tasks (Tugas)
CREATE TABLE IF NOT EXISTS tasks_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('pending', 'in-progress', 'done') DEFAULT 'pending',
    deadline DATE NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users_table(id) ON DELETE CASCADE
);
```

*(Anda juga bisa menyimpan script di atas ke file `schema.sql` di root proyek untuk mempermudah pengecekan).*

---

### 4. Instalasi Dependensi & Run Server
Jalankan perintah berikut di dalam direktori `backend/`:

```bash
# Menginstal semua dependensi
npm install

# Menjalankan server dalam mode development (menggunakan nodemon)
npm start
```

Server backend akan mendengarkan request masuk di: **`http://localhost:5000`**.
