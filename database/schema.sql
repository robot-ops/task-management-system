-- Membuat database jika belum ada
CREATE DATABASE IF NOT EXISTS task_management_db;
USE task_management_db;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Tasks
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
