import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useBiblioteca } from '../context/BibliotecaContext';

export default function ClienteLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuarios, usuarioActivo, setUsuarioActivo } = useBiblioteca();

  const usuario = usuarios.find(u => u.id === usuarioActivo);

  const menuItems = [
    { to: '/cliente', end: true, label: 'Inicio' },
    { to: '/cliente/buscar', label: 'Catálogo' },
    { to: '/cliente/historial', label: 'Mis préstamos' },
  ];

  const currentTitle = menuItems.find(
    item => item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )?.label || 'Portal del Usuario';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">Biblioteca Central</p>
                <p className="text-xs text-slate-500 leading-tight">Portal del usuario</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {usuario && (
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-slate-900 leading-tight">
                    {usuario.nombres} {usuario.apellidos}
                  </p>
                  <p className="text-xs text-slate-500 leading-tight">
                    {usuario.codigo} · {usuario.tipo}
                  </p>
                </div>
              )}
              <button
                onClick={() => {
                  setUsuarioActivo('');
                  navigate('/');
                }}
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Tabs de navegación */}
          <nav className="flex gap-6 -mb-px">
            {menuItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-slate-500">
          © 2026 Universidad Nacional — Biblioteca Central
        </div>
      </footer>
    </div>
  );
}