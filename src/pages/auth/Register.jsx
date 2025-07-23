
import axios from "axios";
import React, { useState } from "react";
import '../../styles/auth/auth.css';
import { useNavigate } from "react-router-dom";


const  Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fullName, setFullName] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

       try {
  const response = await axios.post("https://localhost:6703/api/Auth/register", {
    FullName: fullName,
    Email: email,
    Password: password
  });

  const token = response.data.token; // ← doğru şekilde token alınmalı
  if (token) {
    localStorage.setItem("token", token);
    console.log("Registration successful", token);
    navigate("/");
  } else {
    setError("Registration successful but no token received.");
  }
} catch (error) {
  console.error("Registration error:", error.response?.data || error.message);
  setError("Registration failed. Please check your input.");
}

    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Create an Account</h2>
                <form className="login-form" onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="login-input"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="login-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button">
                        Register
                    </button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <p>
                        Already have an account?{" "}
                        <span
                            style={{
                                color: "orange",
                                cursor: "pointer",
                                textDecoration: "underline",
                            }}
                            onClick={() => navigate("/")}
                        >
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    )


}
export default Register;