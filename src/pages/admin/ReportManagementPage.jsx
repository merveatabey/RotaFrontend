import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import AdminNavbar from '../../components/admin/adminNavbar';
import '../../styles/admin/reportManagement.css';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const ReportManagementPage = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [todayUsers, setTodayUsers] = useState(0);
  const [tourDemands, setTourDemands] = useState([]);
  const [tourRevenues, setTourRevenues] = useState([]);
  const [dailyReservations, setDailyReservations] = useState([]);

  useEffect(() => {
  fetchReports();
}, []);

const fetchReports = async () => {
  const baseUrl = "https://localhost:6703/api/Report";

  try {
    const [
      totalRes,
      todayRes,
      demandsRes,
      revenuesRes,
      dailyRes
    ] = await Promise.all([
      axios.get(`${baseUrl}/total-user-count`),
      axios.get(`${baseUrl}/today-user-count`),
      axios.get(`${baseUrl}/tour-demands`),
      axios.get(`${baseUrl}/tour-revenues`),
      axios.get(`${baseUrl}/daily-reservations`)
    ]);

    console.log("Demands:", demandsRes.data);         
    console.log("Revenues:", revenuesRes.data);     
    console.log("Daily Res:", dailyRes.data);        

    setTotalUsers(totalRes.data);
    setTodayUsers(todayRes.data);
    setTourDemands(demandsRes.data);
    setTourRevenues(revenuesRes.data);
    setDailyReservations(dailyRes.data);
  } catch (error) {
    console.error("Raporlar alınırken hata:", error);
  }
};

  const demandData = {
    labels: tourDemands.map(d => d.tourTitle),
    datasets: [{
      label: 'Rezervasyon Sayısı',
      data: tourDemands.map(d => d.reservationCount),
      backgroundColor: '#007bff'
    }]
  };

  const revenueData = {
    labels: tourRevenues.map(r => r.tourTitle),
    datasets: [{
      label: 'Toplam Gelir (₺)',
      data: tourRevenues.map(r => r.totalRevenue),
      backgroundColor: '#28a745'
    }]
  };

  const reservationData = {
    labels: dailyReservations.map(r => new Date(r.reservationDate).toLocaleDateString()),
    datasets: [{
      label: 'Günlük Rezervasyon',
      data: dailyReservations.map(r => r.count),
      fill: false,
      borderColor: '#dc3545'
    }]
  };

  return (
    <div className="admin-home">
      <AdminNavbar adminName="Admin" />
      <div className="admin-content">
        <main className="dashboard report-page">
          <h2>Raporlar</h2>

          <div className="stat-boxes">
            <div className="stat-box bg-blue">
              <h4>Toplam Kullanıcı</h4>
              <p>{totalUsers}</p>
            </div>
            <div className="stat-box bg-green">
              <h4>Bugün Kayıt Olan</h4>
              <p>{todayUsers}</p>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h4>Turlara Olan Talep</h4>
              <Bar data={demandData} />
            </div>

            <div className="chart-card">
              <h4>Turların Getirdiği Gelir</h4>
              <Bar data={revenueData} />
            </div>

            <div className="chart-card full-width">
              <h4>Günlük Rezervasyon Sayısı</h4>
              <Line data={reservationData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportManagementPage;
