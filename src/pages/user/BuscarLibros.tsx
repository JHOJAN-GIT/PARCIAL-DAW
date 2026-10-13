import { useState } from "react";
import { useBiblioteca } from "../../context/BibliotecaContext";
import { generarPDF } from "../../utils/comprobante";
import type { Prestamo } from "../../types";

function fechaSuma(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toLocaleDateString("es-PE");
}

function hoy(): string {
  return new Date().toLocaleDateString("es-PE");
}

function codigoPrestamo(): string {
  return "PRES-" + Date.now().toString().slice(-6);
}

export default function BuscarLibros() {
  const { libros, categorias, usuarios, prestamos, setPrestamos, setLibros, usuarioActivo } =
    useBiblioteca();

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [ultimoPrestamo, setUltimoPrestamo] = useState<Prestamo | null>(null);

  const librosFiltrados = libros.filter((l) => {
    const coincideTexto =
      l.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      categorias.find((c) => c.id === l.categoriaId)?.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria ? l.categoriaId === filtroCategoria : true;
    return coincideTexto && coincideCategoria;
  });

  function solicitar(libroId: string) {
    if (!usuarioActivo) return;

    const libro = libros.find((l) => l.id === libroId)!;
    if (libro.stock <= 0) return;

    const nuevoPrestamo: Prestamo = {
      id: crypto.randomUUID(),
      codigo: codigoPrestamo(),
      usuarioId: usuarioActivo,
      libroId,
      fechaPrestamo: hoy(),
      fechaLimite: fechaSuma(14),
      estado: "Activo",
    };

    setPrestamos([...prestamos, nuevoPrestamo]);
    setLibros(libros.map((l) => l.id === libroId ? { ...l, stock: l.stock - 1 } : l));
    setUltimoPrestamo(nuevoPrestamo);

    // Generar PDF automáticamente
    const usuario = usuarios.find((u) => u.id === usuarioActivo)!;
    generarPDF(nuevoPrestamo, usuario, libro);
  }

  const usuarioObj = usuarios.find((u) => u.id === usuarioActivo);

  return (
    <div className="container">
      <h2>Buscar y Solicitar Libros</h2>

      {/* Buscador y filtro */}
      <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Buscar por título o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ minWidth: "250px" }}
        />
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </form>

      {!usuarioActivo && (
        <p className="error" style={{ marginBottom: "1rem" }}>
          Selecciona un usuario activo en el Navbar para solicitar préstamos.
        </p>
      )}

      {/* Comprobante reciente */}
      {ultimoPrestamo && (
        <div
          style={{
            background: "#dbeafe",
            border: "1px solid #93c5fd",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <strong>✅ Préstamo registrado</strong>
          <p>Código: <strong>{ultimoPrestamo.codigo}</strong></p>
          <p>Fecha préstamo: {ultimoPrestamo.fechaPrestamo} — Límite: {ultimoPrestamo.fechaLimite}</p>
          <button
            className="success"
            style={{ marginTop: "0.5rem" }}
            onClick={() => {
              const libro = libros.find((l) => l.id === ultimoPrestamo.libroId)!;
              const usuario = usuarios.find((u) => u.id === ultimoPrestamo.usuarioId)!;
              generarPDF(ultimoPrestamo, usuario, libro);
            }}
          >
            Descargar PDF
          </button>
        </div>
      )}

      {/* Tarjetas de libros */}
      <div className="grid">
        {librosFiltrados.length === 0 && (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#64748b" }}>
            No se encontraron libros.
          </p>
        )}
        {librosFiltrados.map((l) => {
          const categoria = categorias.find((c) => c.id === l.categoriaId);
          const sinStock = l.stock === 0;
          const sinUsuario = !usuarioActivo;
          return (
            <div className="card" key={l.id}>
              <h3>{l.titulo}</h3>
              <p style={{ fontSize: "0.9rem", color: "#475569" }}>{l.autor}</p>
              <p style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>
                Categoría: {categoria?.nombre ?? "—"}
              </p>
              <p style={{ fontSize: "0.85rem" }}>ISBN: {l.isbn}</p>
              <p style={{ marginTop: "0.5rem" }}>
                Stock:{" "}
                <span
                  className={`badge ${sinStock ? "badge-devuelto" : "badge-activo"}`}
                  style={sinStock ? { background: "#fee2e2", color: "#991b1b" } : {}}
                >
                  {l.stock}
                </span>
              </p>
              <button
                className="success"
                style={{ marginTop: "0.75rem", width: "100%" }}
                disabled={sinStock || sinUsuario}
                onClick={() => solicitar(l.id)}
                title={
                  sinUsuario
                    ? "Selecciona un usuario activo"
                    : sinStock
                    ? "Sin stock disponible"
                    : `Solicitar como ${usuarioObj?.nombres ?? ""}`
                }
              >
                {sinStock ? "Sin stock" : "Solicitar Préstamo"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
