import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Hero } from "./pages/Hero";
import { checkIncentive } from "./services/checkIncentives";
import { calculatePricing } from "./services/dynamicPricing";

checkIncentive()
calculatePricing(1)
function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
