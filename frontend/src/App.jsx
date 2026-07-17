import { useState, useEffect } from 'react'
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [view, setView] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [tasks, setTask] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [deadline, setDeadline] = useState("");
  const [editId, setEditId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setView("dashboard");
      fetchTask();
    }
  }, []);

  const fetchTask = async (statusParam = filterStatus) => {
    try {
      let url = "/tasks";
      if (statusParam != "all") {
        url += `?status=${statusParam}`;
      }
      const response = await api.get(url);
      setTask(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
    fetchTask(status);
  }

  const handleApiError = (err) => {
    const errMsg = err.response?.data?.message || "Something went wrong";
    setError(errMsg);
    if (err.response?.status === 401 || err.response?.status === 403) {
      handleLogout();
    }
  };

  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/auth/register", { name, email, password });
      setMessage("Registrasi berhasil! Silakan login.");
      setView("login");
      clearAuthFields();
    } catch (err) {
      handleApiError(err);
    }
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.data.name);
      setView("dashboard");
      clearAuthFields();
      fetchTask("all");
    } catch (err) {
      handleApiError(err);
    }
  };

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setView("login");
    setTask([]);
  };
  
  
  const clearAuthFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  
  const clearTaskFields = () => {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setDeadline("");
    setEditId(null);
  };

  
  const handleSaveTask = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const taskData = { title, description, status, deadline };
      if (editId) {
        
        await api.put(`/tasks/${editId}`, taskData);
        setMessage("Tugas berhasil diperbarui");
      } else {
        
        await api.post("/tasks", taskData);
        setMessage("Tugas berhasil ditambahkan");
      }
      clearTaskFields();
      fetchTask();
    } catch (err) {
      handleApiError(err);
    }
  };

  
  const handleEditClick = (task) => {
    setEditId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    
    const formattedDate = task.deadline ? task.deadline.split("T")[0] : "";
    setDeadline(formattedDate);
  };

  
  const handleDeleteClick = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      try {
        await api.delete(`/tasks/${id}`);
        setMessage("Tugas berhasil dihapus");
        fetchTask();
      } catch (err) {
        handleApiError(err);
      }
    }
  };

  if (view === "login" || view === "register") {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="card shadow-sm p-4" style={{ width: "400px" }}>
          <h3 className="text-center mb-4">{view === "login" ? "Login Pengguna" : "Daftar Akun Baru"}</h3>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          <form onSubmit={view === "login" ? handleLogin : handleRegister}>
            {view === "register" && (
              <div className="mb-3">
                <label className="form-label">Nama</label>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              {view === "login" ? "Masuk" : "Daftar"}
            </button>
          </form>
          <div className="text-center">
            {view === "login" ? (
              <p className="mb-0">Belum punya akun? <a href="#" onClick={() => { setView("register"); setError(""); }}>Daftar di sini</a></p>
            ) : (
              <p className="mb-0">Sudah punya akun? <a href="#" onClick={() => { setView("login"); setError(""); }}>Login di sini</a></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5 bg-white p-3 rounded shadow-sm">
        <div>
          <h2 className="mb-0">Task Management</h2>
          <small className="text-muted">Halo, {localStorage.getItem("userName")}!</small>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>Keluar (Logout)</button>
      </div>
      {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}
      {message && <div className="alert alert-success alert-dismissible fade show">{message}</div>}
      <div className="row g-4">
        {/* Form Tambah/Edit Tugas */}
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h4 className="mb-3">{editId ? "Edit Tugas" : "Tambah Tugas Baru"}</h4>
            <form onSubmit={handleSaveTask}>
              <div className="mb-3">
                <label className="form-label">Judul Tugas</label>
                <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Deskripsi</label>
                <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Tenggat Waktu (Deadline)</label>
                <input type="date" className="form-control" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success flex-grow-1">
                  {editId ? "Perbarui" : "Simpan"}
                </button>
                {editId && (
                  <button type="button" className="btn btn-secondary" onClick={clearTaskFields}>Batal</button>
                )}
              </div>
            </form>
          </div>
        </div>
        {/* Daftar Tugas & Filter */}
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Daftar Tugas</h4>
              {/* Filter Dropdown */}
              <div className="d-flex align-items-center gap-2">
                <label className="text-muted text-nowrap mb-0">Filter Status:</label>
                <select className="form-select form-select-sm" value={filterStatus} onChange={(e) => handleFilter(e.target.value)}>
                  <option value="all">Semua</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            {/* List Table */}
            {tasks.length === 0 ? (
              <div className="alert alert-info text-center">Belum ada tugas. Silakan tambahkan tugas baru.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Judul</th>
                      <th>Deskripsi</th>
                      <th>Status</th>
                      <th>Deadline</th>
                      <th className="text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td><strong>{task.title}</strong></td>
                        <td className="text-muted">{task.description || "-"}</td>
                        <td>
                          <span className={`badge bg-${task.status === "done" ? "success" :
                            task.status === "in-progress" ? "warning text-dark" : "secondary"
                            }`}>
                            {task.status}
                          </span>
                        </td>
                        <td>{task.deadline ? new Date(task.deadline).toLocaleDateString("id-ID") : "-"}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(task)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(task.id)}>Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;