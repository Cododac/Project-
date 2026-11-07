import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { LAYOUT_VAN_15 } from '../data/mockData';
import { 
  DoorClosed, 
  AlertTriangle, 
  Check, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Car,
  Sparkles,
  Smile
} from 'lucide-react';

export const PantallaAsientos: React.FC = () => {
  const { 
    selectedSalida, 
    selectedAsientos, 
    toggleAsiento, 
    limpiarSeleccionAsientos,
    puntoPartida,
    puntoLlegada,
    avanzarPaso,
    retrocederPaso,
    usuarioActual
  } = useTransport();

  const [alerta, setAlerta] = useState<string | null>(null);

  if (!selectedSalida) return null;

  const handleSeatClick = (numero: number) => {
    setAlerta(null);
    const res = toggleAsiento(numero);
    if (!res.success && res.message) {
      setAlerta(res.message);
      setTimeout(() => setAlerta(null), 3000);
    }
  };

  const subtotal = selectedAsientos.length * selectedSalida.precio;
  const descuentoPorcentaje = usuarioActual?.descuentoNivel || 0;
  const totalCalculado = Math.round(subtotal * (1 - descuentoPorcentaje / 100));

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white rounded-3xl border border-slate-200/90 p-3 sm:p-5 shadow-xs min-h-0 select-none">
      {/* Cabecera con Letrero Ecuatoriano: Siga nomás que sí hay asientos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5 shrink-0">
        <div>
          {/* LETRERO JOCOSO ECUATORIANO DESALINEADO Y ULTRA VISIBLE (Requerido) */}
          <div className="transform rotate-1 hover:rotate-0 transition-transform duration-300 bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-xl border-3 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] inline-flex items-center gap-2 mb-1">
            <Smile className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span className="font-black text-xs sm:text-sm uppercase tracking-tight">"Siga nomás que sí hay asientos, mijín"</span>
          </div>

          <p className="text-xs font-bold text-slate-800">
            Turno {selectedSalida.horaSalida} hrs • Ibarra ➔ Quito ({selectedSalida.conductor.vehiculo.split('(')[0]})
          </p>
        </div>

        {selectedAsientos.length > 0 && (
          <button
            type="button"
            onClick={limpiarSeleccionAsientos}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200 self-start sm:self-center flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Limpiar
          </button>
        )}
      </div>

      {alerta && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-2 text-xs text-amber-900 flex items-center gap-2 shrink-0 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{alerta}</span>
        </div>
      )}

      {/* Cuerpo: Van Layout y Tarjeta de Resumen */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row items-center justify-center gap-4 py-1">
        <div className="flex flex-col items-center justify-center space-y-2 h-full">
          {/* Leyenda de Asientos (Verde = Disponible, Gris = Ocupado, Azul = Seleccionado) */}
          <div className="flex items-center gap-4 text-xs bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shrink-0">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-emerald-500 border border-emerald-600 text-[9px] text-white font-bold flex items-center justify-center">1</span>
              <span className="text-slate-700 font-medium">Libre</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-[#2563EB] border border-blue-700 text-[9px] text-white font-bold flex items-center justify-center">✓</span>
              <span className="font-bold text-blue-700">Elegido</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-slate-300 border border-slate-300 text-[9px] text-slate-500 font-bold flex items-center justify-center">✕</span>
              <span className="text-slate-500 font-medium">Ocupado</span>
            </span>
          </div>

          {/* Chasis de la Sprinter / Chiva moderna */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 shadow-inner max-w-[280px] w-full">
            <div className="h-4 w-3/4 mx-auto bg-emerald-100 border border-emerald-300 rounded-t-xl mb-2 flex items-center justify-center">
              <span className="text-[8px] uppercase font-black text-emerald-800">Frente / Chofer</span>
            </div>

            <div className="space-y-1.5">
              {Array.from({ length: LAYOUT_VAN_15.filas }).map((_, filaIndex) => {
                const itemsFila = LAYOUT_VAN_15.asientos.filter((a) => a.fila === filaIndex);

                return (
                  <div key={filaIndex} className="grid grid-cols-4 gap-1.5 items-center">
                    {itemsFila.map((item, colIndex) => {
                      if (item.tipo === 'conductor') {
                        return (
                          <div
                            key={`cond-${colIndex}`}
                            className="w-10 h-10 rounded-lg bg-slate-200 border border-slate-300 flex flex-col items-center justify-center text-[8px] font-black text-slate-600 select-none"
                            title="Asiento Conductor"
                          >
                            <Car className="w-3.5 h-3.5 text-slate-500" />
                            <span>Chofer</span>
                          </div>
                        );
                      }

                      if (item.tipo === 'puerta') {
                        return (
                          <div
                            key={`puerta-${colIndex}`}
                            className="w-10 h-10 rounded-lg border border-dashed border-slate-300 bg-white/40 flex flex-col items-center justify-center text-[7px] text-slate-400 select-none"
                          >
                            <DoorClosed className="w-3 h-3 text-slate-400" />
                            <span>Puerta</span>
                          </div>
                        );
                      }

                      if (item.tipo === 'pasillo') {
                        return (
                          <div key={`pasillo-${filaIndex}-${colIndex}`} className="w-10 h-10 flex items-center justify-center">
                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                          </div>
                        );
                      }

                      const numero = item.numero;
                      const estaOcupado = selectedSalida.asientosOcupados.includes(numero);
                      const estaSeleccionado = selectedAsientos.includes(numero);

                      let seatClass = '';
                      if (estaOcupado) {
                        seatClass = 'bg-slate-300 text-slate-500 border-slate-300 cursor-not-allowed opacity-85';
                      } else if (estaSeleccionado) {
                        seatClass = 'bg-[#2563EB] text-white border-blue-700 shadow-md ring-2 ring-blue-300 scale-105';
                      } else {
                        seatClass = 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-2xs hover:scale-105 cursor-pointer';
                      }

                      return (
                        <button
                          key={`asiento-${numero}`}
                          type="button"
                          disabled={estaOcupado}
                          onClick={() => handleSeatClick(numero)}
                          className={`w-10 h-10 rounded-lg border flex flex-col items-center justify-center font-black transition-all ${seatClass}`}
                        >
                          <span className="text-xs leading-none">{numero}</span>
                          {estaSeleccionado ? (
                            <Check className="w-2.5 h-2.5 mt-0.5 stroke-[3]" />
                          ) : estaOcupado ? (
                            <span className="text-[7px] leading-none mt-0.5">✕</span>
                          ) : (
                            <span className="text-[7px] opacity-80 font-normal leading-none mt-0.5">Libre</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resumen lateral */}
        <div className="w-full md:w-64 bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 shrink-0">
          <div>
            <span className="text-xs font-black text-slate-700 block uppercase tracking-wider">
              Asientos ({selectedAsientos.length}/4 máx):
            </span>
            {selectedAsientos.length === 0 ? (
              <p className="text-xs text-slate-400 italic mt-1">
                Toca los asientos verdes para apartar tu lugar.
              </p>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                {selectedAsientos.map((n) => (
                  <span
                    key={n}
                    className="px-2.5 py-0.5 bg-emerald-600 text-white font-black rounded-md text-xs shadow-xs"
                  >
                    Asiento #{n}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-500 block">Total a pagar:</span>
            <span className="text-2xl font-black text-emerald-700 block">
              ${totalCalculado} USD
            </span>
            {descuentoPorcentaje > 0 && (
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-emerald-300">
                Nivel {usuarioActual?.nivel}: -{descuentoPorcentaje}%
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
            <p><strong>Chofer:</strong> {selectedSalida.conductor.nombre}</p>
            <p><strong>Placa:</strong> {selectedSalida.conductor.placa}</p>
          </div>
        </div>
      </div>

      {/* Navegación sin la palabra slide */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={retrocederPaso}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Atrás</span>
        </button>

        <button
          type="button"
          disabled={selectedAsientos.length === 0}
          onClick={avanzarPaso}
          className={`px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
            selectedAsientos.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/25 active:scale-[0.98]'
          }`}
        >
          <span>Ir a Pago</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
