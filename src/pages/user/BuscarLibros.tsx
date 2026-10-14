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
    const cat = categorias.find((c) => c.id === l.categoriaId)?.nombre ?? "";
    const coincideTexto =
      l.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      cat.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria ? l.categoriaId === filtroCategoria : true;
    return coincideTexto && coincideCategoria;
  });

  function solicitar(libroId: string) {
    if (!usuarioActivo) return;
    const libro = libros.find((l) => l.id === libroId)!;
    if (libro.stock <= 0) return;

    const nuevo: Prestamo = {
      id: crypto.randomUUID(),
      codigo: codigoPrestamo(),
      usuarioId: usuarioActivo,
      libroId,
      fechaPrestamo: hoy(),
      fechaLimite: fechaSuma(14),
      estado: "Activo",
    };

    setPrestamos([...prestamos, nuevo]);
    setLibros(libros.map((l) => l.id === libroId ? { ...l, stock: l.stock - 1 } : l));
    setUltimoPrestamo(nuevo);

    const usuario = usuarios.find((u) => u.id === usuarioActivo)!;
    generarPDF(nuevo, usuario, libro);
  }

  const usuarioObj = usuarios.find((u) => u.id === usuarioActivo);

  return (
    <div className="container">
      <h2>🔍 Buscar y Solicitar Libros</h2>

      {/* Buscador */}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          placeholder="🔎 Buscar por título o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ flex: 1, minWidth: "240px" }}
        />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{ minWidth: "180px" }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </form>

      {/* Aviso sin usuario */}
      {!usuarioActivo && (
        <div className="alert-info">
          👤 Selecciona un <strong>usuario activo</strong> en el Navbar para poder solicitar préstamos.
        </div>
      )}

      {/* Comprobante reciente */}
      {ultimoPrestamo && (
        <div style={{
          background: "#f0fdf4",
          border: "1.5px solid #86efac",
          borderRadius: "10px",
          padding: "1rem 1.25rem",
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}>
          <div>
            <p style={{ fontWeight: 700, color: "#15803d", marginBottom: "0.25rem" }}>
              ✅ Préstamo registrado exitosamente
            </p>
            <p style={{ fontSize: "0.85rem", color: "#166534" }}>
              Código: <strong>{ultimoPrestamo.codigo}</strong> &nbsp;·&nbsp;
              Préstamo: {ultimoPrestamo.fechaPrestamo} &nbsp;·&nbsp;
              Límite: {ultimoPrestamo.fechaLimite}
            </p>
          </div>
          <button
            className="success"
            onClick={() => {
              const libro = libros.find((l) => l.id === ultimoPrestamo.libroId)!;
              const usuario = usuarios.find((u) => u.id === ultimoPrestamo.usuarioId)!;
              generarPDF(ultimoPrestamo, usuario, libro);
            }}
          >
            📄 Descargar PDF
          </button>
        </div>
      )}

      {/* Tarjetas */}
      <div className="grid">
        {librosFiltrados.length === 0 && (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#94a3b8", padding: "2rem 0" }}>
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
              <p>✍️ {l.autor}</p>
              <p>🏷️ {categoria?.nombre ?? "—"}</p>
              <p style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>ISBN: {l.isbn}</p>
              <p style={{ margin: "0.6rem 0" }}>
                Stock:{" "}
                <span
                  className="badge"
                  style={sinStock
                    ? { background: "#fee2e2", color: "#dc2626" }
                    : { background: "#dcfce7", color: "#15803d" }}
                >
                  {l.stock} disponibles
                </span>
              </p>
              <button
                className="success"
                style={{ width: "100%", marginTop: "0.5rem" }}
                disabled={sinStock || sinUsuario}
                onClick={() => solicitar(l.id)}
                title={
                  sinUsuario ? "Selecciona un usuario activo" :
                  sinStock ? "Sin stock disponible" :
                  `Solicitar como ${usuarioObj?.nombres ?? ""}`
                }
              >
                {sinStock ? "❌ Sin stock" : "📚 Solicitar Préstamo"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
