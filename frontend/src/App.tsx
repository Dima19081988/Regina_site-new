import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PortfolioPage from "./pages/Portfolio/public/PortfolioPage";
import PortfolioPageAdmin from "./pages/Portfolio/admin/PortfolioPageAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные страницы */}
        <Route path="/" element={<div>Главная страница</div>}/>
        <Route path="/portfolio" element={<PortfolioPage />}/>

        {/* Админка */}
        <Route path="/admin/login" element={<LoginPage />}/>
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/portfolio" element={<PortfolioPageAdmin />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
