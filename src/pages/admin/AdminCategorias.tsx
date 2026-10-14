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
      setCategorias(
        categorias.map(c => (c.id === editando ? { ...c, nombre: nombre.trim() } : c))
      );
      setEditando(null);
    } else {
      setCategorias([
        ...categorias,
        { id: crypto.randomUUID(), nombre: nombre.trim() },
      ]);
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
    if (c) {
      setNombre(c.nombre);
      setEditando(id);
    }
  };

  return (
    <div className="container">
      <h2>📚 Gestión de Categorías</h2>
      <form onSubmit={guardar}>
        <input
          placeholder="Nombre de la categoría"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <button type="submit">{editando ? 'Actualizar' : 'Registrar'}</button>
        {editando && (
          <button
            type="button"
            onClick={() => {
              setEditando(null);
              setNombre('');
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
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(c => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>
                <button onClick={() => editar(c.id)}>Editar</button>{' '}
                <button className="danger" onClick={() => eliminar(c.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {categorias.length === 0 && (
            <tr>
              <td colSpan={2} style={{ textAlign: 'center' }}>
                No hay categorías registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}