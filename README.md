# Sistema de Gestión de Biblioteca

> Proyecto Parcial — Desarrollo de Aplicaciones Web

---

## Integrantes

| Integrante | Código | Rol |
|---|---|---|
| **Antezana Villegas, Jhojan Manuel** | — | Lógica e implementación de estructura |
| **Camargo Alvarado, Edison Roberto** | — | Interfaz visual y componentes frontend |

**Facultad de Ingeniería de Sistemas**
**Universidad Nacional del Centro del Perú (UNCP)**

---

## División de trabajo

### Jhojan Manuel Antezana Villegas
Se encargó de toda la lógica del sistema e implementación de la estructura del proyecto:
- Arquitectura del proyecto (rutas, contexto global, hooks)
- `context/BibliotecaContext.tsx` — estado global con React Context
- `hooks/useLocalStorage.ts` — persistencia en Local Storage
- `types/index.ts` — definición de interfaces TypeScript
- `pages/user/BuscarLibros.tsx` — lógica de búsqueda, filtros y solicitud de préstamos
- `pages/user/Historial.tsx` — lógica de historial, filtros y devolución de libros
- `utils/comprobante.ts` — generación de PDF con jsPDF
- Configuración base: `App.tsx`, `main.tsx`, `vite.config.ts`

### Edison Roberto Camargo Alvarado
Se encargó de toda la interfaz visual y componentes de administración:
- `components/Navbar.tsx` — barra de navegación con selector de usuario activo
- `pages/admin/AdminCategorias.tsx` — módulo CRUD de categorías
- `pages/admin/AdminLibros.tsx` — módulo CRUD de libros
- `pages/admin/AdminUsuarios.tsx` — módulo CRUD de usuarios
- `index.css` — estilos globales (navbar, tablas, formularios, tarjetas, badges)

---

## Tecnologías usadas

- **React 19** + **TypeScript**
- **Vite 8**
- **React Router DOM v7**
- **Tailwind CSS v4**
- **jsPDF** — generación de comprobantes PDF
- **Local Storage** — persistencia de datos sin backend

---

## Instalación y ejecución

```bash
npm install
npm run dev
```

---

## Flujo del sistema

1. Ir a **Categorías** → crear las categorías de libros
2. Ir a **Libros** → registrar libros (requiere categorías creadas)
3. Ir a **Usuarios** → registrar los usuarios del sistema
4. En el **Navbar** → seleccionar el usuario activo en el dropdown
5. Ir a **Buscar y Prestar** → buscar libros y solicitar préstamos (genera PDF automático)
6. Ir a **Historial** → ver préstamos, descargar PDF o devolver libros

---

## Estructura del proyecto

```
src/
├── assets/
├── components/
│   └── Navbar.tsx
├── context/
│   └── BibliotecaContext.tsx
├── hooks/
│   └── useLocalStorage.ts
├── pages/
│   ├── admin/
│   │   ├── AdminCategorias.tsx
│   │   ├── AdminLibros.tsx
│   │   └── AdminUsuarios.tsx
│   └── user/
│       ├── BuscarLibros.tsx
│       └── Historial.tsx
├── types/
│   └── index.ts
├── utils/
│   └── comprobante.ts
├── App.tsx
├── main.tsx
└── index.css
```
