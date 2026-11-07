import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { MapaBoletoViaje } from './MapaBoletoViaje';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  MapPin, 
  Calendar, 
  Clock, 
  Printer, 
  ShieldCheck, 
  QrCode, 
  Phone, 
  Plus, 
  CreditCard, 
  Banknote, 
  Car,
  Heart
} from 'lucide-react';

export const PantallaConfirmacion: React.FC = () => {
  const { 
    reservaConfirmada, 
    salidas, 
    iniciarNuevaReserva, 
    setActiveTab 
  } = useTransport();

  const [copiado, setCopiado] = useState(false);

  if (!reservaConfirmada) return null;

  const salida = salidas.find((s) => s.id === reservaConfirmada.salidaId);

  const handleCopiarCodigo = () => {
    navigator.clipboard.writeText(reservaConfirmada.id);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-3 min-h-0 select-none">
      {/* Columna Izquierda: Mapa de la Ruta Confirmada (52%) */}
      <div className="w-full md:w-[52%] h-[40vh] md:h-full flex flex-col min-h-0 shrink-0 md:shrink">
        <MapaBoletoViaje reserva={reservaConfirmada} salida={salida} />
      </div>

      {/* Columna Derecha: Pase de Abordaje / Boleto Electrónico (48%) */}
      <div className="w-full md:w-[48%] h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs min-h-0 overflow-y-auto">
        <div className="space-y-3">
          {/* Cabecera Éxito y Código de Reserva */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">
                  ¡Reserva Exitosa!
                </span>
                <span className="text-xs font-black">
                  Código: <strong className="font-mono text-sm">{reservaConfirmada.id}</strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopiarCodigo}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold text-white flex items-center gap-1 transition-colors"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiado ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>

          {/* Trayecto y Horario */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-200 pb-1">
              <span>Expreso Ibarra ➔ Quito</span>
              <span className="text-emerald-700 font-extrabold">{salida?.horaSalida} hrs</span>
            </div>
            <p className="truncate text-slate-600">
              <strong className="text-emerald-700">Subir:</strong> {reservaConfirmada.puntoPartidaPersonalizado}
            </p>
            <p className="truncate text-slate-600">
              <strong className="text-slate-900">Bajar:</strong> {reservaConfirmada.puntoLlegadaPersonalizado}
            </p>
          </div>

          {/* Pasajero, Asientos y Pago en cuadrícula */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Pasajero</span>
              <p className="font-extrabold text-slate-900 truncate">{reservaConfirmada.pasajeroNombre}</p>
              <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" /> {reservaConfirmada.pasajeroTelefono}
              </p>
            </div>

            <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <span className="text-[9px] uppercase font-bold text-emerald-800 block">Asientos</span>
              <div className="flex items-center gap-1 flex-wrap mt-0.5">
                {reservaConfirmada.asientos.map((n) => (
                  <span key={n} className="px-1.5 py-0.2 bg-emerald-600 text-white font-black rounded text-[11px]">
                    #{n}
                  </span>
                ))}
              </div>
              <p className="text-[11px] font-bold text-emerald-900 mt-1">
                ${reservaConfirmada.total} USD ({reservaConfirmada.metodoPago})
              </p>
              {reservaConfirmada.refrigerio && (
                <div className="mt-1 pt-1 border-t border-emerald-200 text-[10px] text-emerald-800 font-bold capitalize">
                  🥪 {reservaConfirmada.refrigerio.comida} + {reservaConfirmada.refrigerio.bebida}
                </div>
              )}
            </div>
          </div>

          {/* Conductor y QR para Abordar */}
          {salida && (
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Conductor</span>
                <p className="font-bold text-slate-800">{salida.conductor.nombre}</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Car className="w-3 h-3 text-slate-400" />
                  {salida.conductor.vehiculo.split('(')[0]} • <strong>{salida.conductor.placa}</strong>
                </p>
              </div>

              <div className="p-1 bg-white rounded-lg border border-slate-200 shrink-0 text-center">
                <QrCode className="w-9 h-9 text-slate-800 mx-auto" />
                <span className="text-[8px] text-slate-400 block">Pase QR</span>
              </div>
            </div>
          )}
        </div>

        {/* Acciones Finales */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5 mt-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleImprimir}
              className="py-2 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Boleto</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('historial')}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Ver Mis Viajes</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('guambra')}
            className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Compartir en "¿Cómo estás mi guambra?" (En Vivo)</span>
          </button>

          <button
            type="button"
            onClick={iniciarNuevaReserva}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-slate-950 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/25 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Hacer Otra Reserva</span>
          </button>
        </div>
      </div>
    </div>
  );
};
