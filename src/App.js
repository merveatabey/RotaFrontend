import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminLogin from './pages/auth/AdminLogin';
import HomePage from './pages/user/HomePage';
import ToursPage from './pages/user/ToursPage';
import TourDetailPage from './pages/user/TourDetailPage';
import FavoritesPage from './pages/user/FavoritesPage';
import ReservationPage from './pages/user/ReservationPage';
import PurchasePage from './pages/user/PurchasePage';
import MyToursPage from './pages/user/MyToursPage';
import AdminHomePage from './pages/admin/AdminHomePage';
import HotelManagementPage from './pages/admin/HotelManagementPage';
import TourManagementPage from './pages/admin/TourManagementPage';
import TourActivityManagementPage from './pages/admin/ActivityManagementPage';
import TourdayManagementPage from './pages/admin/TourdayManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ReservationManagementPage from './pages/admin/ReservationManagementPage';
import ReportManagementPage from './pages/admin/ReportManagementPage';
import ResetPassword from './pages/auth/ResetPassword';

function App() {
  return (
     <Router>
      <Routes>
        <Route path='/' element = {<Login/>}/>
        <Route path='/register' element = {<Register/>}/>
         <Route path='/forgot-password' element = {<ForgotPassword/>}/> 
         <Route path='/reset-password' element = {<ResetPassword/>}/>
         <Route path='/HomePage' element = {<HomePage/>}/>
        <Route path='/tours' element={<ToursPage/>} />
         <Route path="/tour/:id" element={<TourDetailPage />} /> 
         <Route path='/favorites' element={<FavoritesPage/>}/>
         <Route path='/tour/:id/reservation' element={<ReservationPage/>} /> 
         <Route path='/purchase/:tourId' element={<PurchasePage/>} />
        <Route path='/my-tours' element={<MyToursPage/>} />
      

         <Route path='/admin-login' element = {<AdminLogin/>}/>
          <Route path='/AdminHome' element = {<AdminHomePage/>}/>
         <Route path='/admin/hotels' element={<HotelManagementPage/>} />
         <Route path='/admin/tours' element={<TourManagementPage/>} />
         <Route path='/admin/activities' element={<TourActivityManagementPage/>} />
         <Route path='/admin/tour-days' element={<TourdayManagementPage/>} />
         <Route path='/admin/users' element={<UserManagementPage/>} />
         <Route path='/admin/reservations' element={<ReservationManagementPage/>} />
         <Route path='/admin/reports' element={<ReportManagementPage/>} />



      </Routes>
    </Router>
  );
}

export default App;
