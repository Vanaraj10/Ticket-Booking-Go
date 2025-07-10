import { Route, Routes } from "react-router-dom";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={ <div>Home Page</div> } />
      <Route path="/login" element={ <div>Login Page</div> } />
      <Route path="/signup" element={ <div>Signup Page</div> } />
    </Routes>
  )
}
