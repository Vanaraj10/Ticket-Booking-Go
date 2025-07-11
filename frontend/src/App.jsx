import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import NavBar from "./components/NavBar";
export default function App() {
  return (
    <>
    <NavBar />
    <Routes>
      <Route path="/" element={ <HomePage/> } />
      <Route path="/login" element={ <LoginPage />} />
      <Route path="/signup" element={ <SignupPage/> } />
      <Route path="/my-bookings" element={ <MyBookingsPage/> } />
    </Routes>
    </>
  )
}
