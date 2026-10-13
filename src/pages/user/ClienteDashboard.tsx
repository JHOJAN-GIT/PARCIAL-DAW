import { Link } from 'react-router-dom';
import { useBiblioteca } from '../../context/BibliotecaContext';

export default function ClienteDashboard() {
  const { usuarioActivo, usuarios, prestamos, libros } = useBiblioteca();
  const usuario = usuarios.find(u => u.id === usuarioActivo);

  const misPrestamos = prestamos.filter(p => p.usuarioId === usuarioActivo);
  const activos = misPrestamos.filter(p => p.estado === 'Activo');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Bienvenido, {usuario?.nombres}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Resumen de su actividad en la biblioteca
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Préstamos activos</p>
          <p className="text-3xl font-semibold text-slate-900 mt-2">{activos.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Préstamos totales</p>
          <p className="text-3xl font-semibold text-slate-900 mt-2">{misPrestamos.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Libros disponibles</p>
          <p className="text-3xl font-semibold text-slate-900 mt-2">
            {libros.filter(l => l.stock > 0).length}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link
          to="/cliente/buscar"
          className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-400 transition-colors group"
        >
          <h3 className="text-base font-semibold text-slate-900 mb-1">Explorar catálogo</h3>
          <p className="text-sm text-slate-500 mb-4">
            Busque libros por título o categoría y solicite préstamos.
          </p>
          <span className="text-sm font-medium text-slate-900 group-hover:underline">
            Ir al catálogo →
          </span>
        </Link>

        <Link
          to="/cliente/historial"
          className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-400 transition-colors group"
        >
          <h3 className="text-base font-semibold text-slate-900 mb-1">Mis préstamos</h3>
          <p className="text-sm text-slate-500 mb-4">
            Consulte el estado de sus préstamos y su historial completo.
          </p>
          <span className="text-sm font-medium text-slate-900 group-hover:underline">
            Ver historial →
          </span>
        </Link>
      </div>
    </div>
  );
}