import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header superior */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 leading-tight">Biblioteca Central</p>
              <p className="text-xs text-slate-500 leading-tight">Universidad Nacional</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">Sistema de Gestión de Préstamos</p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-slate-900 tracking-tight mb-3">
              Sistema de Gestión Bibliotecaria
            </h1>
            <p className="text-slate-600 text-base max-w-xl mx-auto">
              Plataforma institucional para la administración de recursos bibliográficos y préstamos universitarios.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Acceso Admin */}
            <Link
              to="/admin/login"
              className="group block bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-slate-900 rounded flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-slate-900 mb-1">Panel Administrativo</h2>
                  <p className="text-sm text-slate-500 mb-4">
                    Gestión de categorías, catálogo de libros y registro de usuarios.
                  </p>
                  <span className="text-sm font-medium text-slate-900 group-hover:underline">
                    Acceder →
                  </span>
                </div>
              </div>
            </Link>

            {/* Acceso Cliente */}
            <Link
              to="/cliente/login"
              className="group block bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-slate-900 rounded flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-slate-900 mb-1">Portal del Usuario</h2>
                  <p className="text-sm text-slate-500 mb-4">
                    Consulta del catálogo, solicitud de préstamos e historial personal.
                  </p>
                  <span className="text-sm font-medium text-slate-900 group-hover:underline">
                    Acceder →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© 2026 Universidad Nacional — Biblioteca Central</p>
          <p>Desarrollo de Aplicaciones Web · Semestre IX</p>
        </div>
      </footer>
    </div>
  );
}