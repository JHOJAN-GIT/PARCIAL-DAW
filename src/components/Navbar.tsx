import { Link } from 'react-router-dom';
import { useBiblioteca } from '../context/BibliotecaContext';

export default function Navbar() {
  const { usuarios, usuarioActivo, setUsuarioActivo } = useBiblioteca();

  return (
    <nav className="navbar">
      <Link to="/categorias">Categorías</Link>
      <Link to="/libros">Libros</Link>
      <Link to="/usuarios">Usuarios</Link>
      <Link to="/buscar">Buscar y Prestar</Link>
      <Link to="/historial">Historial</Link>

      <select
        value={usuarioActivo}
        onChange={e => setUsuarioActivo(e.target.value)}
        style={{ marginLeft: 'auto', minWidth: '180px' }}
      >
        <option value="">-- Usuario activo --</option>
        {usuarios.map(u => (
          <option key={u.id} value={u.id}>
            {u.nombres} {u.apellidos}
          </option>
        ))}
      </select>
    </nav>
  );
}