import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const ingresar = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuario === 'admin' && clave === 'admin123') {
      navigate('/admin');
    } else {
      setError('Las credenciales ingresadas no son válidas.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-900 transition">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Acceso administrativo
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Ingrese sus credenciales institucionales
            </p>
          </div>

          <form onSubmit={ingresar} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                Usuario
              </label>
              <input
                type="text"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                Contraseña
              </label>
              <input
                type="password"
                value={clave}
                onChange={e => setClave(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-md transition"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-700">Credenciales de demostración:</span><br />
              Usuario: <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">admin</code> · Contraseña: <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">admin123</code>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}