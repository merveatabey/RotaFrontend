import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin/userManagement.css';
import AdminNavbar from '../../components/admin/adminNavbar';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://localhost:6703/api/UserManagement");
      setUsers(res.data);
    } catch (error) {
      console.error("Kullanıcılar alınırken hata:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`https://localhost:6703/api/UserManagement/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Silme işlemi başarısız:", error);
        alert("Kullanıcı silinemedi.");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      fullName: user.fullName ?? '',
      email: user.email ?? '',
      password: '',  // Şifreyi gizli bırakıyoruz, güncelleme yapılmazsa boş bırakılacak
      role: user.role ?? '',
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setForm({
      fullName: '',
      email: '',
      password: '',
      role: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password && !editingUser) {
      alert("Şifre zorunludur!");
      return;
    }

    try {
      if (editingUser) {
        // Güncelleme
        await axios.put(`https://localhost:6703/api/UserManagement/${editingUser.id}`, form);
      } else {
        // Yeni kullanıcı oluşturma
        const userManagementDto = {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role,
        };

        const response = await axios.post("https://localhost:6703/api/UserManagement", userManagementDto);
        console.log("Token:", response.data.token); // İstersen tokeni burada kullan
      }

      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Kayıt hatası:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

  return (
<div className="user-management-container">
  <div className="user-management-bg"></div>
  <div className="user-management-overlay"></div>
        <AdminNavbar />

  <div className="user-management-content">
    <div className="user-header">
      <h2>Kullanıcı Yönetimi</h2>
      <button onClick={handleAdd} className="user-add-button">+ Kullanıcı Ekle</button>
    </div>
<div className="user-table-wrapper">
  <table className="user-table">
    <thead>
      <tr>
        <th>Ad Soyad</th>
        <th>Email</th>
        <th>Rol</th>
        <th>İşlemler</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.id}>
          <td>{user.fullName}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>
            <button onClick={() => handleEdit(user)} className="user-edit-btn">Düzenle</button>
            <button onClick={() => handleDelete(user.id)} className="user-delete-btn">Sil</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    {showModal && (
      <div className="user-modal-overlay">
        <div className="user-modal">
          <h3>{editingUser ? "Kullanıcıyı Güncelle" : "Yeni Kullanıcı Ekle"}</h3>
          <form onSubmit={handleSubmit} className="user-modal-form">
            <input
              type="text"
              placeholder="Ad Soyad"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Şifre"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!editingUser}
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            >
              <option value="">Rol Seçiniz</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>

            <div className="user-modal-buttons">
              <button type="submit" className="user-save-btn">Kaydet</button>
              <button type="button" className="user-cancel-btn" onClick={() => setShowModal(false)}>İptal</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
</div>

  );
};

export default UserManagementPage;
