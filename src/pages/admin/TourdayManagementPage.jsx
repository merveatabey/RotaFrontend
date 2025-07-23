import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin/tourdayManagement.css';
import AdminNavbar from '../../components/admin/adminNavbar';

const TourdayManagementPage = () => {
  const [tourDays, setTourDays] = useState([]);
  const [tours, setTours] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTourDay, setEditingTourDay] = useState(null);

  const [form, setForm] = useState({
    dayNumber: '',
    description: '',
    tourId: '',
  });

  useEffect(() => {
    fetchTourDays();
    fetchTours();
  }, []);

  const fetchTourDays = async () => {
    const res = await axios.get("https://localhost:6703/api/TourDay");
    setTourDays(res.data);
  };

  const fetchTours = async () => {
    const res = await axios.get("https://localhost:6703/api/Tour");
    setTours(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Silmek istediğinize emin misiniz?")) {
      await axios.delete(`https://localhost:6703/api/TourDay/${id}`);
      fetchTourDays();
    }
  };

  const handleEdit = (day) => {
    setEditingTourDay(day);
    setForm({
      dayNumber: day.dayNumber ?? '',
      description: day.description ?? '',
      tourId: day.tourId ?? '',
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTourDay(null);
    setForm({
      dayNumber: '',
      description: '',
      tourId: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      dayNumber: parseInt(form.dayNumber),
      description: form.description,
      tourId: form.tourId,
      activites : null
    };

    if (editingTourDay) {
      await axios.put(`https://localhost:6703/api/TourDay/${editingTourDay.id}`, payload);
    } else {
      await axios.post("https://localhost:6703/api/TourDay", payload);
    }

    setShowModal(false);
    fetchTourDays();
  };

  const getTourName = (id) => {
    return tours.find(t => t.id === id)?.title || "Bilinmiyor";
  };

  return (
    <div className="tourday-management-container">
      <div className="tourday-management-bg" />
      <div className="tourday-management-overlay" />

      <AdminNavbar />
      <div className="tourday-management-content">
        <main className="tourday-dashboard">
          <div className="tourday-header">
            <h2>Tur Günü Planlaması</h2>
            <button onClick={handleAdd} className="tourday-add-button">+ Tur Günü Ekle</button>
          </div>

          <table className="tourday-table">
            <thead>
              <tr>
                <th>Gün No</th>
                <th>Açıklama</th>
                <th>Tur</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {tourDays.map(day => (
                <tr key={day.id}>
                  <td>{day.dayNumber}</td>
                  <td>{day.description}</td>
                  <td>{getTourName(day.tourId)}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(day)}>Güncelle</button>
                    <button className="delete-btn" onClick={() => handleDelete(day.id)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>{editingTourDay ? "Tur Gününü Güncelle" : "Yeni Tur Günü Ekle"}</h3>
                <form onSubmit={handleSubmit} className="modal-form">
                  <input
                    type="number"
                    placeholder="Gün Numarası"
                    value={form.dayNumber}
                    onChange={(e) => setForm({ ...form, dayNumber: e.target.value })}
                    required
                    min={1}
                  />
                  <textarea
                    placeholder="Açıklama"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                  <select
                    value={form.tourId}
                    onChange={(e) => setForm({ ...form, tourId: e.target.value })}
                    required
                  >
                    <option value="">Tur Seçiniz</option>
                    {tours.map(tour => (
                      <option key={tour.id} value={tour.id}>{tour.title}</option>
                    ))}
                  </select>

                  <div className="modal-buttons">
                    <button type="submit" className="save-btn">Kaydet</button>
                    <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>İptal</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TourdayManagementPage;