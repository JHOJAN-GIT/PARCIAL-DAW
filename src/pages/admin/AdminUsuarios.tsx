import { useState } from 'react';
import { useBiblioteca } from '../../context/BibliotecaContext';
import { Usuario } from '../../types';

const formVacio: Partial<Usuario> = {
  nombres: '',
  apellidos: '',
  codigo: '',
  correo: '',
  tipo: 'Estudiante',
};

export default function AdminUsuarios() {
  const { usuarios, setUsuarios } = useBiblioteca();
  const [form, setForm] = useState<Partial<Usuario>>(formVacio);
  const [editando, setEditando] = useState<string | null>(null);
  const [error, setError] = useState('');

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.nombres?.trim()) return setError('Nombres obligatorios');
    if (!form.apellidos?.trim()) return setError('Apellidos obligatorios');
    if (!form.codigo?.trim()) return setError('Código obligatorio');
    if (!/^[A-Za-z0-9]{6,12}$/.test(form.codigo.trim()))
      return setError('Código inválido (6-12 alfanuméricos)');
    if (!form.correo?.trim()) return setError('Correo obligatorio');
    if (!/^\S+@\S+\.\S+$/.test(form.correo))
      return setError('Correo electrónico inválido');
    if (!form.tipo) return setError('Seleccione tipo de usuario');

    const codigoDuplicado = usuarios.some(
      u => u.codigo === form.codigo && u.id !== editando
    );
    if (codigoDuplicado) return setError('Ya existe un usuario con ese código');

    const correoDuplicado = usuarios.some(
      u =>
        u.correo.toLowerCase() === form.correo!.toLowerCase() &&
        u.id !== editando
    );
    if (correoDuplicado) return setError('Ya existe un usuario con ese correo');

    if (editando) {
      setUsuarios(
        usuarios.map(u => (u.id === editando ? ({ ...u, ...form } as Usuario) : u))
      );
      setEditando(null);
    } else {
      setUsuarios([
        ...usuarios,
        { id: crypto.randomUUID(), ...form } as Usuario,
      ]);
    }
    setForm(formVacio);
  };

  const eliminar = (id: string) => {
    if (confirm('¿Eliminar usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  const editar = (u: Usuario) => {
    setForm(u);
    setEditando(u.id);
  };

  return (
    <div className="container">
      <h2>👤 Registro de Usuarios</h2>
      <form onSubmit={guardar}>
        <input
          placeholder="Nombres"
          value={form.nombres || ''}
          onChange={e => setForm({ ...form, nombres: e.target.value })}
        />
        <input
          placeholder="Apellidos"
          value={form.apellidos || ''}
          onChange={e => setForm({ ...form, apellidos: e.target.value })}
        />
        <input
          placeholder="Código universitario"
          value={form.codigo || ''}
          onChange={e => setForm({ ...form, codigo: e.target.value })}
        />
        <input
          placeholder="Correo"
          value={form.correo || ''}
          onChange={e => setForm({ ...form, correo: e.target.value })}
        />
        <select
          value={form.tipo}
          onChange={e => setForm({ ...form, tipo: e.target.value as any })}
        >
          <option value="Estudiante">Estudiante</option>
          <option value="Docente">Docente</option>
        </select>
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
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Código</th>
            <th>Correo</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.nombres}</td>
              <td>{u.apellidos}</td>
              <td>{u.codigo}</td>
              <td>{u.correo}</td>
              <td>{u.tipo}</td>
              <td>
                <button onClick={() => editar(u)}>Editar</button>{' '}
                <button className="danger" onClick={() => eliminar(u.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                No hay usuarios registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}