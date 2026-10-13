import { useState } from 'react';
import { useBiblioteca } from '../../context/BibliotecaContext';
import { generarPDF } from '../../utils/comprobante';

export default function Historial() {
  const {
    prestamos, setPrestamos, libros, setLibros,
    usuarios, usuarioActivo
  } = useBiblioteca();

  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Activo' | 'Devuelto'>('Todos');

  const misPrestamos = prestamos
    .filter(p => p.usuarioId === usuarioActivo)
    .filter(p => filtroEstado === 'Todos' || p.estado === filtroEstado);

  const devolver = (id: string) => {
    const p = prestamos.find(x => x.id === id);
    if (!p) return;
    if (!confirm('¿Confirmar devolución del libro?')) return;

    setPrestamos(prestamos.map(x =>
      x.id === id
        ? { ...x, estado: 'Devuelto', fechaDevolucion: new Date().toISOString().split('T')[0] }
        : x
    ));
    setLibros(libros.map(l =>
      l.id === p.libroId ? { ...l, stock: l.stock + 1 } : l
    ));
  };

  const usuario = usuarios.find(u => u.id === usuarioActivo);

  if (!usuarioActivo) {
    return (
      <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
        Debe iniciar sesión como usuario para ver su historial.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Mis préstamos</h2>
          <p className="text-sm text-slate-500 mt-1">
            {usuario?.nombres} {usuario?.apellidos} — {usuario?.codigo}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Filtrar
          </label>
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value as any)}
            className="w-auto"
          >
            <option value="Todos">Todos</option>
            <option value="Activo">Activos</option>
            <option value="Devuelto">Devueltos</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Código</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Libro</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Préstamo</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Límite</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Devolución</th>
                <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Estado</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {misPrestamos.map(p => {
                const libro = libros.find(l => l.id === p.libroId);
                const vencido = p.estado === 'Activo' && new Date(p.fechaLimite) < new Date();
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono text-slate-600">{p.codigo}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{libro?.titulo || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{p.fechaPrestamo}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      {p.fechaLimite}
                      {vencido && (
                        <span className="ml-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                          Vencido
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{p.fechaDevolucion || '—'}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded border ${
                        p.estado === 'Activo'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          if (usuario && libro) generarPDF(p, usuario, libro);
                        }}
                        className="text-sm text-slate-600 hover:text-slate-900 font-medium mr-4 transition"
                      >
                        PDF
                      </button>
                      {p.estado === 'Activo' && (
                        <button
                          onClick={() => devolver(p.id)}
                          className="text-sm text-emerald-700 hover:text-emerald-800 font-medium transition"
                        >
                          Devolver
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {misPrestamos.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-slate-400">
                    No hay préstamos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}