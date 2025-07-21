import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/user/navbar";     
import '../../styles/user/toursPage.css';
import { FiFilter } from "react-icons/fi";
import TourFilterPanel from "../../components/user/tourFilterPanel";
const ToursPage = () => {
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();

  const [isFilterOpen, setIsFilterOpen] = useState(false);



  useEffect(() => {
    axios.get("https://localhost:6703/api/Tour")
      .then(res => setTours(res.data))
      .catch(err => console.error("Tur verisi alınamadı:", err));
  }, []);

  const handleFilterClick = () => {
  setIsFilterOpen(!isFilterOpen);
};

const handleFilterApply = (filteredTours) => {
  setTours(filteredTours);
  setIsFilterOpen(false); // paneli kapat
};

  const handleCardClick = (tourId) => {
    navigate(`/tour/${tourId}`);
  };

  return (
    <div className="tours-page">
       <Navbar />
     <div className="filter-button-container">
  <button onClick={handleFilterClick} className="filter-button">
    <FiFilter size={18} />
    Filtrele
  </button>   
</div> 

{isFilterOpen && <TourFilterPanel onFilter={handleFilterApply} />}

      <h2 className="title">Mevcut Turlar</h2>
      <div className="tours-grid">
        {tours.map(tour => (
          <div
            key={tour.id}
            className="tour-card"
            onClick={() => handleCardClick(tour.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && handleCardClick(tour.id)}
            style={{ backgroundImage: `url('https://localhost:6703/${tour.imageUrl}')` }}
          >
            <div className="overlay-text">{tour.title}</div>
          </div>
        ))}
      </div>
<h3 className="slogan">
  Hayalinizdeki tatil, bir tık uzağınızda...
</h3>
    </div>

  );
};

export default ToursPage;
