import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Categoria, Libro, Usuario, Prestamo } from "../types";

interface ContextType {
  categorias: Categoria[];
  setCategorias: (c: Categoria[]) => void;
  libros: Libro[];
  setLibros: (l: Libro[]) => void;
  usuarios: Usuario[];
  setUsuarios: (u: Usuario[]) => void;
  prestamos: Prestamo[];
  setPrestamos: (p: Prestamo[]) => void;
  usuarioActivo: string;
  setUsuarioActivo: (id: string) => void;
}

const BibliotecaContext = createContext<ContextType | null>(null);

export function BibliotecaProvider({ children }: { children: ReactNode }) {
  const [categorias, setCategorias] = useLocalStorage<Categoria[]>("categorias", []);
  const [libros, setLibros] = useLocalStorage<Libro[]>("libros", []);
  const [usuarios, setUsuarios] = useLocalStorage<Usuario[]>("usuarios", []);
  const [prestamos, setPrestamos] = useLocalStorage<Prestamo[]>("prestamos", []);
  const [usuarioActivo, setUsuarioActivo] = useLocalStorage<string>("usuarioActivo", "");

  return (
    <BibliotecaContext.Provider
      value={{
        categorias,
        setCategorias,
        libros,
        setLibros,
        usuarios,
        setUsuarios,
        prestamos,
        setPrestamos,
        usuarioActivo,
        setUsuarioActivo,
      }}
    >
      {children}
    </BibliotecaContext.Provider>
  );
}

export const useBiblioteca = () => {
  const ctx = useContext(BibliotecaContext);
  if (!ctx) {
    throw new Error("Debe usarse dentro de BibliotecaProvider");
  }
  return ctx;
};
