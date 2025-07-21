import React, { useEffect, useState } from "react";
import "../../styles/user/home.css";
import Navbar from "../../components/user/navbar";
 import Footer from "../../components/user/footer";
import { useNavigate } from "react-router-dom";


const HomePage = () => {

  const[turlar, setTurlar] = useState([]);

  useEffect(() => {
    fetch("https://localhost:6703/api/Tour/popular")
    .then((res) => res.json())
    .then((data) => setTurlar(data))
    .catch((error) => console.error("Error fetching tours:", error));

  }, []);

  const navigate = useNavigate();

const handleCardClick = (tourId) => {
  navigate(`/tour/${tourId}`);
};

  return (
    <div className="home-container">
      <Navbar />
      <div className="hero-section">
        <div className="overlay" />
        <img
          src="/travel-bg.png"
          alt="Hero"
          className="hero-image"
        />
        <div className="hero-content">
          <h1>Hayalinizdeki Seyahati Planlayın</h1>
          <p>Turuncu-yeşil dünyamızda unutulmaz bir yolculuğa çıkın.</p>
        </div>
      </div>

     <div className="turcard-section">
  <h2 className="section-title">Popüler Turlar</h2>

  <div className="turcard-slider">
      {turlar.map((tur) => (
        <div
          key={tur.id}
          className="turcard"
            onClick={() => handleCardClick(tur.id)}
          style={{ backgroundImage: `url('https://localhost:6703/${tur.imageUrl}')` }}
        >
          <div className="card-overlay">
            <span>{tur.title}</span>
          </div>
        </div>
      ))}
    </div>
  <div className="see-all-container">
    <button className="see-all-btn">Tümünü Gör</button>
  </div>
</div>
      <Footer />
    </div>
  );
};

export default HomePage;