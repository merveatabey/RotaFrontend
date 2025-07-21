import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/user/reservationPage.css";

const ReservationPage = () => {
  const { id } = useParams(); // tour id
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [note, setNote] = useState(""); 
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const childDiscountRate = 0.5;

  useEffect(() => {
    axios
      .get(`https://localhost:6703/api/Tour/${id}/details`)
      .then((res) => setTour(res.data))
      .catch(() => alert("Tur bilgisi alınamadı."));

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser || !storedUser.id) {
      alert("Rezervasyon yapmak için giriş yapmalısınız.");
      navigate("/");
    } else {
      setUserId(storedUser.id);
    }
  }, [id, navigate]);

  const handleReservation = async () => {
  const dto = {
    userId,
    tourId: parseInt(id),
    guestCount: adultCount + childCount,
    adultCount,
    childCount,
    note : note.trim() || "Online rezervasyon yapıldı",
  };
  console.log("Rezervasyon DTO:", dto);
  const token = localStorage.getItem("token");

  try {
    await axios.post(
      "https://localhost:6703/api/Reservation/create-with-details",
      dto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Rezervasyon başarıyla oluşturuldu. 10 gün içinde onaylanmalıdır.");
    
    // Rezervasyon sonrası My Tours sayfasına yönlendir
    navigate("/my-tours");

  } catch (err) {
    console.error("Rezervasyon hatası:", err);
    setMessage("Rezervasyon oluşturulamadı.");
  }
};


  if (!tour) return <div className="loading">Yükleniyor...</div>;

  const totalPrice =
    adultCount * tour.price +
    childCount * (tour.price * childDiscountRate);

  return (
    <div className="reservation-page">
      <div className="reservation-card">
        <h2>{tour.title} İçin Rezervasyon</h2>

        <div className="info">
          <p><strong>Kategori:</strong> {tour.category}</p>
          <p><strong>Fiyat (yetişkin):</strong> {tour.price} ₺</p>
          <p><strong>Çocuk Fiyatı (%50 indirim):</strong> {tour.price * childDiscountRate} ₺</p>
        </div>

        <div className="input-group">
          <label>Yetişkin Sayısı:</label>
          <input
            type="number"
            min="1"
            value={adultCount}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setAdultCount(isNaN(val) ? 1 : val);
            }}
          />
        </div>

        <div className="input-group">
          <label>Çocuk Sayısı:</label>
          <input
            type="number"
            min="0"
            value={childCount}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setChildCount(isNaN(val) ? 0 : val);
            }}
          />
        </div>

        <div className="input-group">
          <label>Not:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Eklemek istediğiniz notları yazınız"
          />
        </div>

        <div className="total">
          <strong>Toplam Tutar:</strong> {totalPrice.toFixed(2)} ₺
        </div>

        <button className="submit-btn" onClick={handleReservation}>
          Rezervasyonu Tamamla
        </button>

        {message && <p className="error">{message}</p>}
      </div>
    </div>
  );
};

export default ReservationPage;
