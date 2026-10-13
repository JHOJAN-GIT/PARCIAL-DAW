import { useState } from 'react';
import { useBiblioteca } from '../../context/BibliotecaContext';
import { Libro } from '../../types';

const formVacio: Partial<Libro> = {
  titulo: '',
  autor: '',
  isbn: '',
  categoriaId: '',
  stock: 0,
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
    if (!/^[0-9-]{10,17}$/.test(form.isbn.trim()))
      return setError('ISBN inválido (10-17 dígitos)');
    if (!form.categoriaId) return setError('Seleccione una categoría');
    if (form.stock === undefined || form.stock < 0) return setError('Stock inválido');

    const isbnDuplicado = libros.some(
      l => l.isbn === form.isbn && l.id !== editando
    );
    if (isbnDuplicado) return setError('Ya existe un libro con ese ISBN');

    if (editando) {
      setLibros(
        libros.map(l => (l.id === editando ? ({ ...l, ...form } as Libro) : l))
      );
      setEditando(null);
    } else {
      setLibros([
        ...libros,
        { id: crypto.randomUUID(), ...form } as Libro,
      ]);
    }
    setForm(formVacio);
  };

  const eliminar = (id: string) => {
    const tienePrestamoActivo = prestamos.some(
      p => p.libroId === id && p.estado === 'Activo'
    );
    if (tienePrestamoActivo)
      return alert('No se puede eliminar: tiene préstamos activos');
    if (confirm('¿Eliminar libro?')) {
      setLibros(libros.filter(l => l.id !== id));
    }
  };

  const editar = (l: Libro) => {
    setForm(l);
    setEditando(l.id);
  };

  return (
    <div className="container">
      <h2>📖 Gestión de Libros</h2>
      <form onSubmit={guardar}>
        <input
          placeholder="Título"
          value={form.titulo || ''}
          onChange={e => setForm({ ...form, titulo: e.target.value })}
        />
        <input
          placeholder="Autor"
          value={form.autor || ''}
          onChange={e => setForm({ ...form, autor: e.target.value })}
        />
        <input
          placeholder="ISBN"
          value={form.isbn || ''}
          onChange={e => setForm({ ...form, isbn: e.target.value })}
        />
        <select
          value={form.categoriaId || ''}
          onChange={e => setForm({ ...form, categoriaId: e.target.value })}
        >
          <option value="">-- Categoría --</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          placeholder="Stock"
          value={form.stock ?? 0}
          onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
        />
        <button type="submit">{editando ? 'Actualizar' : 'Registrar'}</button>
        {editando && (
          <button
            type="button"
            onClick={() => {
              setEditando(null);
              setForm(formVacio);
            }}
          >
            Cancelar
          </button>
        )}
      </form>
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>ISBN</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {libros.map(l => (
            <tr key={l.id}>
              <td>{l.titulo}</td>
              <td>{l.autor}</td>
              <td>{l.isbn}</td>
              <td>{categorias.find(c => c.id === l.categoriaId)?.nombre || '-'}</td>
              <td>{l.stock}</td>
              <td>
                <button onClick={() => editar(l)}>Editar</button>{' '}
                <button className="danger" onClick={() => eliminar(l.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {libros.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                No hay libros registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}