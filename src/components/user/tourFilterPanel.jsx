import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/user/tourFilterPanel.css"; 

const TourFilterPanel = ({ onFilter }) => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);  // Yeni state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Kategorileri backend'den çek
  useEffect(() => {
    axios.get("https://localhost:6703/api/tour/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Kategori alınamadı:", err));
  }, []);

  const handleApply = async () => {
    try {
      const response = await axios.get("https://localhost:6703/api/tour/filter", {
        params: {
          category,
          minPrice,
          maxPrice,
          sortBy,
        },
      });

      onFilter(response.data);
    } catch (error) {
      console.error("Filtreleme hatası:", error);
    }
  };

  return (
    <div className="filter-panel">
      <h3>Filtreleme</h3>

      <label>Kategori:</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Tümü</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <label>Fiyat:</label>
      <div className="price-range">
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <label>Sıralama:</label>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Seçiniz</option>
        <option value="price-asc">Fiyata Göre Artan</option>
        <option value="price-desc">Fiyata Göre Azalan</option>
        <option value="title-asc">A-Z</option>
        <option value="title-desc">Z-A</option>
        <option value="date-nearest">Tarihe Göre Yakın</option>
        <option value="date-farthest">Tarihe Göre Uzak</option>
      </select>

      <button onClick={handleApply} className="apply-button">Uygula</button>
    </div>
  );
};

export default TourFilterPanel;
