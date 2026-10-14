import { useState } from "react";
import { useBiblioteca } from "../../context/BibliotecaContext";

export default function AdminCategorias() {
  const { categorias, setCategorias, libros } = useBiblioteca();
  const [nombre, setNombre] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function validar(valor: string, excludeId?: string): string {
    if (!valor.trim()) return "El nombre es obligatorio.";
    if (valor.trim().length < 3) return "Mínimo 3 caracteres.";
    const dup = categorias.find(
      (c) => c.nombre.toLowerCase() === valor.trim().toLowerCase() && c.id !== excludeId
    );
    if (dup) return "Ya existe una categoría con ese nombre.";
    return "";
  }

  function guardar() {
    const err = validar(nombre, editandoId ?? undefined);
    if (err) { setError(err); return; }
    if (editandoId) {
      setCategorias(categorias.map((c) => c.id === editandoId ? { ...c, nombre: nombre.trim() } : c));
      setEditandoId(null);
    } else {
      setCategorias([...categorias, { id: crypto.randomUUID(), nombre: nombre.trim() }]);
    }
    setNombre(""); setError("");
  }

  function editar(id: string) {
    const cat = categorias.find((c) => c.id === id)!;
    setEditandoId(id); setNombre(cat.nombre); setError("");
  }

  function eliminar(id: string) {
    if (libros.some((l) => l.categoriaId === id)) {
      setError("No se puede eliminar: tiene libros asociados."); return;
    }
    setCategorias(categorias.filter((c) => c.id !== id));
  }

  function cancelar() {
    setEditandoId(null); setNombre(""); setError("");
  }

  return (
    <div className="container">
      <h2>🏷️ Gestión de Categorías</h2>

      <form onSubmit={(e) => { e.preventDefault(); guardar(); }}>
        <input
          placeholder="Nombre de categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ flex: 1, minWidth: "220px" }}
        />
        <button type="submit">{editandoId ? "✏️ Actualizar" : "➕ Agregar"}</button>
        {editandoId && (
          <button type="button" className="secondary" onClick={cancelar}>Cancelar</button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: "50px" }}>#</th>
              <th>Nombre</th>
              <th>Libros</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>
                  Sin categorías registradas
                </td>
              </tr>
            ) : (
              categorias.map((c, i) => (
                <tr key={c.id}>
                  <td style={{ color: "#94a3b8", fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{c.nombre}</td>
                  <td>
                    <span className="badge badge-activo">
                      {libros.filter((l) => l.categoriaId === c.id).length} libros
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      style={{ marginRight: "0.5rem", padding: "0.35rem 0.8rem", fontSize: "0.8rem" }}
                      onClick={() => editar(c.id)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="danger"
                      style={{ padding: "0.35rem 0.8rem", fontSize: "0.8rem" }}
                      onClick={() => eliminar(c.id)}
                    >
                      🗑️ Eliminar
                    </button>
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
