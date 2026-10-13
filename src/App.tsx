import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BibliotecaProvider } from './context/BibliotecaContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import ClienteLayout from './layouts/ClienteLayout';

// Público
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import ClienteLogin from './pages/ClienteLogin';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminLibros from './pages/admin/AdminLibros';
import AdminUsuarios from './pages/admin/AdminUsuarios';

// Cliente
import ClienteDashboard from './pages/user/ClienteDashboard';
import BuscarLibros from './pages/user/BuscarLibros';
import Historial from './pages/user/Historial';

export default function App() {
  return (
    <BibliotecaProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/cliente/login" element={<ClienteLogin />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="libros" element={<AdminLibros />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>

          <Route path="/cliente" element={<ClienteLayout />}>
            <Route index element={<ClienteDashboard />} />
            <Route path="buscar" element={<BuscarLibros />} />
            <Route path="historial" element={<Historial />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </BibliotecaProvider>
  );
}