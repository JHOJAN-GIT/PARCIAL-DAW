import { useState } from "react";
import { useBiblioteca } from "../../context/BibliotecaContext";
import { generarPDF } from "../../utils/comprobante";

type Filtro = "Todos" | "Activo" | "Devuelto";

export default function Historial() {
  const { prestamos, setPrestamos, libros, setLibros, usuarios, usuarioActivo } = useBiblioteca();
  const [filtro, setFiltro] = useState<Filtro>("Todos");

  const misPrestamos = prestamos.filter((p) => p.usuarioId === usuarioActivo);
  const visibles = misPrestamos.filter((p) =>
    filtro === "Todos" ? true : p.estado === filtro
  );

  function devolver(id: string) {
    const prestamo = prestamos.find((p) => p.id === id)!;
    const fechaDevolucion = new Date().toLocaleDateString("es-PE");
    setPrestamos(prestamos.map((p) =>
      p.id === id ? { ...p, estado: "Devuelto", fechaDevolucion } : p
    ));
    setLibros(libros.map((l) =>
      l.id === prestamo.libroId ? { ...l, stock: l.stock + 1 } : l
    ));
  }

  function descargarPDF(prestamo: typeof prestamos[number]) {
    const usuario = usuarios.find((u) => u.id === prestamo.usuarioId);
    const libro = libros.find((l) => l.id === prestamo.libroId);
    if (!usuario || !libro) return;
    generarPDF(prestamo, usuario, libro);
  }

  const filtrosBtns: { label: string; value: Filtro }[] = [
    { label: "📋 Todos", value: "Todos" },
    { label: "🟢 Activos", value: "Activo" },
    { label: "✅ Devueltos", value: "Devuelto" },
  ];

  return (
    <div className="container">
      <h2>📋 Historial de Préstamos</h2>

      {!usuarioActivo && (
        <div className="alert-info">
          👤 Selecciona un <strong>usuario activo</strong> en el Navbar para ver el historial.
        </div>
      )}

      {/* Filtros */}
      <div className="filtros">
        {filtrosBtns.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFiltro(value)}
            className={filtro === value ? "" : "secondary"}
            style={filtro === value ? { background: "#1e40af" } : {}}
          >
            {label}
          </button>
        ))}
        {usuarioActivo && (
          <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: "#64748b", alignSelf: "center" }}>
            {visibles.length} registro{visibles.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Libro</th>
              <th>F. Préstamo</th>
              <th>F. Límite</th>
              <th>F. Devolución</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>
                  {usuarioActivo ? "No hay préstamos para mostrar." : "—"}
                </td>
              </tr>
            ) : (
              visibles.map((p) => {
                const libro = libros.find((l) => l.id === p.libroId);
                const vencido =
                  p.estado === "Activo" &&
                  new Date(p.fechaLimite.split("/").reverse().join("-")) < new Date();
                return (
                  <tr key={p.id}>
                    <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{p.codigo}</td>
                    <td style={{ fontWeight: 600 }}>{libro?.titulo ?? "—"}</td>
                    <td style={{ color: "#64748b" }}>{p.fechaPrestamo}</td>
                    <td style={{ color: vencido ? "#dc2626" : "#64748b", fontWeight: vencido ? 700 : 400 }}>
                      {p.fechaLimite} {vencido && "⚠️"}
                    </td>
                    <td style={{ color: "#64748b" }}>{p.fechaDevolucion ?? "—"}</td>
                    <td>
                      <span
                        className={`badge ${p.estado === "Activo" ? "badge-activo" : "badge-devuelto"}`}
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        style={{ marginRight: "0.4rem", padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                        onClick={() => descargarPDF(p)}
                      >
                        📄 PDF
                      </button>
                      {p.estado === "Activo" && (
                        <button
                          className="success"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                          onClick={() => devolver(p.id)}
                        >
                          ↩️ Devolver
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
