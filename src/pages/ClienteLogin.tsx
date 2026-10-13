import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBiblioteca } from '../context/BibliotecaContext';

export default function ClienteLogin() {
  const navigate = useNavigate();
  const { usuarios, setUsuarioActivo } = useBiblioteca();
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');

  const ingresar = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = usuarios.find(
      u => u.codigo.toLowerCase() === codigo.trim().toLowerCase()
    );

    if (!user) {
      setError('No se encontró un usuario con el código ingresado.');
      return;
    }

    setUsuarioActivo(user.id);
    navigate('/cliente');
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
              Acceso al portal
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Ingrese su código universitario para continuar
            </p>
          </div>

          <form onSubmit={ingresar} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                Código universitario
              </label>
              <input
                type="text"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder="Ej. 20201234"
                autoComplete="off"
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
              Ingresar
            </button>
          </form>

          {usuarios.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                Usuarios registrados
              </p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {usuarios.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setCodigo(u.codigo)}
                    className="w-full text-left text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-md px-3 py-2 transition"
                  >
                    <span className="font-medium text-slate-900">{u.codigo}</span>
                    <span className="text-slate-500"> · {u.nombres} {u.apellidos}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}