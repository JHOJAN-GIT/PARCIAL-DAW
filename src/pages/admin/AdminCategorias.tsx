import { useState } from 'react';
import { useBiblioteca } from '../../context/BibliotecaContext';

export default function AdminCategorias() {
  const { categorias, setCategorias, libros } = useBiblioteca();
  const [nombre, setNombre] = useState('');
  const [editando, setEditando] = useState<string | null>(null);
  const [error, setError] = useState('');

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nombre.trim()) return setError('El nombre es obligatorio');
    if (nombre.trim().length < 3) return setError('Mínimo 3 caracteres');

    const duplicado = categorias.some(
      c => c.nombre.toLowerCase() === nombre.trim().toLowerCase() && c.id !== editando
    );
    if (duplicado) return setError('Ya existe una categoría con ese nombre');

    if (editando) {
      setCategorias(categorias.map(c => c.id === editando ? { ...c, nombre: nombre.trim() } : c));
      setEditando(null);
    } else {
      setCategorias([...categorias, { id: crypto.randomUUID(), nombre: nombre.trim() }]);
    }
    setNombre('');
  };

  const eliminar = (id: string) => {
    const tieneLibros = libros.some(l => l.categoriaId === id);
    if (tieneLibros) return alert('No se puede eliminar: hay libros asociados');
    if (confirm('¿Eliminar categoría?')) {
      setCategorias(categorias.filter(c => c.id !== id));
    }
  };

  const editar = (id: string) => {
    const c = categorias.find(x => x.id === id);
    if (c) { setNombre(c.nombre); setEditando(id); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Categorías</h2>
        <p className="text-sm text-slate-500 mt-1">
          Clasificación de los recursos bibliográficos
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">
            {editando ? 'Editar categoría' : 'Nueva categoría'}
          </h3>
        </div>
        <form onSubmit={guardar} className="p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              placeholder="Nombre de la categoría"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-md font-medium transition"
              >
                {editando ? 'Actualizar' : 'Registrar'}
              </button>
              {editando && (
                <button
                  type="button"
                  onClick={() => { setEditando(null); setNombre(''); }}
                  className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-md font-medium transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
          {error && (
            <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">
                Nombre
              </th>
              <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categorias.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 text-sm text-slate-900">{c.nombre}</td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => editar(c.id)}
                    className="text-sm text-slate-600 hover:text-slate-900 font-medium mr-4 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(c.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {categorias.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center py-12 text-sm text-slate-400">
                  No hay categorías registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}