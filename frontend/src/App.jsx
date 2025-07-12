import { Route, Routes,useLocation } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import NavBar from "./components/NavBar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminQRScanner from "./pages/AdminQRScanner";

export default function App() {

  const location = useLocation();
  const hideNavBar = location.pathname === "/login" || location.pathname === "/signup" || location.pathname==='/admin';
  return (
    <>
   {!hideNavBar && <NavBar />}
    <Routes>
      <Route path="/" element={ <HomePage/> } />
      <Route path="/login" element={ <LoginPage />} />
      <Route path="/admin" element={ <AdminDashboard /> } />
      <Route path="/admin/qr-scanner" element={ <AdminQRScanner /> } />
      <Route path="/signup" element={ <SignupPage/> } />
      <Route path="/my-bookings" element={ <MyBookingsPage/> } />
    </Routes>
    </>
  )
}
