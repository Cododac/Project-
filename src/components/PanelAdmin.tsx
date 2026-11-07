import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { ModalNuevaSalida } from './ModalNuevaSalida';
import { ModalEscanerQR } from './ModalEscanerQR';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Banknote, 
  CheckCircle, 
  Clock, 
  Phone, 
  MessageSquare, 
  Search, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Bus, 
  DollarSign, 
  Copy, 
  Check, 
  Filter, 
  Car, 
  Smartphone,
  QrCode
} from 'lucide-react';

export const PanelAdmin: React.FC = () => {
  const { 
    salidasConEstado, 
    reservas, 
    marcarComoPagada, 
    cancelarReserva 
  } = useTransport();

  const [salidaSeleccionadaFiltro, setSalidaSeleccionadaFiltro] = useState<string>('todas');
  const [busquedaPasajero, setBusquedaPasajero] = useState('');
  const [mostrarModalNueva, setMostrarModalNueva] = useState(false);
  const [mostrarModalEscaner, setMostrarModalEscaner] = useState(false);
  const [asientoDestacado, setAsientoDestacado] = useState<number | null>(null);
  const [manifiestoCopiadoId, setManifiestoCopiadoId] = useState<string | null>(null);

  const salidasMostradas = salidasConEstado.filter((salida) => {
    if (salidaSeleccionadaFiltro !== 'todas' && salida.id !== salidaSeleccionadaFiltro) {
      return false;
    }
    return true;
  });

  const totalPasajeros = reservas.reduce((acc, r) => acc + r.asientos.length, 0);
  const totalRecaudado = reservas
    .filter((r) => r.estadoPago === 'pagado')
    .reduce((acc, r) => acc + r.total, 0);
  const totalPendiente = reservas
    .filter((r) => r.estadoPago === 'pendiente')
    .reduce((acc, r) => acc + r.total, 0);

  const handleCopiarManifiesto = (salidaId: string) => {
    const salida = salidasConEstado.find((s) => s.id === salidaId);
    if (!salida) return;

    let texto = `*MANIFIESTO DE RUTA: IBARRA ➔ QUITO*\n`;
    texto += `Turno: ${salida.id} | Fecha: ${salida.fecha} | Hora: ${salida.horaSalida} hrs\n`;
    texto += `Conductor: ${salida.conductor.nombre} (Placa: ${salida.conductor.placa})\n`;
    texto += `Pasajeros: ${salida.asientosOcupados.length}/${salida.totalAsientos} asientos ocupados\n`;
    texto += `====================================\n`;

    if (salida.reservas.length === 0) {
      texto += `Sin reservas registradas aún.\n`;
    } else {
      salida.reservas.forEach((r, idx) => {
        texto += `\n${idx + 1}. ${r.pasajeroNombre} (${r.pasajeroTelefono})\n`;
        texto += `   • Asientos: [${r.asientos.join(', ')}]\n`;
        texto += `   • Recoger en: ${r.puntoPartidaPersonalizado || 'Ibarra'}\n`;
        texto += `   • Dejar en: ${r.puntoLlegadaPersonalizado || 'Quito'}\n`;
        texto += `   • Pago: ${r.metodoPago.toUpperCase()} ($${r.total} USD) - ${r.estadoPago.toUpperCase()}\n`;
      });
    }

    navigator.clipboard.writeText(texto);
    setManifiestoCopiadoId(salidaId);
    setTimeout(() => setManifiestoCopiadoId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabecera del Panel */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Panel de Administración y Conductor (Ruta Ibarra - Quito)
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Control de Pasajeros, Asientos y Destinos Flexibles
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Supervisa las salidas de Ibarra a Quito, consulta el punto exacto de recogida y destino de cada pasajero, y marca los cobros en efectivo, Payphone o tarjeta.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
            <button
              type="button"
              onClick={() => setMostrarModalEscaner(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
              title="Escanear pase QR de pasajero para confirmar abordaje"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              Escanear QR Boleto
            </button>

            <button
              type="button"
              onClick={() => setMostrarModalNueva(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Nueva Salida Ibarra-Quito
            </button>
          </div>
        </div>

        {/* Tarjetas KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Total Pasajes
              </span>
              <span className="text-lg font-black text-white">
                {totalPasajeros} asientos
              </span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Total Cobrado / Pagado
              </span>
              <span className="text-lg font-black text-emerald-400">
                ${totalRecaudado} USD
              </span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Por Cobrar (Efectivo)
              </span>
              <span className="text-lg font-black text-amber-400">
                ${totalPendiente} USD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={salidaSeleccionadaFiltro}
              onChange={(e) => setSalidaSeleccionadaFiltro(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              <option value="todas">Todos los turnos programados ({salidasConEstado.length})</option>
              {salidasConEstado.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}: Salida {s.horaSalida} hrs - {s.asientosOcupados.length}/{s.totalAsientos} asientos ocupados
                </option>
              ))}
            </select>
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar pasajero, teléfono o código..."
              value={busquedaPasajero}
              onChange={(e) => setBusquedaPasajero(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Salidas y Pasajeros Agrupados */}
      <div className="space-y-6">
        {salidasMostradas.map((salida) => {
          const reservasDeEstaSalida = salida.reservas.filter((r) => {
            if (!busquedaPasajero.trim()) return true;
            const query = busquedaPasajero.toLowerCase();
            return (
              r.pasajeroNombre.toLowerCase().includes(query) ||
              r.pasajeroTelefono.toLowerCase().includes(query) ||
              r.id.toLowerCase().includes(query) ||
              r.puntoPartidaPersonalizado.toLowerCase().includes(query) ||
              r.puntoLlegadaPersonalizado.toLowerCase().includes(query)
            );
          });

          return (
            <div
              key={salida.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden"
            >
              {/* Encabezado del Turno */}
              <div className="p-5 bg-gradient-to-r from-slate-50 to-emerald-50/40 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-600 text-white uppercase tracking-wider">
                      Turno {salida.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {salida.fecha}
                    </span>
                    <span className="text-xs font-black text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" /> {salida.horaSalida} hrs (Llegada est. {salida.horaLlegadaEstimada})
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ibarra (Puntos Flexibles)</span>
                    <span className="text-slate-400 font-normal">➔</span>
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Quito (Destinos Flexibles)</span>
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    <strong>Vehículo:</strong> {salida.conductor.vehiculo} • <strong>Placa:</strong> {salida.conductor.placa} • <strong>Chofer:</strong> {salida.conductor.nombre}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium">Ocupación</div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-base font-black text-slate-900">
                        {salida.asientosOcupados.length} / {salida.totalAsientos}
                      </span>
                      <span className="text-xs text-slate-500">asientos</span>
                    </div>
                    <div className="w-28 bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${salida.porcentajeOcupacion}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopiarManifiesto(salida.id)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                    title="Copiar lista de pasajeros para WhatsApp"
                  >
                    {manifiestoCopiadoId === salida.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span className="hidden sm:inline">Copiar Manifiesto</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Matriz visual rápida de ocupación */}
              <div className="px-5 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-600 mr-2">
                  Asientos de la Van (1 a 15):
                </span>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {Array.from({ length: salida.totalAsientos }, (_, i) => i + 1).map((asientoNum) => {
                    const ocupante = salida.reservas.find((r) => r.asientos.includes(asientoNum));
                    const isOcupado = !!ocupante;
                    const isHighlighted = asientoDestacado === asientoNum;

                    return (
                      <button
                        key={asientoNum}
                        type="button"
                        onClick={() => {
                          setAsientoDestacado(asientoDestacado === asientoNum ? null : asientoNum);
                        }}
                        title={
                          ocupante
                            ? `Asiento ${asientoNum}: ${ocupante.pasajeroNombre} - ${ocupante.puntoPartidaPersonalizado} ➔ ${ocupante.puntoLlegadaPersonalizado}`
                            : `Asiento ${asientoNum}: Libre`
                        }
                        className={`w-7 h-7 rounded-lg text-[11px] font-extrabold flex items-center justify-center transition-all ${
                          isHighlighted ? 'ring-2 ring-emerald-500 scale-110 shadow-sm' : ''
                        } ${
                          isOcupado
                            ? ocupante?.estadoPago === 'pagado'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-500 text-white'
                            : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                        }`}
                      >
                        {asientoNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lista Detallada con Destinos Flexibles */}
              <div className="p-5">
                {reservasDeEstaSalida.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-semibold">No hay reservas registradas para este turno aún.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <th className="py-2.5 px-3">Asientos</th>
                          <th className="py-2.5 px-3">Pasajero & Contacto</th>
                          <th className="py-2.5 px-3">Puntos Flexibles (Ibarra ➔ Quito)</th>
                          <th className="py-2.5 px-3">Método & Monto</th>
                          <th className="py-2.5 px-3">Estado</th>
                          <th className="py-2.5 px-3 text-right">Acción Cobro</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {reservasDeEstaSalida.map((reserva) => {
                          const estaPagado = reserva.estadoPago === 'pagado';
                          const contieneAsientoDestacado =
                            asientoDestacado !== null && reserva.asientos.includes(asientoDestacado);

                          return (
                            <tr
                              key={reserva.id}
                              className={`transition-colors ${
                                contieneAsientoDestacado ? 'bg-emerald-50/80 font-medium' : 'hover:bg-slate-50/60'
                              }`}
                            >
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1 flex-wrap">
                                  {reserva.asientos.map((a) => (
                                    <span
                                      key={a}
                                      className="px-2 py-0.5 rounded-md font-black text-xs bg-emerald-600 text-white"
                                    >
                                      #{a}
                                    </span>
                                  ))}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                                  {reserva.id}
                                </span>
                              </td>

                              <td className="py-3 px-3">
                                <div className="font-extrabold text-slate-900 text-sm">
                                  {reserva.pasajeroNombre}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-slate-600">{reserva.pasajeroTelefono}</span>
                                  <a
                                    href={`https://wa.me/${reserva.pasajeroTelefono.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="WhatsApp"
                                    className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                  </a>
                                </div>
                                {reserva.notas && (
                                  <span className="text-[11px] text-slate-500 italic block mt-0.5">
                                    Nota: {reserva.notas}
                                  </span>
                                )}
                              </td>

                              {/* Puntos Flexibles de Recogida y Llegada (Requisito clave: no son destinos fijos) */}
                              <td className="py-3 px-3 max-w-xs">
                                <div className="space-y-1">
                                  <div className="flex items-start gap-1 text-[11px]">
                                    <span className="font-bold text-emerald-700 shrink-0">Subir:</span>
                                    <span className="text-slate-800 line-clamp-1">{reserva.puntoPartidaPersonalizado || 'Ibarra'}</span>
                                  </div>
                                  <div className="flex items-start gap-1 text-[11px]">
                                    <span className="font-bold text-emerald-800 shrink-0">Bajar:</span>
                                    <span className="text-slate-800 line-clamp-1">{reserva.puntoLlegadaPersonalizado || 'Quito'}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <div className="font-black text-slate-900">
                                  ${reserva.total} USD
                                </div>
                                <span className="text-[11px] text-slate-500 capitalize flex items-center gap-1">
                                  {reserva.metodoPago === 'payphone' && <span className="text-orange-600 font-bold">Payphone</span>}
                                  {reserva.metodoPago === 'paypal' && <span className="text-sky-600 font-bold">PayPal</span>}
                                  {reserva.metodoPago === 'tarjeta' && <CreditCard className="w-3 h-3 text-emerald-600" />}
                                  {reserva.metodoPago === 'efectivo' && <Banknote className="w-3 h-3 text-emerald-600" />}
                                  {reserva.metodoPago}
                                </span>
                              </td>

                              <td className="py-3 px-3">
                                {estaPagado ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                                    Pagada
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    Pendiente
                                  </span>
                                )}
                              </td>

                              {/* Botón para marcar como pagada */}
                              <td className="py-3 px-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => marcarComoPagada(reserva.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                                      estaPagado
                                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 shadow-xs'
                                    }`}
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>{estaPagado ? 'Desmarcar' : 'Marcar Pagada'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`¿Liberar asientos de ${reserva.pasajeroNombre}?`)) {
                                        cancelarReserva(reserva.id);
                                      }
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ModalNuevaSalida
        isOpen={mostrarModalNueva}
        onClose={() => setMostrarModalNueva(false)}
      />

      <ModalEscanerQR
        isOpen={mostrarModalEscaner}
        onClose={() => setMostrarModalEscaner(false)}
      />
    </div>
  );
};
