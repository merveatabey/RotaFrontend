import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/hotelManagement.css"; 
import AdminNavbar from "../../components/admin/adminNavbar";

const HotelManagementPage = () => {
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [form, setForm] = useState({
    name: "",
    city: "",
    star: "",
    includedInPrice: false,
    tourId: "",
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get("https://localhost:6703/api/Hotel");
      setHotels(response.data);
    } catch (error) {
      console.error("Otel verileri alınamadı:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`https://localhost:6703/api/Hotel/${id}`);
        fetchHotels();
      } catch (error) {
        console.error("Silme işlemi başarısız:", error);
      }
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setForm({
      ...hotel,
      tourId: hotel.tourId?.toString() ?? "",
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingHotel(null);
    setForm({
      name: "",
      city: "",
      star: "",
      includedInPrice: false,
      tourId: "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tourId: Number(form.tourId),
    };

    try {
      if (editingHotel) {
        await axios.put(`https://localhost:6703/api/Hotel/${editingHotel.id}`, payload);
      } else {
        await axios.post("https://localhost:6703/api/Hotel", payload);
      }
      setShowModal(false);
      fetchHotels();
    } catch (error) {
      console.error("Kaydetme işlemi başarısız:", error);
    }
  };

  return (
    <div className="hotel-management-container">
      <div className="hotel-management-bg" />
  <div className="hotel-management-overlay" />

      <AdminNavbar />
      <div className="hotel-management-content">
        <div className="hotel-header">
          <h2>Otel Yönetimi</h2>
          <button onClick={handleAdd} className="add-button">
            + Otel Ekle
          </button>
        </div>

        <div className="table-wrapper">
          <table className="hotel-table">
            <thead>
              <tr>
                <th>Otel Adı</th>
                <th>Şehir</th>
                <th>Yıldız</th>
                <th>Fiyata Dahil</th>
                <th>Tur ID</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td>{hotel.name}</td>
                  <td>{hotel.city}</td>
                  <td>{hotel.star}</td>
                  <td>{hotel.includedInPrice ? "Evet" : "Hayır"}</td>
                  <td>{hotel.tourId}</td>
                  <td>
                    <button className="hotel-edit-btn" onClick={() => handleEdit(hotel)}>
                      Güncelle
                    </button>
                    <button className="hotel-delete-btn" onClick={() => handleDelete(hotel.id)}>
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{editingHotel ? "Otel Güncelle" : "Yeni Otel Ekle"}</h3>
              <form onSubmit={handleSubmit} className="modal-form">
                <input
                  type="text"
                  placeholder="Otel Adı"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Şehir"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Yıldız"
                  value={form.star}
                  onChange={(e) => setForm({ ...form, star: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Tur ID"
                  value={form.tourId}
                  onChange={(e) => setForm({ ...form, tourId: e.target.value })}
                  required
                />

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.includedInPrice}
                    onChange={(e) =>
                      setForm({ ...form, includedInPrice: e.target.checked })
                    }
                  />
                  Fiyata Dahil mi?
                </label>

                <div className="modal-buttons">
                  <button type="submit" className="save-btn">
                    Kaydet
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelManagementPage;
