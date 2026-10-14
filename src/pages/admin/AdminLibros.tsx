import { useState } from "react";
import { useBiblioteca } from "../../context/BibliotecaContext";
import type { Libro } from "../../types";

const VACIO: Omit<Libro, "id"> = { titulo: "", autor: "", isbn: "", categoriaId: "", stock: 0 };

export default function AdminLibros() {
  const { libros, setLibros, categorias, prestamos } = useBiblioteca();
  const [form, setForm] = useState({ ...VACIO });
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function set(campo: keyof typeof VACIO, valor: string | number) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function validar(excludeId?: string): string {
    if (!form.titulo.trim()) return "El título es obligatorio.";
    if (!form.autor.trim()) return "El autor es obligatorio.";
    if (!form.isbn.trim()) return "El ISBN es obligatorio.";
    if (!/^\d{10,17}$/.test(form.isbn.trim())) return "ISBN inválido (10-17 dígitos).";
    if (!form.categoriaId) return "Selecciona una categoría.";
    if (form.stock < 0) return "El stock no puede ser negativo.";
    const dup = libros.find((l) => l.isbn === form.isbn.trim() && l.id !== excludeId);
    if (dup) return "Ya existe un libro con ese ISBN.";
    return "";
  }

  function guardar() {
    const err = validar(editandoId ?? undefined);
    if (err) { setError(err); return; }

    if (editandoId) {
      setLibros(libros.map((l) => l.id === editandoId ? { id: editandoId, ...form, isbn: form.isbn.trim() } : l));
      setEditandoId(null);
    } else {
      setLibros([...libros, { id: crypto.randomUUID(), ...form, isbn: form.isbn.trim() }]);
    }
    setForm({ ...VACIO });
    setError("");
  }

  function editar(id: string) {
    const l = libros.find((x) => x.id === id)!;
    setEditandoId(id);
    setForm({ titulo: l.titulo, autor: l.autor, isbn: l.isbn, categoriaId: l.categoriaId, stock: l.stock });
    setError("");
  }

  function eliminar(id: string) {
    const tieneActivos = prestamos.some((p) => p.libroId === id && p.estado === "Activo");
    if (tieneActivos) { setError("No se puede eliminar: tiene préstamos activos."); return; }
    setLibros(libros.filter((l) => l.id !== id));
  }

  function cancelar() {
    setEditandoId(null);
    setForm({ ...VACIO });
    setError("");
  }

  return (
    <div className="container">
      <h2>Gestión de Libros</h2>
      <form onSubmit={(e) => { e.preventDefault(); guardar(); }}>
        <input placeholder="Título" value={form.titulo} onChange={(e) => set("titulo", e.target.value)} />
        <input placeholder="Autor" value={form.autor} onChange={(e) => set("autor", e.target.value)} />
        <input placeholder="ISBN (10-17 dígitos)" value={form.isbn} onChange={(e) => set("isbn", e.target.value)} />
        <select value={form.categoriaId} onChange={(e) => set("categoriaId", e.target.value)}>
          <option value="">-- Categoría --</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          min={0}
          onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
          style={{ width: "80px" }}
        />
        <button type="submit">{editandoId ? "Actualizar" : "Agregar"}</button>
        {editandoId && <button type="button" onClick={cancelar}>Cancelar</button>}
      </form>
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr><th>Título</th><th>Autor</th><th>ISBN</th><th>Categoría</th><th>Stock</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {libros.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: "center" }}>Sin libros registrados</td></tr>
          )}
          {libros.map((l) => (
            <tr key={l.id}>
              <td>{l.titulo}</td>
              <td>{l.autor}</td>
              <td>{l.isbn}</td>
              <td>{categorias.find((c) => c.id === l.categoriaId)?.nombre ?? "—"}</td>
              <td>{l.stock}</td>
              <td>
                <button onClick={() => editar(l.id)}>Editar</button>{" "}
                <button className="danger" onClick={() => eliminar(l.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
