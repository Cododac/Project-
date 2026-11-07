import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { MapaSeleccionUbicacion } from './MapaSeleccionUbicacion';
import { PRESETS_IBARRA, PRESETS_QUITO, UbicacionPreset } from '../data/mockData';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Navigation, 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  Megaphone,
  Flame
} from 'lucide-react';

export const PantallaRuta: React.FC = () => {
  const { 
    salidasConEstado, 
    selectedSalidaId, 
    setSelectedSalidaId, 
    puntoPartida, 
    setPuntoPartida, 
    setCoordsPartida,
    direccionPartidaManual, 
    setDireccionPartidaManual, 
    puntoLlegada, 
    setPuntoLlegada, 
    setCoordsLlegada,
    direccionLlegadaManual, 
    setDireccionLlegadaManual, 
    fechaViaje, 
    setFechaViaje,
    avanzarPaso 
  } = useTransport();

  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  const salidasDisponibles = salidasConEstado.filter((s) => s.fecha === fechaViaje);

  const handlePresetSelect = (preset: UbicacionPreset) => {
    if (preset.ciudad === 'Ibarra') {
      setPuntoPartida(preset.nombre);
      setCoordsPartida(preset.coords);
    } else {
      setPuntoLlegada(preset.nombre);
      setCoordsLlegada(preset.coords);
    }
  };

  const handleContinuar = () => {
    setErrorValidacion(null);

    if (!selectedSalidaId) {
      setErrorValidacion('Por favor selecciona un turno de salida.');
      return;
    }

    const salidaSel = salidasConEstado.find((s) => s.id === selectedSalidaId);
    if (salidaSel && salidaSel.asientosLibresCount === 0) {
      setErrorValidacion('El turno seleccionado se encuentra agotado.');
      return;
    }

    avanzarPaso();
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-3 min-h-0 select-none">
      {/* Columna Izquierda: Mapa Interactivo Principal */}
      <div className="w-full md:w-[54%] h-[42vh] md:h-full flex flex-col min-h-0 shrink-0 md:shrink">
        <MapaSeleccionUbicacion />
      </div>

      {/* Columna Derecha: Controles y Letrero Típico Ecuatoriano */}
      <div className="w-full md:w-[46%] h-full flex flex-col justify-between bg-white rounded-3xl border border-slate-200/90 p-3 sm:p-4 shadow-xs min-h-0 overflow-y-auto">
        <div className="space-y-2.5">
          {/* LETRERO JOCOSO ECUATORIANO DESALINEADO Y ULTRA VISIBLE (Requerido) */}
          <div className="transform -rotate-2 hover:rotate-0 transition-transform duration-300 bg-amber-300 text-slate-950 px-4 py-2.5 rounded-2xl border-3 border-slate-950 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-slate-950 animate-bounce" />
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded block w-fit">
                  Grito de Enganche
                </span>
                <span className="text-sm sm:text-base font-black uppercase tracking-tight">
                  ¡A Quito, a Quito, mijín!
                </span>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs font-black bg-rose-600 text-white px-2.5 py-1 rounded-xl shadow-xs uppercase tracking-wider animate-pulse">
              ¡Arranca la van!
            </span>
          </div>

          {errorValidacion && (
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorValidacion}</span>
            </div>
          )}

          {/* Chips de Paradas Populares Ibarra */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                📍 Recogida en Ibarra:
              </span>
              <span className="text-[10px] text-slate-400">Clic para fijar en mapa</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {PRESETS_IBARRA.slice(0, 4).map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all truncate max-w-[190px] ${
                    puntoPartida.includes(p.nombre.split('(')[0])
                      ? 'bg-emerald-500 text-slate-950 font-black border-emerald-600 shadow-2xs'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {p.nombre.split('(')[0]}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="O escribe dirección exacta de recogida..."
              value={direccionPartidaManual}
              onChange={(e) => setDireccionPartidaManual(e.target.value)}
              className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Chips de Destinos Populares Quito */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                🏁 Destino en Quito:
              </span>
              <span className="text-[10px] text-slate-400">Destinos no fijos</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {PRESETS_QUITO.slice(0, 4).map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all truncate max-w-[190px] ${
                    puntoLlegada.includes(p.nombre.split('/')[0])
                      ? 'bg-emerald-500 text-slate-950 font-black border-emerald-600 shadow-2xs'
                      : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {p.nombre.split('/')[0]}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="O escribe tu destino o sector en Quito..."
              value={direccionLlegadaManual}
              onChange={(e) => setDireccionLlegadaManual(e.target.value)}
              className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Turnos / Horarios */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Horarios de Salida:
              </span>
              <div className="flex items-center gap-1 text-[11px]">
                <Calendar className="w-3 h-3 text-slate-400" />
                <input
                  type="date"
                  value={fechaViaje}
                  onChange={(e) => setFechaViaje(e.target.value)}
                  className="px-1.5 py-0.5 text-[11px] bg-slate-50 border border-slate-200 rounded font-bold text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {salidasDisponibles.map((salida) => {
                const isSelected = selectedSalidaId === salida.id;
                const agotado = salida.asientosLibresCount === 0;

                return (
                  <button
                    key={salida.id}
                    type="button"
                    disabled={agotado}
                    onClick={() => setSelectedSalidaId(salida.id)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400/40 shadow-xs'
                        : agotado
                        ? 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {salida.horaSalida} hrs
                      </span>
                      <span className="text-[11px] font-black text-emerald-700">
                        ${salida.precio}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                      {salida.asientosLibresCount} asientos
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Botón de Avance (Sin la palabra slide) */}
        <div className="pt-2 border-t border-slate-100 mt-2">
          <button
            type="button"
            onClick={handleContinuar}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-slate-950 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25 transition-all"
          >
            <span>Elegir Asientos</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
