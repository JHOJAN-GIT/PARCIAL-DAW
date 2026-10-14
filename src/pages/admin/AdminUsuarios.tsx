import { useState } from "react";
import { useBiblioteca } from "../../context/BibliotecaContext";
import type { Usuario } from "../../types";

const VACIO: Omit<Usuario, "id"> = { nombres: "", apellidos: "", codigo: "", correo: "", tipo: "Estudiante" };

export default function AdminUsuarios() {
  const { usuarios, setUsuarios } = useBiblioteca();
  const [form, setForm] = useState({ ...VACIO });
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function set(campo: keyof typeof VACIO, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function validar(excludeId?: string): string {
    if (!form.nombres.trim()) return "El nombre es obligatorio.";
    if (!form.apellidos.trim()) return "Los apellidos son obligatorios.";
    if (!form.codigo.trim()) return "El código es obligatorio.";
    if (!/^[a-zA-Z0-9]{6,12}$/.test(form.codigo.trim())) return "Código: 6-12 caracteres alfanuméricos.";
    if (!form.correo.trim()) return "El correo es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) return "Correo inválido.";
    if (usuarios.find((u) => u.codigo === form.codigo.trim() && u.id !== excludeId))
      return "Ya existe un usuario con ese código.";
    if (usuarios.find((u) => u.correo.toLowerCase() === form.correo.trim().toLowerCase() && u.id !== excludeId))
      return "Ya existe un usuario con ese correo.";
    return "";
  }

  function guardar() {
    const err = validar(editandoId ?? undefined);
    if (err) { setError(err); return; }
    if (editandoId) {
      setUsuarios(usuarios.map((u) => u.id === editandoId ? { id: editandoId, ...form } : u));
      setEditandoId(null);
    } else {
      setUsuarios([...usuarios, { id: crypto.randomUUID(), ...form }]);
    }
    setForm({ ...VACIO }); setError("");
  }

  function editar(id: string) {
    const u = usuarios.find((x) => x.id === id)!;
    setEditandoId(id);
    setForm({ nombres: u.nombres, apellidos: u.apellidos, codigo: u.codigo, correo: u.correo, tipo: u.tipo });
    setError("");
  }

  function cancelar() {
    setEditandoId(null); setForm({ ...VACIO }); setError("");
  }

  return (
    <div className="container">
      <h2>👥 Registro de Usuarios</h2>

      <form onSubmit={(e) => { e.preventDefault(); guardar(); }}>
        <input placeholder="Nombres" value={form.nombres} onChange={(e) => set("nombres", e.target.value)} />
        <input placeholder="Apellidos" value={form.apellidos} onChange={(e) => set("apellidos", e.target.value)} />
        <input placeholder="Código (6-12 alfanum.)" value={form.codigo} onChange={(e) => set("codigo", e.target.value)} />
        <input placeholder="Correo electrónico" value={form.correo} onChange={(e) => set("correo", e.target.value)} />
        <select value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
          <option value="Estudiante">Estudiante</option>
          <option value="Docente">Docente</option>
        </select>
        <button type="submit">{editandoId ? "✏️ Actualizar" : "➕ Registrar"}</button>
        {editandoId && <button type="button" className="secondary" onClick={cancelar}>Cancelar</button>}
      </form>

      {error && <p className="error">{error}</p>}

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Código</th>
              <th>Correo</th>
              <th>Tipo</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>
                  Sin usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.nombres}</td>
                  <td>{u.apellidos}</td>
                  <td style={{ fontFamily: "monospace", color: "#64748b" }}>{u.codigo}</td>
                  <td style={{ color: "#64748b" }}>{u.correo}</td>
                  <td>
                    <span className={`badge ${u.tipo === "Docente" ? "" : "badge-activo"}`}
                      style={u.tipo === "Docente" ? { background: "#ede9fe", color: "#6d28d9" } : {}}>
                      {u.tipo}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      style={{ marginRight: "0.5rem", padding: "0.35rem 0.8rem", fontSize: "0.8rem" }}
                      onClick={() => editar(u.id)}
                    >✏️ Editar</button>
                    <button
                      className="danger"
                      style={{ padding: "0.35rem 0.8rem", fontSize: "0.8rem" }}
                      onClick={() => setUsuarios(usuarios.filter((x) => x.id !== u.id))}
                    >🗑️ Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
