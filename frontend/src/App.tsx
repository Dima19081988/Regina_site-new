import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import PortfolioPage from "./pages/Portfolio/public/PortfolioPage";
import PortfolioPageAdmin from "./pages/Portfolio/admin/PortfolioPageAdmin";
import PortfolioDetailPage from "./pages/Portfolio/public/PortfolioDetailPage";
import PortfolioDetailPageAdmin from "./pages/Portfolio/admin/PortfolioDetailPageAdmin";
import PortfolioEditPageAdmin from "./pages/Portfolio/admin/PortfolioEditPageAdmin";
import AppointmentsPageAdmin from "./pages/Appointments/admin/AppointmentsPageAdmin";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные страницы */}
        <Route path="/" element={<div>Главная страница</div>} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
        {/* Админка */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/portfolio" element={<PortfolioPageAdmin />} />
          <Route path="/admin/portfolio/:id" element={<PortfolioDetailPageAdmin />} />
          <Route path="/admin/portfolio/:id/edit" element={<PortfolioEditPageAdmin />} />
          <Route path="/admin/appointments" element={<AppointmentsPageAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
