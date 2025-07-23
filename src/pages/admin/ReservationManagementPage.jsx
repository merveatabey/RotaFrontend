import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin/reservationManagement.css';
import AdminNavbar from '../../components/admin/adminNavbar';

const ReservationManagementPage = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get("https://localhost:6703/api/Reservation");
      setReservations(res.data);
    } catch (error) {
      console.error("Rezervasyonlar alınamadı:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`https://localhost:6703/api/Reservation/${id}/approve`);
      fetchReservations(); // listeyi yenile
    } catch (err) {
      alert("Onaylama hatası: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Rezervasyonu iptal etmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`https://localhost:6703/api/Reservation/${id}`);
        fetchReservations();
      } catch (err) {
        alert("İptal hatası: " + err.message);
      }
    }
  };

  return (
    <div className="reservation-management-container">
      <div className="reservation-management-bg" />
      <div className="reservation-management-overlay" />
      <AdminNavbar />

      <div className="reservation-management-content">
        <div className="reservation-header">
          <h2>Rezervasyonlar</h2>
        </div>

        <div className="reservation-table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Email</th>
                <th>Tur Adı</th>
                <th>Rezervasyon Tarihi</th>
                <th>Kişi Sayısı</th>
                <th>Durum</th>
                <th>Toplam Fiyat</th>
                <th>Not</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id}>
                  <td>{res.user?.fullName || '-'}</td>
                  <td>{res.user?.email || '-'}</td>
                  <td>{res.tour?.title || '-'}</td>
                  <td>{new Date(res.reservationDate).toLocaleDateString()}</td>
                  <td>{res.adultCount + res.childCount}</td>
                  <td>{res.status}</td>
                  <td>{res.totalPrice} ₺</td>
                  <td>{res.note || '-'}</td>
                  <td>
                    <button onClick={() => handleApprove(res.id)} className="approve-btn">✔️</button>
                    <button onClick={() => handleDelete(res.id)} className="delete-button">❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReservationManagementPage;
