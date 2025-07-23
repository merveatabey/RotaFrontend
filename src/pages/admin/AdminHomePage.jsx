import React from "react";
import AdminNavbar from "../../components/admin/adminNavbar";
import "../../styles/admin/adminHomePage.css";

const AdminHomePage = () => {
  return (
    <div className="admin-page">
      <AdminNavbar />
      <div className="hero-section">
        <div className="overlay" />
        <img
          src="/admin.png"
          alt="Admin Background"
          className="hero-image"
        />
        <div className="hero-content">
          <h1>Admin Paneline Hoş Geldiniz</h1>
          <p>Tatilia ile turizmde fark yaratın, yönetin ve geliştirin.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
