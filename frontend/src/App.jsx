import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import NavBar from "./components/NavBar";
import AdminLoginPage from "./pages/AdminLoginPage";

export default function App() {
  return (
    <>
    <NavBar />
    <Routes>
      <Route path="/" element={ <HomePage/> } />
      <Route path="/login" element={ <LoginPage />} />
      <Route path="/admin-login" element={ <AdminLoginPage />} />
      <Route path="/admin" element={ <h1>Admin Dashboard</h1> } />
      <Route path="/signup" element={ <SignupPage/> } />
      <Route path="/my-bookings" element={ <MyBookingsPage/> } />
    </Routes>
    </>
  )
}
