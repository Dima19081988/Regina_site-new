import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout/PublicLayout';
import AdminLayout from './components/AdminLayout/AdminLayout';
import Homepage from './pages/Homepage/Homepage';
import AdminHomepage from './pages/Homepage/AdminHomePage';
import LoginPage from './pages/Login/LoginPage';
import PricePage from './pages/PriceList/public/PricePage';
import TrendDetailPage from './components/TrendSection/TrendDetailPage';
import AdminPricePage from './pages/PriceList/admin/AdminPricePage';
import PortfolioPage from './pages/Portfolio/public/PortfolioPage';
import PortfolioPageAdmin from './pages/Portfolio/admin/PortfolioPageAdmin';
import PortfolioDetailPage from './pages/Portfolio/public/PortfolioDetailPage';
import PortfolioDetailPageAdmin from './pages/Portfolio/admin/PortfolioDetailPageAdmin';
import PortfolioEditPageAdmin from './pages/Portfolio/admin/PortfolioEditPageAdmin';
import AppointmentsPageAdmin from './pages/Appointments/admin/AppointmentsPageAdmin';
import AdminNotesPage from './pages/Notes/AdminNotesPage';
import AdminFilesPage from './pages/Files/AdminFilesPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные страницы */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Homepage />
            </PublicLayout>
          }
        />
        <Route
          path="/portfolio"
          element={
            <PublicLayout>
              <PortfolioPage />
            </PublicLayout>
          }
        />
        <Route
          path="/portfolio/:id"
          element={
            <PublicLayout>
              <PortfolioDetailPage />
            </PublicLayout>
          }
        />
        <Route
          path="/pricelist"
          element={
            <PublicLayout>
              <PricePage />
            </PublicLayout>
          }
        />
        <Route
          path="/trends/:slug"
          element={
            <PublicLayout>
              <TrendDetailPage />
            </PublicLayout>
          }
        />
        {/* Админка */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/admin/"
            element={
              <AdminLayout title="Начальная страница админа">
                <AdminHomepage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/portfolio"
            element={
              <AdminLayout title="Портфолио">
                <PortfolioPageAdmin />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/portfolio/:id"
            element={
              <AdminLayout title="">
                <PortfolioDetailPageAdmin />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/portfolio/:id/edit"
            element={
              <AdminLayout title="Изменить работу">
                <PortfolioEditPageAdmin />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/pricelist"
            element={
              <AdminLayout title="Прайслист">
                <AdminPricePage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <AdminLayout title="Записи">
                <AppointmentsPageAdmin />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/notes"
            element={
              <AdminLayout title="Заметки">
                <AdminNotesPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/files"
            element={
              <AdminLayout title="Файлы">
                <AdminFilesPage />
              </AdminLayout>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
