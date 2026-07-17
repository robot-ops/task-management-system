# API & Postman Documentation

Dokumentasi ini menjelaskan daftar lengkap endpoint REST API yang tersedia untuk aplikasi **Task Management System** beserta cara pengujiannya menggunakan **Postman**.

Semua endpoint API memiliki prefix `/api`.

---

## 🔑 Endpoint Autentikasi (Public)

### 1. Register Pengguna
* **Method**: `POST`
* **Path**: `/api/auth/register`
* **Deskripsi**: Mendaftarkan akun baru ke database.
* **Request Body (JSON)**:
  ```json
  {
      "name": "Nama Pengguna",
      "email": "email@example.com",
      "password": "passwordrahasia"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
      "message": "User registered successfully",
      "Id": 1,
      "data": {
          "name": "Nama Pengguna",
          "email": "email@example.com"
      }
  }
  ```

### 2. Login Pengguna
* **Method**: `POST`
* **Path**: `/api/auth/login`
* **Deskripsi**: Autentikasi pengguna dan mendapatkan token akses JWT.
* **Request Body (JSON)**:
  ```json
  {
      "email": "email@example.com",
      "password": "passwordrahasia"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "data": {
          "name": "Nama Pengguna",
          "email": "email@example.com"
      }
  }
  ```

---

## 📋 Endpoint Manajemen Tugas (Protected)
*Semua rute di bawah ini wajib melampirkan header:*
`Authorization: Bearer <JWT_TOKEN>`

### 1. Ambil Semua Tugas
* **Method**: `GET`
* **Path**: `/api/tasks`
* **Deskripsi**: Mengambil seluruh daftar tugas milik user yang sedang aktif login.
* **Query Parameter**:
  * `status` (opsional): memfilter tugas berdasarkan status (`pending`, `in-progress`, atau `done`).
  * *Contoh*: `GET /api/tasks?status=in-progress`
* **Response (200 OK)**:
  ```json
  {
      "message": "Tasks fetched successfully",
      "data": [
          {
              "id": 1,
              "title": "Belajar Node.js",
              "description": "Mempelajari koneksi MySQL dan Express",
              "status": "in-progress",
              "deadline": "2026-07-20T00:00:00.000Z",
              "user_id": 1
          }
      ]
  }
  ```

### 2. Tambah Tugas Baru
* **Method**: `POST`
* **Path**: `/api/tasks`
* **Deskripsi**: Menambahkan tugas baru untuk user yang aktif.
* **Request Body (JSON)**:
  ```json
  {
      "title": "Belajar React",
      "description": "Mengerti hooks dasar",
      "status": "pending",
      "deadline": "2026-07-22"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
      "message": "Task Created",
      "Id": 2,
      "data": {
          "title": "Belajar React",
          "description": "Mengerti hooks dasar",
          "status": "pending",
          "deadline": "2026-07-22"
      }
  }
  ```

### 3. Perbarui Tugas
* **Method**: `PUT`
* **Path**: `/api/tasks/:id`
* **Deskripsi**: Memperbarui informasi tugas berdasarkan ID tugas. Hanya pemilik tugas yang bisa memperbarui tugas ini.
* **Request Body (JSON)**:
  ```json
  {
      "title": "Belajar React & Hooks",
      "description": "Mengerti useState dan useEffect",
      "status": "in-progress",
      "deadline": "2026-07-25"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
      "message": "Task updated successfully",
      "data": {
          "id": "2",
          "title": "Belajar React & Hooks",
          "description": "Mengerti useState dan useEffect",
          "status": "in-progress",
          "deadline": "2026-07-25"
      }
  }
  ```

### 4. Hapus Tugas
* **Method**: `DELETE`
* **Path**: `/api/tasks/:id`
* **Deskripsi**: Menghapus tugas berdasarkan ID tugas. Hanya pemilik tugas yang bisa menghapus.
* **Response (200 OK)**:
  ```json
  {
      "message": "Task deleted successfully"
  }
  ```

---

## 📂 Koleksi Postman (Integrasi Git)
Proyek ini mencakup ekspor koleksi Postman yang terletak di dalam direktori:
* [**`postman/`**]
* [**`.postman/`**]

Anda dapat mengimpor folder tersebut ke dalam workspace aplikasi desktop Postman Anda atau menggunakan ekstensi VS Code Postman untuk pengujian API secara instan.
