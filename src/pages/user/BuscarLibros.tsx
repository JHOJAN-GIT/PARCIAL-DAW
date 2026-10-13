import { useState } from 'react';
import { useBiblioteca } from '../../context/BibliotecaContext';
import { generarPDF } from '../../utils/comprobante';

export default function BuscarLibros() {
  const {
    libros, categorias, usuarios, prestamos, setPrestamos,
    setLibros, usuarioActivo
  } = useBiblioteca();

  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [ultimoPrestamo, setUltimoPrestamo] = useState<string | null>(null);

  const filtrados = libros.filter(l => {
    const catNombre = categorias.find(c => c.id === l.categoriaId)?.nombre.toLowerCase() || '';
    const coincide = l.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                     catNombre.includes(busqueda.toLowerCase());
    const enCategoria = !categoriaFiltro || l.categoriaId === categoriaFiltro;
    return coincide && enCategoria;
  });

  const solicitar = (libroId: string) => {
    if (!usuarioActivo) return alert('Debe iniciar sesión');
    const libro = libros.find(l => l.id === libroId);
    if (!libro || libro.stock <= 0) return alert('Sin stock disponible');

    const usuario = usuarios.find(u => u.id === usuarioActivo)!;
    const yaActivo = prestamos.some(
      p => p.usuarioId === usuarioActivo && p.libroId === libroId && p.estado === 'Activo'
    );
    if (yaActivo) return alert('Ya tiene un préstamo activo de este libro');

    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + 7);

    const nuevoPrestamo = {
      id: crypto.randomUUID(),
      codigo: 'PR-' + Date.now().toString().slice(-8),
      usuarioId: usuarioActivo,
      libroId,
      fechaPrestamo: hoy.toISOString().split('T')[0],
      fechaLimite: limite.toISOString().split('T')[0],
      estado: 'Activo' as const
    };

    setPrestamos([...prestamos, nuevoPrestamo]);
    setLibros(libros.map(l => l.id === libroId ? { ...l, stock: l.stock - 1 } : l));
    setUltimoPrestamo(nuevoPrestamo.id);
    generarPDF(nuevoPrestamo, usuario, libro);
  };

  const prestamoReciente = prestamos.find(p => p.id === ultimoPrestamo);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Catálogo de libros</h2>
        <p className="text-sm text-slate-500 mt-1">
          Busque y solicite préstamos de los recursos disponibles
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="grid md:grid-cols-2 gap-3">
          <input
            placeholder="Buscar por título o categoría..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <select
            value={categoriaFiltro}
            onChange={e => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {!usuarioActivo && (
        <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
          Debe iniciar sesión como usuario para solicitar préstamos.
        </div>
      )}

      {/* Grid de libros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados.map(l => (
          <div key={l.id} className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded border ${
                l.stock > 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {l.stock > 0 ? `${l.stock} disponibles` : 'Sin stock'}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1 leading-snug">{l.titulo}</h3>
            <p className="text-sm text-slate-600 mb-3">{l.autor}</p>
            <dl className="text-xs space-y-1.5 mb-4">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">ISBN</dt>
                <dd className="text-slate-700 font-mono">{l.isbn}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Categoría</dt>
                <dd className="text-slate-700">{categorias.find(c => c.id === l.categoriaId)?.nombre}</dd>
              </div>
            </dl>
            <button
              disabled={l.stock <= 0 || !usuarioActivo}
              onClick={() => solicitar(l.id)}
              className="mt-auto w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-md transition text-sm"
            >
              {l.stock > 0 ? 'Solicitar préstamo' : 'No disponible'}
            </button>
          </div>
        ))}
        {filtrados.length === 0 && (
          <div className="col-span-full bg-white border border-dashed border-slate-300 rounded-lg py-16 text-center">
            <p className="text-sm text-slate-500">No se encontraron libros con los filtros aplicados</p>
          </div>
        )}
      </div>

      {/* Comprobante reciente */}
      {prestamoReciente && (
        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-600 rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Préstamo registrado correctamente</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprobante N.º {prestamoReciente.codigo}
              </p>
            </div>
            <button
              onClick={() => {
                const u = usuarios.find(x => x.id === prestamoReciente.usuarioId)!;
                const lib = libros.find(x => x.id === prestamoReciente.libroId)!;
                generarPDF(prestamoReciente, u, lib);
              }}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-1.5 rounded-md font-medium transition text-sm"
            >
              Descargar PDF
            </button>
          </div>
          <dl className="grid md:grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500 uppercase tracking-wide">Fecha de préstamo</dt>
              <dd className="text-slate-900 mt-0.5">{prestamoReciente.fechaPrestamo}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase tracking-wide">Fecha límite</dt>
              <dd className="text-slate-900 mt-0.5">{prestamoReciente.fechaLimite}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase tracking-wide">Estado</dt>
              <dd className="text-slate-900 mt-0.5">{prestamoReciente.estado}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}