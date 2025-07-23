import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin/activityManagement.css';  // Aktivite özel css
import AdminNavbar from '../../components/admin/adminNavbar';

const ActivityManagementPage = ({ adminName }) => {
  const [activities, setActivities] = useState([]);
  const [tourDays, setTourDays] = useState([]);
  const [tours, setTours] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const [form, setForm] = useState({
    time: '',
    location: '',
    description: '',
    imageFile: null,
    tourDayId: '',
  });

  useEffect(() => {
    fetchActivities();
    fetchTourDays();
    fetchTours();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get("https://localhost:6703/api/TourActivity");
      setActivities(res.data);
    } catch (error) {
      console.error("Aktiviteler alınamadı:", error);
    }
  };

  const fetchTourDays = async () => {
    try {
      const res = await axios.get("https://localhost:6703/api/TourDay");
      setTourDays(res.data);
    } catch (error) {
      console.error("Tur günleri alınamadı:", error);
    }
  };

  const fetchTours = async () => {
    try {
      const res = await axios.get("https://localhost:6703/api/Tour");
      setTours(res.data);
    } catch (error) {
      console.error("Turlar alınamadı:", error);
    }
  };

  const getTourName = (tourId) => {
    return tours.find(t => t.id === tourId)?.title || "Bilinmiyor";
  };

  const handleDelete = async (id) => {
    if (window.confirm("Silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`https://localhost:6703/api/TourActivity/${id}`);
        fetchActivities();
      } catch (error) {
        console.error("Silme işlemi başarısız:", error);
      }
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setForm({
      time: activity.time ?? '',
      location: activity.location ?? '',
      description: activity.description ?? '',
      imageFile: null,
      tourDayId: activity.tourDayId?.toString() ?? ''
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingActivity(null);
    setForm({
      time: '',
      location: '',
      description: '',
      imageFile: null,
      tourDayId: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("time", form.time);
    formData.append("location", form.location);
    formData.append("description", form.description);
    formData.append("tourDayId", parseInt(form.tourDayId));

    if (form.imageFile) {
      formData.append("formFile", form.imageFile);
    }

    try {
      if (editingActivity) {
        await axios.put(`https://localhost:6703/api/TourActivity/${editingActivity.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post("https://localhost:6703/api/TourActivity", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      fetchActivities();
    } catch (err) {
      console.error("Aktivite kaydedilirken hata oluştu:", err);
      alert("Aktivite eklenemedi. Lütfen tüm alanları doğru doldurduğunuzdan emin olun.");
    }
  };

  return (
    <div className="activity-management-container">
      <div className="activity-management-bg" />
      <div className="activity-management-overlay" />

      <AdminNavbar adminName={adminName} />
      <div className="activity-management-content">
        <div className="activity-header">
          <h2>Aktivite Yönetimi</h2>
          <button onClick={handleAdd} className="activity-add-button">+ Aktivite Ekle</button>
        </div>

        <div className="activity-table-wrapper">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Zaman</th>
                <th>Konum</th>
                <th>Açıklama</th>
                <th>Görsel</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id}>
                  <td>{activity.time}</td>
                  <td>{activity.location}</td>
                  <td>{activity.description}</td>
                  <td>
                    {activity.activityImage
                      ? <img src={`https://localhost:6703/${activity.activityImage}`} alt="Görsel" width="100" />
                      : <span>Yok</span>
                    }
                  </td>
                  <td>
                    <button className="activity-edit-btn" onClick={() => handleEdit(activity)}>Güncelle</button>
                    <button className="activity-delete-btn" onClick={() => handleDelete(activity.id)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="activity-modal-overlay">
            <div className="activity-modal">
              <h3>{editingActivity ? "Aktivite Güncelle" : "Yeni Aktivite Ekle"}</h3>
              <form onSubmit={handleSubmit} className="activity-modal-form">
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Konum"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Açıklama"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
                />

                <select
                  value={form.tourDayId}
                  onChange={(e) => setForm({ ...form, tourDayId: e.target.value })}
                  required
                >
                  <option value="">Gün seçin</option>
                  {tourDays.map(day => (
                    <option key={day.id} value={day.id}>
                      {`Gün ${day.dayNumber} - ${getTourName(day.tourId)}`}
                    </option>
                  ))}
                </select>

                <div className="activity-modal-buttons">
                  <button type="submit" className="activity-save-btn">Kaydet</button>
                  <button type="button" className="activity-cancel-btn" onClick={() => setShowModal(false)}>İptal</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityManagementPage;
