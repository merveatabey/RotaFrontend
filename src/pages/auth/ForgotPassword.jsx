import React, { useState } from "react";
import axios from "axios";
import '../../styles/auth/forgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post("https://localhost:6703/api/Auth/forgot-password", { email });
      setMessage("Eğer bu e-posta sistemde kayıtlıysa, şifre sıfırlama talimatları gönderildi.");
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
  <div className="forgot-password-container">
    <div className="forgot-password-card">
      <h2>Şifremi Unuttum</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-posta adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Şifre Sıfırlama Linki Gönder</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  </div>
);

};

export default ForgotPassword;