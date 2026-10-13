import { useState } from "react";
import { useBiblioteca } from "../../context/BibliotecaContext";
import { generarPDF } from "../../utils/comprobante";

type Filtro = "Todos" | "Activo" | "Devuelto";

export default function Historial() {
  const { prestamos, setPrestamos, libros, setLibros, usuarios, usuarioActivo } =
    useBiblioteca();
  const [filtro, setFiltro] = useState<Filtro>("Todos");

  const misPrestamos = prestamos.filter((p) => p.usuarioId === usuarioActivo);

  const visibles = misPrestamos.filter((p) => {
    if (filtro === "Todos") return true;
    return p.estado === filtro;
  });

  function devolver(id: string) {
    const prestamo = prestamos.find((p) => p.id === id)!;
    const fechaDevolucion = new Date().toLocaleDateString("es-PE");

    setPrestamos(
      prestamos.map((p) =>
        p.id === id ? { ...p, estado: "Devuelto", fechaDevolucion } : p
      )
    );
    setLibros(
      libros.map((l) => l.id === prestamo.libroId ? { ...l, stock: l.stock + 1 } : l)
    );
  }

  function descargarPDF(prestamo: typeof prestamos[number]) {
    const usuario = usuarios.find((u) => u.id === prestamo.usuarioId);
    const libro = libros.find((l) => l.id === prestamo.libroId);
    if (!usuario || !libro) return;
    generarPDF(prestamo, usuario, libro);
  }

  return (
    <div className="container">
      <h2>Historial de Préstamos</h2>

      {!usuarioActivo && (
        <p className="error" style={{ marginBottom: "1rem" }}>
          Selecciona un usuario activo en el Navbar para ver el historial.
        </p>
      )}

      {/* Filtros */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {(["Todos", "Activo", "Devuelto"] as Filtro[]).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              background: filtro === f ? "#1e40af" : "#e2e8f0",
              color: filtro === f ? "white" : "#1e293b",
              border: "none",
            }}
          >
            {f === "Todos" ? "Todos" : f === "Activo" ? "Activos" : "Devueltos"}
          </button>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Libro</th>
            <th>F. Préstamo</th>
            <th>F. Límite</th>
            <th>F. Devolución</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visibles.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", color: "#64748b" }}>
                {usuarioActivo ? "No hay préstamos." : "—"}
              </td>
            </tr>
          )}
          {visibles.map((p) => {
            const libro = libros.find((l) => l.id === p.libroId);
            return (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{libro?.titulo ?? "—"}</td>
                <td>{p.fechaPrestamo}</td>
                <td>{p.fechaLimite}</td>
                <td>{p.fechaDevolucion ?? "—"}</td>
                <td>
                  <span className={`badge ${p.estado === "Activo" ? "badge-activo" : "badge-devuelto"}`}>
                    {p.estado}
                  </span>
                </td>
                <td style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  <button onClick={() => descargarPDF(p)}>PDF</button>
                  {p.estado === "Activo" && (
                    <button className="success" onClick={() => devolver(p.id)}>
                      Devolver
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
