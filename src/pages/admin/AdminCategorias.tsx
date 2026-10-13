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
    setNombre("");
    setError("");
  }

  function editar(id: string) {
    const cat = categorias.find((c) => c.id === id)!;
    setEditandoId(id);
    setNombre(cat.nombre);
    setError("");
  }

  function eliminar(id: string) {
    const tieneLibros = libros.some((l) => l.categoriaId === id);
    if (tieneLibros) { setError("No se puede eliminar: tiene libros asociados."); return; }
    setCategorias(categorias.filter((c) => c.id !== id));
  }

  function cancelar() {
    setEditandoId(null);
    setNombre("");
    setError("");
  }

  return (
    <div className="container">
      <h2>Gestión de Categorías</h2>
      <form onSubmit={(e) => { e.preventDefault(); guardar(); }}>
        <input
          placeholder="Nombre de categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button type="submit">{editandoId ? "Actualizar" : "Agregar"}</button>
        {editandoId && <button type="button" onClick={cancelar}>Cancelar</button>}
      </form>
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr><th>#</th><th>Nombre</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {categorias.length === 0 && (
            <tr><td colSpan={3} style={{ textAlign: "center" }}>Sin categorías registradas</td></tr>
          )}
          {categorias.map((c, i) => (
            <tr key={c.id}>
              <td>{i + 1}</td>
              <td>{c.nombre}</td>
              <td>
                <button onClick={() => editar(c.id)}>Editar</button>{" "}
                <button className="danger" onClick={() => eliminar(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
