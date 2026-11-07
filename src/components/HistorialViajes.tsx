import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { Reserva } from '../types';
import { 
  History, 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Printer, 
  RotateCcw, 
  UtensilsCrossed, 
  Phone, 
  Copy, 
  Check, 
  Search,
  Filter,
  Plus,
  Heart,
  Star
} from 'lucide-react';

export const HistorialViajes: React.FC = () => {
  const { 
    reservas, 
    salidas, 
    usuarioActual, 
    setActiveTab, 
    setPuntoPartida, 
    setPuntoLlegada, 
    setBookingStep,
    setCodigoSeguimientoSeleccionado,
    setReservaParaValorar
  } = useTransport();

  const [filtro, setFiltro] = useState<'todos' | 'proximos' | 'completados'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [reservaModalQR, setReservaModalQR] = useState<Reserva | null>(null);

  // Filtrar reservas que pertenezcan al pasajero actual (o todas si es demo)
  const misViajes = reservas.filter((r) => {
    if (usuarioActual?.rol === 'pasajero') {
      const coincideNombre = r.pasajeroNombre.toLowerCase().includes(usuarioActual.nombre.toLowerCase().split(' ')[0]);
      const coincideTel = usuarioActual.telefono ? r.pasajeroTelefono.includes(usuarioActual.telefono.slice(-4)) : false;
      return coincideNombre || coincideTel || r.id.startsWith('CHIVA');
    }
    return true;
  });

  // Filtrado por estado y búsqueda
  const viajesFiltrados = misViajes.filter((v) => {
    // Filtro estado
    if (filtro === 'proximos' && v.estadoPago !== 'pagado' && !v.id.includes('8821')) return false;
    if (filtro === 'completados' && v.id.includes('8821')) return false;

    // Filtro texto
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return (
      v.id.toLowerCase().includes(q) ||
      v.puntoPartidaPersonalizado.toLowerCase().includes(q) ||
      v.puntoLlegadaPersonalizado.toLowerCase().includes(q) ||
      v.pasajeroNombre.toLowerCase().includes(q)
    );
  });

  const handleCopiar = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCopiadoId(codigo);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const handleRepetirViaje = (reserva: Reserva) => {
    setPuntoPartida(reserva.puntoPartidaPersonalizado);
    setPuntoLlegada(reserva.puntoLlegadaPersonalizado);
    setBookingStep(2);
    setActiveTab('pasajero');
  };

  const totalGastado = misViajes
    .filter((v) => v.estadoPago === 'pagado')
    .reduce((acc, v) => acc + v.total, 0);

  const totalAsientosViajados = misViajes.reduce((acc, v) => acc + v.asientos.length, 0);

  return (
    <div className="h-full flex flex-col min-h-0 bg-slate-100 select-none overflow-y-auto p-3 sm:p-6 max-w-6xl w-full mx-auto animate-fadeIn">
      {/* Cabecera Superior con Estadísticas */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl mb-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold shrink-0">
              <History className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md">
                  Pasajero Frecuente
                </span>
                <span className="text-xs text-slate-400">Ruta Ibarra ➔ Quito</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Mis Viajes & Boletos Anteriores
              </h1>
              <p className="text-xs text-slate-400">
                Revisa el historial de tus trayectos ejecutivos, pases de abordar QR y refrigerios incluidos.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setBookingStep(1);
              setActiveTab('pasajero');
            }}
            className="self-start sm:self-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Reservar Nuevo Viaje</span>
          </button>
        </div>

        {/* Tarjetas KPI de Resumen */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-800">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Viajes Registrados</span>
            <span className="text-lg font-black text-white">{misViajes.length} viajes</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Asientos</span>
            <span className="text-lg font-black text-emerald-400">{totalAsientosViajados} asientos</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Inversión Viajes</span>
            <span className="text-lg font-black text-emerald-400">${totalGastado} USD</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        {/* Pestañas de Filtro */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 gap-1">
          <button
            type="button"
            onClick={() => setFiltro('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filtro === 'todos'
                ? 'bg-emerald-500 text-slate-950 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({misViajes.length})
          </button>

          <button
            type="button"
            onClick={() => setFiltro('proximos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filtro === 'proximos'
                ? 'bg-emerald-500 text-slate-950 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Confirmados / Próximos
          </button>

          <button
            type="button"
            onClick={() => setFiltro('completados')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filtro === 'completados'
                ? 'bg-emerald-500 text-slate-950 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completados
          </button>
        </div>

        {/* Buscador */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por destino, código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Lista de Viajes Anteriores */}
      <div className="space-y-3.5 flex-1 min-h-0">
        {viajesFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-6">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">
              No se encontraron viajes registrados
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              ¿Vas a viajar a Quito pronto? Elige tus asientos y reserva en minutos sin transbordos molestos.
            </p>
            <button
              type="button"
              onClick={() => {
                setBookingStep(1);
                setActiveTab('pasajero');
              }}
              className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all"
            >
              ¡A Quito, a Quito! Reservar Ahora
            </button>
          </div>
        ) : (
          viajesFiltrados.map((viaje) => {
            const salidaInfo = salidas.find((s) => s.id === viaje.salidaId);
            const esPagado = viaje.estadoPago === 'pagado';

            return (
              <div
                key={viaje.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow p-4 sm:p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Información Principal de la Ruta */}
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-mono">
                        {viaje.id}
                      </span>

                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {salidaInfo?.fecha || viaje.fechaCreacion.split(' ')[0]}
                      </span>

                      <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {salidaInfo?.horaSalida || 'Turno Ejecutivo'} hrs
                      </span>

                      {esPagado ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Pagado & Confirmado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Pendiente al abordar
                        </span>
                      )}
                    </div>

                    {/* Origen y Destino Personalizados */}
                    <div className="space-y-1">
                      <div className="flex items-start gap-1.5 text-xs">
                        <span className="font-extrabold text-emerald-700 shrink-0">Subida (Ibarra):</span>
                        <span className="text-slate-800 font-semibold">{viaje.puntoPartidaPersonalizado}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-xs">
                        <span className="font-extrabold text-slate-900 shrink-0">Llegada (Quito):</span>
                        <span className="text-slate-800 font-semibold">{viaje.puntoLlegadaPersonalizado}</span>
                      </div>
                    </div>

                    {/* Detalles de Conductor, Asientos y Refrigerio */}
                    <div className="flex items-center gap-3 flex-wrap text-xs pt-1">
                      {/* Asientos */}
                      <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <span className="text-slate-400 font-bold">Asientos:</span>
                        <div className="flex items-center gap-1">
                          {viaje.asientos.map((a) => (
                            <span key={a} className="px-1.5 py-0.2 bg-emerald-600 text-white font-black rounded text-[10px]">
                              #{a}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Refrigerio si tiene */}
                      {viaje.refrigerio && (
                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg font-bold capitalize">
                          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
                          <span>
                            {viaje.refrigerio.comida} + {viaje.refrigerio.bebida}
                          </span>
                        </div>
                      )}

                      {/* Conductor */}
                      {salidaInfo && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Car className="w-3.5 h-3.5 text-slate-400" />
                          <span>{salidaInfo.conductor.vehiculo.split('(')[0]}</span>
                          <span className="font-bold text-slate-800">• {salidaInfo.conductor.placa}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna Derecha: Tarifa, QR y Botones de Acción */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0 gap-3">
                    <div className="text-left lg:text-right">
                      <span className="text-lg font-black text-slate-900 block leading-tight">
                        ${viaje.total} USD
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        Pago {viaje.metodoPago}
                      </span>
                      {viaje.calificacion ? (
                        <div className="flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg mt-1 inline-flex">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{viaje.calificacion}/5 estrellas</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {/* Calificar Conductor (si aún no tiene calificación) */}
                      {!viaje.calificacion && (
                        <button
                          type="button"
                          onClick={() => setReservaParaValorar(viaje)}
                          title="Calificar Conductor y Servicio"
                          className="p-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span className="hidden sm:inline">Calificar</span>
                        </button>
                      )}

                      {/* Ver QR Pase de abordar */}
                      <button
                        type="button"
                        onClick={() => setReservaModalQR(viaje)}
                        title="Ver Pase de Abordar con QR"
                        className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <QrCode className="w-4 h-4 text-slate-800" />
                        <span className="hidden sm:inline">Pase QR</span>
                      </button>

                      {/* Copiar Código */}
                      <button
                        type="button"
                        onClick={() => handleCopiar(viaje.id)}
                        title="Copiar código de reserva"
                        className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                      >
                        {copiadoId === viaje.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-500" />
                        )}
                      </button>

                      {/* Rastrear Guambra */}
                      <button
                        type="button"
                        onClick={() => {
                          setCodigoSeguimientoSeleccionado(viaje.id);
                          setActiveTab('guambra');
                        }}
                        title="Seguir viaje en vivo en ¿Cómo estás mi guambra?"
                        className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-rose-600 fill-rose-500/20" />
                        <span className="hidden sm:inline">Rastrear</span>
                      </button>

                      {/* Repetir Viaje */}
                      <button
                        type="button"
                        onClick={() => handleRepetirViaje(viaje)}
                        title="Repetir este mismo viaje"
                        className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-1 transition-all active:scale-95 shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="hidden sm:inline">Repetir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Pase QR / Boleto Digital */}
      {reservaModalQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-black uppercase text-emerald-700">Pase de Abordaje Chiva</span>
              <button
                type="button"
                onClick={() => setReservaModalQR(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto">
              <QrCode className="w-32 h-32 mx-auto text-slate-900" />
              <span className="text-xs font-mono font-black text-slate-800 block mt-2">
                {reservaModalQR.id}
              </span>
            </div>

            <div className="text-left text-xs space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="truncate">
                <strong>Pasajero:</strong> {reservaModalQR.pasajeroNombre}
              </p>
              <p className="truncate">
                <strong>Recogida:</strong> {reservaModalQR.puntoPartidaPersonalizado}
              </p>
              <p className="truncate">
                <strong>Destino:</strong> {reservaModalQR.puntoLlegadaPersonalizado}
              </p>
              <p>
                <strong>Asientos:</strong> [#{reservaModalQR.asientos.join(', #')}] • ${reservaModalQR.total} USD
              </p>
              {reservaModalQR.refrigerio && (
                <p className="text-amber-800 capitalize">
                  <strong>Refrigerio:</strong> {reservaModalQR.refrigerio.comida} + {reservaModalQR.refrigerio.bebida}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>

              <button
                type="button"
                onClick={() => setReservaModalQR(null)}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
