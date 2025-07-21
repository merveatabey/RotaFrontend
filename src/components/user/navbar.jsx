import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user/navbar.css";
import TourSearch from "./tourSearch";
const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  const handleMyTours = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/my-tours");
    } else {
      navigate("/login"); // login olmamışsa yönlendir
    }
  };

  return (
    <header className="transparent-navbar">
      <nav className="navbar-container">
     
        <div className="brand-name">
          Tatilia
        </div>

        {/* Nav linkler */}
        <div className="nav-links">
          <a href="/HomePage">
            <i className="bi bi-house-door-fill"></i> Ana Sayfa
          </a>
          <a href="/tours">
            <i className="bi bi-geo-alt-fill"></i> Turlar
          </a>
          <a href="/favorites">
            <i className="bi bi-heart-fill"></i> Favoriler
          </a>
          <a href="#">
            <i className="bi bi-telephone-fill"></i> İletişim
          </a>
          {/* Hesabım dropdown */}
          <div className="dropdown" ref={dropdownRef}>
            <a href="#" className="dropbtn" onClick={toggleDropdown}>
              <i className="bi bi-person-circle"></i> Hesabım
              <i
                className={`bi dropdown-icon ${dropdownOpen
                    ? "bi-caret-up-fill"
                    : "bi-caret-down-fill"
                  }`}
              ></i>
            </a>
            {dropdownOpen && (
           <div className="dropdown-content">
<a href="#" onClick={handleMyTours}><i className="bi bi-calendar-check-fill"></i> Turlarım</a>
  <a href="#"><i className="bi bi-gear-fill"></i> Ayarlar</a>
  <a href="#"><i className="bi bi-box-arrow-right"></i> Çıkış</a>
</div>

            )}
          </div>


        </div>

        {/* Arama kutusu */}
       <TourSearch />
      </nav>
    </header>
  );
};

export default Navbar;
