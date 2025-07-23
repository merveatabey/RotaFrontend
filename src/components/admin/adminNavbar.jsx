import React from "react";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../styles/admin/adminNavbar.css";

const AdminNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminName, setAdminName] = useState("");

   useEffect(() => {
    const storedAdmin = localStorage.getItem("adminName");
    if (storedAdmin) {
      setAdminName(storedAdmin);
    }
  }, []);


  return (
    <nav className="admin-navbar">
      <div className="admin-logo">
        <Link to="/admin">Tatilia Admin</Link>
      </div>
      <ul className="admin-links">
        <li><Link to="/admin/hotels">Oteller</Link></li>
        <li><Link to="/admin/tours">Turlar</Link></li>
        <li><Link to="/admin/activities">Aktiviteler</Link></li>
        <li><Link to="/admin/tour-days">Tur Günleri</Link></li>
        <li><Link to="/admin/users">Kullanıcılar</Link></li>
        <li><Link to="/admin/reservations">Rezervasyonlar</Link></li>
        <li><Link to="/admin/reports">Raporlar</Link></li>
      </ul>
      <div className="admin-user" onClick={() => setShowDropdown(!showDropdown)}>
        <FaUserCircle size={20} />
        <span>Hoşgeldin, {adminName || "Admin"}</span>
        {showDropdown && (
          <div className="admin-dropdown">
            <Link to="/admin/settings">Ayarlar</Link>
            <Link to="/logout">Çıkış</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
