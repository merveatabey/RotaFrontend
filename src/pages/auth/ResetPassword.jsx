import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import '../../styles/auth/forgotPassword.css';

const ResetPassword = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Lütfen geçerli bir token girin.");
      return;
    }

    try {
      const response = await axios.post("https://localhost:6703/api/Auth/reset-password", {
        token,
        newPassword,
      });

      setMessage("Şifreniz başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Şifre sıfırlanırken bir hata oluştu: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Yeni Şifre Oluştur</h2>
        <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Şifre sıfırlama token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />

          <input
            type="password"
            placeholder="Yeni şifre"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}  // isteğe bağlı: minimum uzunluk
          />

          <button type="submit">Şifreyi Sıfırla</button>
        </form>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
