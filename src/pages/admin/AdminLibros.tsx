import { useState } from 'react';
import { useBiblioteca } from '../../context/BibliotecaContext';
import type { Libro } from '../../types';

const formVacio: Partial<Libro> = {
  titulo: '', autor: '', isbn: '', categoriaId: '', stock: 0,
};

export default function AdminLibros() {
  const { libros, setLibros, categorias, prestamos } = useBiblioteca();
  const [form, setForm] = useState<Partial<Libro>>(formVacio);
  const [editando, setEditando] = useState<string | null>(null);
  const [error, setError] = useState('');

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.titulo?.trim()) return setError('El título es obligatorio');
    if (!form.autor?.trim()) return setError('El autor es obligatorio');
    if (!form.isbn?.trim()) return setError('El ISBN es obligatorio');
    if (!/^[0-9-]{10,17}$/.test(form.isbn.trim())) return setError('ISBN inválido (10-17 dígitos)');
    if (!form.categoriaId) return setError('Seleccione una categoría');
    if (form.stock === undefined || form.stock < 0) return setError('Stock inválido');

    const isbnDuplicado = libros.some(l => l.isbn === form.isbn && l.id !== editando);
    if (isbnDuplicado) return setError('Ya existe un libro con ese ISBN');

    if (editando) {
      setLibros(libros.map(l => l.id === editando ? { ...l, ...form } as Libro : l));
      setEditando(null);
    } else {
      setLibros([...libros, { id: crypto.randomUUID(), ...form } as Libro]);
    }
    setForm(formVacio);
  };

  const eliminar = (id: string) => {
    const tienePrestamoActivo = prestamos.some(p => p.libroId === id && p.estado === 'Activo');
    if (tienePrestamoActivo) return alert('No se puede eliminar: tiene préstamos activos');
    if (confirm('¿Eliminar libro?')) setLibros(libros.filter(l => l.id !== id));
  };

  const editar = (l: Libro) => { setForm(l); setEditando(l.id); };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Catálogo</h2>
        <p className="text-sm text-slate-500 mt-1">
          Administración de los libros disponibles
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">
            {editando ? 'Editar libro' : 'Nuevo libro'}
          </h3>
        </div>
        <form onSubmit={guardar} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                Título
              </label>
              <input
                placeholder="Ej. Cien años de soledad"
                value={form.titulo || ''}
                onChange={e => setForm({ ...form, titulo: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                Autor
              </label>
              <input
                placeholder="Ej. Gabriel García Márquez"
                value={form.autor || ''}
                onChange={e => setForm({ ...form, autor: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                ISBN
              </label>
              <input
                placeholder="978-3-16-148410-0"
                value={form.isbn || ''}
                onChange={e => setForm({ ...form, isbn: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                Categoría
              </label>
              <select
                value={form.categoriaId || ''}
                onChange={e => setForm({ ...form, categoriaId: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                Stock disponible
              </label>
              <input
                type="number"
                min="0"
                value={form.stock ?? 0}
                onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-md font-medium transition"
            >
              {editando ? 'Actualizar' : 'Registrar'}
            </button>
            {editando && (
              <button
                type="button"
                onClick={() => { setEditando(null); setForm(formVacio); }}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-md font-medium transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Título</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Autor</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">ISBN</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Categoría</th>
                <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Stock</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {libros.map(l => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{l.titulo}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{l.autor}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 font-mono">{l.isbn}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {categorias.find(c => c.id === l.categoriaId)?.nombre || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                      l.stock > 0
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {l.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => editar(l)}
                      className="text-sm text-slate-600 hover:text-slate-900 font-medium mr-4 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(l.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {libros.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-slate-400">
                    No hay libros registrados
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