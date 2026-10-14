import { Link, useLocation } from "react-router-dom";
import { useBiblioteca } from "../context/BibliotecaContext";

const links = [
  { to: "/categorias", label: "Categorías" },
  { to: "/libros", label: "Libros" },
  { to: "/usuarios", label: "Usuarios" },
  { to: "/buscar", label: "Buscar y Prestar" },
  { to: "/historial", label: "Historial" },
];

export default function Navbar() {
  const { usuarios, usuarioActivo, setUsuarioActivo } = useBiblioteca();
  const location = useLocation();

  return (
    <nav className="navbar">
      <span className="navbar-brand">📚 Biblioteca</span>

      {links.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          style={
            location.pathname === to
              ? { background: "rgba(255,255,255,0.22)", color: "#fff", fontWeight: 700 }
              : {}
          }
        >
          {label}
        </Link>
      ))}

      <select
        className="navbar-select"
        value={usuarioActivo}
        onChange={(e) => setUsuarioActivo(e.target.value)}
      >
        <option value="">👤 Usuario activo</option>
        {usuarios.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nombres} {u.apellidos}
          </option>
        ))}
      </select>
    </nav>
  );
}
