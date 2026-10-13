import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BibliotecaProvider } from "./context/BibliotecaContext";
import Navbar from "./components/Navbar";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminLibros from "./pages/admin/AdminLibros";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import BuscarLibros from "./pages/user/BuscarLibros";
import Historial from "./pages/user/Historial";

export default function App() {
  return (
    <BibliotecaProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/buscar" />} />
          <Route path="/categorias" element={<AdminCategorias />} />
          <Route path="/libros" element={<AdminLibros />} />
          <Route path="/usuarios" element={<AdminUsuarios />} />
          <Route path="/buscar" element={<BuscarLibros />} />
          <Route path="/historial" element={<Historial />} />
        </Routes>
      </BrowserRouter>
    </BibliotecaProvider>
  );
}
