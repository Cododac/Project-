import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { Reserva, ValoracionViaje } from '../types';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  X, 
  Car, 
  Send, 
  Award,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { reproducirClickSuave } from '../utils/soundEffects';

interface Props {
  reserva: Reserva;
  conductorNombre: string;
  conductorVehiculo?: string;
  conductorPlaca?: string;
  isOpen: boolean;
  onClose: () => void;
  onValoracionGuardada?: (valoracion: ValoracionViaje) => void;
}

const ETIQUETAS_RAPIDAS = [
  '🛡️ Manejo seguro',
  '⏱️ Muy puntual',
  '✨ Van limpia y cómoda',
  '🎵 Buen ambiente y música',
  '🤝 Excelente atención',
  '🥪 Refrigerio 10/10'
];

export const ModalValoracionViaje: React.FC<Props> = ({
  reserva,
  conductorNombre,
  conductorVehiculo,
  conductorPlaca,
  isOpen,
  onClose,
  onValoracionGuardada
}) => {
  const { guardarValoracion, usuarioActual, enviarNotificacion } = useTransport();

  const [estrellas, setEstrellas] = useState(5);
  const [hoverEstrellas, setHoverEstrellas] = useState<number | null>(null);
  const [comentario, setComentario] = useState('');
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<string[]>(['🛡️ Manejo seguro', '⏱️ Muy puntual']);
  const [enviando, setEnviando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  if (!isOpen) return null;

  const toggleEtiqueta = (tag: string) => {
    reproducirClickSuave();
    if (etiquetasSeleccionadas.includes(tag)) {
      setEtiquetasSeleccionadas(etiquetasSeleccionadas.filter((t) => t !== tag));
    } else {
      setEtiquetasSeleccionadas([...etiquetasSeleccionadas, tag]);
    }
  };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    reproducirClickSuave();

    const nuevaValoracion: ValoracionViaje = {
      id: `VAL-${reserva.id}-${Date.now().toString().slice(-4)}`,
      reservaId: reserva.id,
      salidaId: reserva.salidaId,
      conductorNombre: conductorNombre || 'Marco Baez',
      pasajeroId: usuarioActual?.id || 'usr-pasajero-01',
      pasajeroNombre: reserva.pasajeroNombre,
      estrellas,
      comentario: comentario.trim() || '¡Excelente viaje en la Chiva!',
      etiquetas: etiquetasSeleccionadas,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    try {
      await guardarValoracion(nuevaValoracion);
      setGuardadoExitoso(true);
      enviarNotificacion(
        '⭐ ¡Gracias por tu valoración!',
        `Calificaste a ${conductorNombre} con ${estrellas} estrellas. Se guardó en Firestore vinculado a tu viaje.`,
        'info'
      );
      if (onValoracionGuardada) {
        onValoracionGuardada(nuevaValoracion);
      }
      setTimeout(() => {
        setGuardadoExitoso(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-emerald-500 overflow-hidden text-slate-800">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/30">
              <Star className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                Trayecto Finalizado con Éxito
              </span>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                Calificar Viaje & Conductor
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ficha del Conductor */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-700 font-black flex items-center justify-center text-xs">
              👨‍✈️
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">{conductorNombre}</h4>
              <p className="text-[10px] text-slate-500">
                {conductorVehiculo || 'Mercedes Sprinter Ejecutiva'} • <strong>{conductorPlaca || 'IBC-4821'}</strong>
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
            {reserva.id}
          </span>
        </div>

        {guardadoExitoso ? (
          <div className="py-8 text-center space-y-2 animate-scaleUp">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h4 className="text-base font-black text-slate-900">¡Calificación Guardada!</h4>
            <p className="text-xs text-slate-500">
              Tu opinión ayuda a mantener la mejor calidad en las rutas de Ibarra a Quito.
            </p>
          </div>
        ) : (
          <form onSubmit={handleEnviar} className="space-y-3.5">
            {/* Selector de Estrellas Interactivo */}
            <div className="text-center py-2 bg-gradient-to-b from-amber-50/50 to-white rounded-2xl border border-amber-200/60">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                ¿Cómo estuvo tu experiencia?
              </span>

              <div className="flex items-center justify-center gap-2 my-1">
                {[1, 2, 3, 4, 5].map((estrellaNum) => {
                  const activa = (hoverEstrellas !== null ? hoverEstrellas : estrellas) >= estrellaNum;
                  return (
                    <button
                      key={estrellaNum}
                      type="button"
                      onMouseEnter={() => setHoverEstrellas(estrellaNum)}
                      onMouseLeave={() => setHoverEstrellas(null)}
                      onClick={() => {
                        reproducirClickSuave();
                        setEstrellas(estrellaNum);
                      }}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          activa
                            ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-xs font-black text-amber-700">
                {estrellas === 5 && '🌟 ¡Excelente viaje, recomendado!'}
                {estrellas === 4 && '👍 Muy buen servicio'}
                {estrellas === 3 && '🙂 Buen viaje, normal'}
                {estrellas === 2 && '😐 Podría mejorar'}
                {estrellas === 1 && '⚠️ Mala experiencia'}
              </span>
            </div>

            {/* Etiquetas Rápidas */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Aspectos destacados del viaje:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ETIQUETAS_RAPIDAS.map((tag) => {
                  const sel = etiquetasSeleccionadas.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleEtiqueta(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all cursor-pointer font-bold ${
                        sel
                          ? 'bg-emerald-500 text-slate-950 border-emerald-600 shadow-2xs font-black scale-102'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comentario Breve */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                Comentario breve para el conductor:
              </label>
              <textarea
                rows={2}
                placeholder="Ej. Don Marco muy atento, llegamos a tiempo a Quito y la van súper limpia."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Acciones */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Omitir
              </button>

              <button
                type="submit"
                disabled={enviando}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{enviando ? 'Guardando...' : 'Enviar Valoración'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
