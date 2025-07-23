import React, { useEffect, useState, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";  // React Icons
import "../../styles/user/tourDetail.css";
import html2pdf from "html2pdf.js";

const TourDetailPage = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");


  useEffect(() => {
    axios.get(`https://localhost:6703/api/Tour/${id}/details`)
      .then(res => setTour(res.data))
      .catch(err => console.error("Tur detayı alınamadı:", err));
  }, [id]);

  useEffect(() => {
    if (userId && token) {
      axios.get(`https://localhost:6703/api/FavoriteTour`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const favoriler = res.data;
        const mevcut = favoriler.some(fav => fav.tourId === Number(id));
        setIsFavorited(mevcut);
      })
      .catch(() => setIsFavorited(false));
    }
  }, [id, userId, token]);

const pdfRef = useRef();

  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0.5,
      filename: `${tour.title
        .toLowerCase()
        .replace(/\s+/g, "_")}-tur-detayi.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  if (!tour) return <div>Yükleniyor...</div>;

  const handleAddFavorite = () => {
    if (!userId || !token) {
      alert("Lütfen giriş yapınız.");
      return;
    }
    axios.post("https://localhost:6703/api/FavoriteTour",
      { tourId: tour.id },
      {headers: {
  Authorization: `Bearer ${token}`
}
 }
    )
      .then(() => {
        // alert("Tur favorilere eklendi!");
        setIsFavorited(true);
      })
.catch((error) => {
  console.error("Favorilere eklerken hata:", error);
  alert("Favorilere eklenirken hata oluştu: " + (error.response?.data?.message || error.message || error));
});

  };

   return (
    <div className="tour-detail-page">
      <div
        className="tour-header"
        style={{ backgroundImage: `url('https://localhost:6703/${tour.imageUrl}')` }}
      >
        <div className="header-overlay">
          <h1>{tour.title}</h1>
          <p>{tour.description}</p>
        </div>
      </div>

      <section className="tour-info" style={{ position: "relative" }}>
        <h2>Genel Bilgiler</h2>

        {/* Butonlar, PDF dışı kalacak şekilde üstte */}
        <button className="pdf-download-btn"
          onClick={handleDownloadPDF}
          title="PDF Olarak İndir"
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: 5,
            padding: "6px 10px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            height: "36px",
            marginRight: "10px",
            position: "absolute",
            top: 15,
            right: 60,
            zIndex: 10,
          }}
        >
          PDF Olarak İndir
        </button>

        <button
          className="favorite-btn"
          onClick={handleAddFavorite}
          disabled={isFavorited}
          title={isFavorited ? "Favorilere eklendi" : "Favorilere ekle"}
          aria-label="Favorilere ekle"
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            zIndex: 10,
          }}
        >
          {isFavorited ? (
            <FaHeart className="heart-icon filled" />
          ) : (
            <FaRegHeart className="heart-icon" />
          )}
        </button>

        {/* PDF'e dahil edilecek içerik burada başlıyor */}
        <div ref={pdfRef}>
          <div className="info-grid">
            <div className="info-card">
              <strong>Kategori</strong>
              <p>{tour.category}</p>
            </div>
            <div className="info-card">
              <strong>Başlangıç</strong>
              <p>{new Date(tour.startDate).toLocaleDateString()}</p>
            </div>
            <div className="info-card">
              <strong>Bitiş</strong>
              <p>{new Date(tour.endDate).toLocaleDateString()}</p>
            </div>
            <div className="info-card">
              <strong>Kapasite</strong>
              <p>{tour.capacity}</p>
            </div>
            <div className="info-card">
              <strong>Fiyat</strong>
              <p>{tour.price} ₺</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tour-hotels" ref={pdfRef}>
        <h2>Oteller</h2>
        <ul>
          {tour.hotels.map((hotel, index) => (
            <li key={index}>
              <h4>{hotel.name}</h4>
              <p>{hotel.location}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="tour-program" ref={pdfRef}>
        <h2>Tur Programı</h2>
        {tour.days.map((day) => (
          <div key={day.id} className="tour-day">
            <h3>{day.dayNumber}. Gün</h3>
            {day.activities.map((activity) => (
              <div key={activity.id} className="activity-card">
                {activity.activityImage && (
                  <img
                    src={`https://localhost:6703/${activity.activityImage}`}
                    alt={activity.description}
                  />
                )}
                <div>
                  <h4>{activity.location} - {activity.time}</h4>
                  <p>{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="tour-actions">
        <button
          className="reserve-btn"
          onClick={() => {
            alert("Rezervasyon onaylama süresi 10 gündür.\n10 gün içinde onaylanmayan rezervasyonlar iptal edilecektir.");
            navigate(`/tour/${tour.id}/reservation`);
          }}
        >
          Rezervasyon Yap
        </button>

        <button
          className="buy-btn"
          onClick={() => {
            navigate(`/purchase/${tour.id}`);
          }}
        >
          Satın Al
        </button>
      </section>
    </div>
  );
};

export default TourDetailPage;
