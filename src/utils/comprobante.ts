import jsPDF from "jspdf";
import type { Prestamo, Usuario, Libro } from "../types";

export function generarPDF(prestamo: Prestamo, usuario: Usuario, libro: Libro) {
  const doc = new jsPDF();

  // Encabezado azul
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("BIBLIOTECA - COMPROBANTE DE PRÉSTAMO", 105, 18, { align: "center" });

  // Datos del usuario
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Datos del Usuario", 14, 45);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Nombre: ${usuario.nombres} ${usuario.apellidos}`, 14, 54);
  doc.text(`Código: ${usuario.codigo}`, 14, 61);
  doc.text(`Correo: ${usuario.correo}`, 14, 68);
  doc.text(`Tipo: ${usuario.tipo}`, 14, 75);

  // Línea separadora
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 80, 196, 80);

  // Datos del libro
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Datos del Libro", 14, 90);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Título: ${libro.titulo}`, 14, 99);
  doc.text(`Autor: ${libro.autor}`, 14, 106);
  doc.text(`ISBN: ${libro.isbn}`, 14, 113);

  // Línea separadora
  doc.line(14, 118, 196, 118);

  // Datos del préstamo
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Datos del Préstamo", 14, 128);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Código de préstamo: ${prestamo.codigo}`, 14, 137);
  doc.text(`Fecha de préstamo: ${prestamo.fechaPrestamo}`, 14, 144);
  doc.text(`Fecha límite: ${prestamo.fechaLimite}`, 14, 151);
  doc.text(`Estado: ${prestamo.estado}`, 14, 158);
  if (prestamo.fechaDevolucion) {
    doc.text(`Fecha de devolución: ${prestamo.fechaDevolucion}`, 14, 165);
  }

  // Pie de página
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 275, 210, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("Sistema de Gestión de Biblioteca", 105, 284, { align: "center" });
  doc.text(`Generado el ${new Date().toLocaleString("es-PE")}`, 105, 291, { align: "center" });

  doc.save(`prestamo-${prestamo.codigo}.pdf`);
}
