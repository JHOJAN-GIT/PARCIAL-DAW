import { useState } from 'react';
import { useBiblioteca } from '../../context/BibliotecaContext';
import type { Usuario } from '../../types';

const formVacio: Partial<Usuario> = {
  nombres: '', apellidos: '', codigo: '', correo: '', tipo: 'Estudiante',
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
    if (!/^[A-Za-z0-9]{6,12}$/.test(form.codigo.trim())) return setError('Código inválido (6-12 alfanuméricos)');
    if (!form.correo?.trim()) return setError('Correo obligatorio');
    if (!/^\S+@\S+\.\S+$/.test(form.correo)) return setError('Correo inválido');
    if (!form.tipo) return setError('Seleccione tipo de usuario');

    if (usuarios.some(u => u.codigo === form.codigo && u.id !== editando))
      return setError('Ya existe un usuario con ese código');
    if (usuarios.some(u => u.correo.toLowerCase() === form.correo!.toLowerCase() && u.id !== editando))
      return setError('Ya existe un usuario con ese correo');

    if (editando) {
      setUsuarios(usuarios.map(u => u.id === editando ? { ...u, ...form } as Usuario : u));
      setEditando(null);
    } else {
      setUsuarios([...usuarios, { id: crypto.randomUUID(), ...form } as Usuario]);
    }
    setForm(formVacio);
  };

  const eliminar = (id: string) => {
    if (confirm('¿Eliminar usuario?')) setUsuarios(usuarios.filter(u => u.id !== id));
  };

  const editar = (u: Usuario) => { setForm(u); setEditando(u.id); };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Usuarios</h2>
        <p className="text-sm text-slate-500 mt-1">
          Registro de estudiantes y docentes
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">
            {editando ? 'Editar usuario' : 'Nuevo usuario'}
          </h3>
        </div>
        <form onSubmit={guardar} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                Nombres
              </label>
              <input
                placeholder="Nombres completos"
                value={form.nombres || ''}
                onChange={e => setForm({ ...form, nombres: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                Apellidos
              </label>
              <input
                placeholder="Apellidos completos"
                value={form.apellidos || ''}
                onChange={e => setForm({ ...form, apellidos: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                Código universitario
              </label>
              <input
                placeholder="Ej. 20201234"
                value={form.codigo || ''}
                onChange={e => setForm({ ...form, codigo: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="usuario@universidad.edu"
                value={form.correo || ''}
                onChange={e => setForm({ ...form, correo: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
                Tipo de usuario
              </label>
              <select
                value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value as any })}
              >
                <option value="Estudiante">Estudiante</option>
                <option value="Docente">Docente</option>
              </select>
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
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Nombres</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Apellidos</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Código</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Correo</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Tipo</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wide px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{u.nombres}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{u.apellidos}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 font-mono">{u.codigo}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{u.correo}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded border ${
                      u.tipo === 'Docente'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {u.tipo}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => editar(u)}
                      className="text-sm text-slate-600 hover:text-slate-900 font-medium mr-4 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(u.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-slate-400">
                    No hay usuarios registrados
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