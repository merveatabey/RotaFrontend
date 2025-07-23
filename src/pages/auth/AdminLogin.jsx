
import React, { useState } from "react";
import '../../styles/auth/auth.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AdminLogin = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

try{
  const response = await axios.post("https://localhost:6703/api/Auth/adminlogin", {email, password});
  const token = response.data.token;
  const adminId = response.data.user.id;
  const adminName = response.data.user.name;


  localStorage.setItem('token', token);   //token'ı localstorage'ye kaydet
  localStorage.setItem('adminId', adminId); //adminId'yi localstorage'ye kaydet
  localStorage.setItem('adminName', adminName); //adminName'yi localstorage'ye kaydet


console.log("Response full:", response.data);


  if(response.status === 200) {
    navigate('/AdminHome'); // Redirect to home page on successful login
  } 
} catch(err){
  console.log(err.response?.data?.message || "Login failed");
  setError("Email veya şifre yanlış olabilir. Lütfen tekrar deneyin.");
  // Optionally, you can also clear the password field on err
}
}



  return(
   <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome to Tatilia <br/> Admin Panel</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {error && <p style={{color: 'red'}}>{error}</p>}
        
          <p className="login-footer"  onClick = {() => navigate('/forgot-password')} >Forgot your password?</p>
          
         
        </form>
      </div>
    </div>


  )
}
export default AdminLogin;
  



