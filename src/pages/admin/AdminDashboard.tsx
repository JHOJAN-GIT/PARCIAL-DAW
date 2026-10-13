import { Link } from 'react-router-dom';
import { useBiblioteca } from '../../context/BibliotecaContext';

export default function AdminDashboard() {
  const { categorias, libros, usuarios, prestamos } = useBiblioteca();

  const stats = [
    { label: 'Categorías', value: categorias.length, to: '/admin/categorias', hint: 'Registradas' },
    { label: 'Libros', value: libros.length, to: '/admin/libros', hint: 'En catálogo' },
    { label: 'Usuarios', value: usuarios.length, to: '/admin/usuarios', hint: 'Activos' },
    { label: 'Préstamos', value: prestamos.length, to: '/admin/usuarios', hint: 'Totales' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Resumen general</h2>
        <p className="text-sm text-slate-500 mt-1">
          Estado actual del sistema bibliotecario
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Link
            key={s.label}
            to={s.to}
            className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-400 transition-colors"
          >
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-semibold text-slate-900 mt-2">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.hint}</p>
          </Link>
        ))}
      </div>

      {/* Acciones */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Acciones frecuentes</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <Link to="/admin/categorias" className="p-5 hover:bg-slate-50 transition-colors">
            <p className="text-sm font-medium text-slate-900">Registrar categoría</p>
            <p className="text-xs text-slate-500 mt-1">Añadir una nueva clasificación</p>
          </Link>
          <Link to="/admin/libros" className="p-5 hover:bg-slate-50 transition-colors">
            <p className="text-sm font-medium text-slate-900">Añadir libro</p>
            <p className="text-xs text-slate-500 mt-1">Incorporar un nuevo título</p>
          </Link>
          <Link to="/admin/usuarios" className="p-5 hover:bg-slate-50 transition-colors">
            <p className="text-sm font-medium text-slate-900">Nuevo usuario</p>
            <p className="text-xs text-slate-500 mt-1">Registrar estudiante o docente</p>
          </Link>
        </div>
      </div>
    </div>
  );
}