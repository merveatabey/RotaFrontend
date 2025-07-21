import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Navbar from "../../components/user/navbar";
import "../../styles/user/favoritesPage.css";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    axios
      .get("https://localhost:6703/api/FavoriteTour", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFavorites(res.data))
      .catch((err) => console.error("Favoriler alınamadı:", err));
  }, [token]);

  const handleRemoveFavorite = (tourId) => {
    axios
      .delete(`https://localhost:6703/api/FavoriteTour/remove/${tourId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setFavorites((prev) => prev.filter((fav) => fav.tourId !== tourId));
      })
      .catch((err) => alert("Favorilerden kaldırılırken hata oluştu."));
  };

  const handlePurchase = (tourId) => {
    alert(`Satın alma işlemi başlatıldı: ${tourId}`);
  };

  return (
    <>
      <Navbar />
      <div className="favorites-container">
        <h1 className="favorites-title">Favorilerim</h1>
        {favorites.length === 0 && <p>Henüz favori eklenmemiş.</p>}

        {favorites.map((fav) => (
          <div className="favorite-card" key={fav.id}>
            <img
              src={`https://localhost:6703/${fav.tourImageUrl}`}
              alt={fav.tourName}
              className="favorite-image"
            />
            <div className="favorite-details">
              <h3 className="favorite-title">{fav.tourName}</h3>
              <p className="favorite-description">{fav.tourDescription}</p>
              <p className="favorite-price">{fav.price} ₺</p>
            </div>

            <div className="favorite-actions">
              <button
                className="action-btn"
                onClick={() => handleRemoveFavorite(fav.tourId)}
              >
                <FaHeart className="icon red-icon" />
                <span className="tooltip">Favorilerden çıkar</span>
              </button>

              <button
                className="action-btn"
                onClick={() => handlePurchase(fav.tourId)}
              >
                <FaShoppingCart className="icon" />
                <span className="tooltip">Satın al</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FavoritesPage;
