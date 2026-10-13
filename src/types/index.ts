export interface Categoria {
  id: string;
  nombre: string;
}

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  categoriaId: string;
  stock: number;
}

export interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  codigo: string;
  correo: string;
  tipo: "Estudiante" | "Docente";
}

export interface Prestamo {
  id: string;
  codigo: string;
  usuarioId: string;
  libroId: string;
  fechaPrestamo: string;
  fechaLimite: string;
  fechaDevolucion?: string;
  estado: "Activo" | "Devuelto";
}
