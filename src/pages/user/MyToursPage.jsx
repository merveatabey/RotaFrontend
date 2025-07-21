import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimesCircle, FaStar } from "react-icons/fa";
import Navbar from "../../components/user/navbar";  
import "../../styles/user/myTours.css";

const MyToursPage = () => {
  const [myTours, setMyTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);

  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser?.id || null;

  useEffect(() => {
    const fetchMyTours = async () => {
      if (!token) {
        console.error("Token bulunamadı!");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("https://localhost:6703/api/Reservation/my-reservations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyTours(response.data);
      } catch (error) {
        console.error("Turlar alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTours();
  }, [token]);

  const openModal = (tourId) => {
    setSelectedTourId(tourId);
    setCommentText("");
    setRating(0);
    setHoverRating(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitComment = async () => {
    if (rating === 0 || commentText.trim() === "") {
      alert("Lütfen puan ve yorum giriniz.");
      return;
    }

    try {
      await axios.post(
        "https://localhost:6703/api/Comment",
        {
          userId: currentUserId,
          tourId: selectedTourId,
          commentText,
          rating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Yorumunuz başarıyla gönderildi.");
      closeModal();
    } catch (error) {
      console.error("Yorum gönderilemedi:", error);
      alert("Yorum gönderilirken hata oluştu.");
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Rezervasyonu iptal etmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`https://localhost:6703/api/Reservation/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyTours((prev) => prev.filter((r) => r.id !== reservationId));
      alert("Rezervasyon iptal edildi.");
    } catch (error) {
      console.error("İptal işlemi başarısız:", error);
      alert("Rezervasyon iptal edilemedi.");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (myTours.length === 0) return <p>Henüz herhangi bir turunuz yok.</p>;

  return (
    <>
      <Navbar />
      <div className="my-tours-page">
        <h1 className="page-title">Turlarım</h1>
        <div className="tour-list">
          {myTours.map((reservation) => (
            <div className="tour-item-wrapper" key={reservation.id}>
              <div className="tourCards">
                <img
                  src={`https://localhost:6703/${reservation.tour?.imageUrl}`}
                  alt={reservation.tour?.title || "Tur görseli"}
                  className="tour-image"
                />
                <div className="tour-info">
                  <h3>{reservation.tour?.title || "Tur bilgisi yok"}</h3>
                  <p>{reservation.tour?.description?.substring(0, 100) || "Açıklama yok."}</p>
                  <p><strong>Toplam Tutar:</strong> {reservation.totalPrice} ₺</p>
                  <p><strong>Kişi Sayısı:</strong> {reservation.adultCount + reservation.childCount}</p>
                  <span className={`badge ${reservation.status === "Rezerve" ? "reserved" : "sold"}`}>
                    {reservation.status}
                  </span>
                </div>
              </div>

              <div className="tour-action-icons">
                {reservation.status === "Rezerve" && (
                  <FaTimesCircle
                    className="action-icon cancel-icon"
                    title="Rezervasyonu İptal Et"
                    onClick={() => handleCancelReservation(reservation.id)}
                  />
                )}
                {reservation.status === "Satıldı" && (
                  <FaStar
                    className="action-icon review-icon"
                    title="Değerlendir"
                    onClick={() => openModal(reservation.tourId)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Yorum Yap</h3>
            <div className="star-rating" style={{ display: "flex", gap: 5, marginBottom: 10 }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <FaStar
                  key={value}
                  size={28}
                  style={{ cursor: "pointer" }}
                  color={value <= (hoverRating || rating) ? "#ffc107" : "#e4e5e9"}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            <textarea
              placeholder="Yorumunuzu yazın..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={closeModal}>İptal</button>
              <button onClick={handleSubmitComment}>Gönder</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyToursPage;
