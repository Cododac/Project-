import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { TipoEmergencia } from '../types';
import { 
  AlertTriangle, 
  Siren, 
  Wrench, 
  Shield, 
  Flame, 
  Car, 
  X, 
  Send,
  PhoneCall
} from 'lucide-react';
import { reproducirSonidoEmergencia, reproducirClickSuave } from '../utils/soundEffects';

export const ModalEmergenciaGlobal: React.FC = () => {
  const { 
    mostrarModalEmergenciaGlobal, 
    setMostrarModalEmergenciaGlobal,
    reportarEmergencia,
    codigoSeguimientoSeleccionado,
    reservas,
    enviarNotificacion,
    setActiveTab
  } = useTransport();

  const [tipo, setTipo] = useState<TipoEmergencia>('se_danio');
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!mostrarModalEmergenciaGlobal) return null;

  const codigoActual = codigoSeguimientoSeleccionado || reservas[0]?.id || 'CHIVA-8821';

  const handleCerrar = () => {
    reproducirClickSuave();
    setMostrarModalEmergenciaGlobal(false);
  };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    reproducirSonidoEmergencia();

    const etiquetas: Record<TipoEmergencia, string> = {
      se_danio: 'Se dañó la van (Falla mecánica o neumático)',
      seguridad: 'Alerta de Seguridad en la Panamericana',
      accidente: 'Accidente o choque en la vía',
      bloqueo_via: 'Paso cerrado / Bloqueo en ruta',
      ninguna: 'Sin novedad'
    };

    const textoNovedad = descripcion.trim() || etiquetas[tipo];

    try {
      await reportarEmergencia(codigoActual, tipo, textoNovedad);
    } catch (err) {
      console.warn('Error reportando emergencia:', err);
    }

    enviarNotificacion(
      `🚨 ALERTA SOS: ${etiquetas[tipo]}`,
      `Reporte en viaje ${codigoActual}: ${textoNovedad}. La familia y el conductor han sido notificados.`,
      'chofer'
    );

    setEnviando(false);
    setMostrarModalEmergenciaGlobal(false);
    setDescripcion('');
    // Llevar al usuario a la vista de seguimiento en vivo
    setActiveTab('guambra');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-rose-500 overflow-hidden relative">
        {/* Barra superior de alerta */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30 animate-pulse">
              <Siren className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 block">
                Alerta Inmediata en Ruta E35
              </span>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                Botón de Emergencia SOS
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCerrar}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-3">
          Selecciona el tipo de percance. Esto enviará una notificación prioritaria a tus seres queridos en la sección <strong>"¿Cómo estás mi guambra?"</strong> y al chofer.
        </p>

        <form onSubmit={handleEnviar} className="space-y-3.5">
          {/* Opciones requeridas: Se dañó, seguridad, accidente, paso cerrado */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                reproducirClickSuave();
                setTipo('se_danio');
              }}
              className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                tipo === 'se_danio'
                  ? 'bg-rose-50 border-rose-500 text-rose-950 font-black ring-2 ring-rose-400 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Se dañó la van</span>
            </button>

            <button
              type="button"
              onClick={() => {
                reproducirClickSuave();
                setTipo('seguridad');
              }}
              className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                tipo === 'seguridad'
                  ? 'bg-rose-50 border-rose-500 text-rose-950 font-black ring-2 ring-rose-400 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Seguridad</span>
            </button>

            <button
              type="button"
              onClick={() => {
                reproducirClickSuave();
                setTipo('accidente');
              }}
              className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                tipo === 'accidente'
                  ? 'bg-rose-50 border-rose-500 text-rose-950 font-black ring-2 ring-rose-400 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Accidente</span>
            </button>

            <button
              type="button"
              onClick={() => {
                reproducirClickSuave();
                setTipo('bloqueo_via');
              }}
              className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                tipo === 'bloqueo_via'
                  ? 'bg-rose-50 border-rose-500 text-rose-950 font-black ring-2 ring-rose-400 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4 text-slate-600 shrink-0" />
              <span>Paso Cerrado</span>
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
              Detalle o ubicación aproximada:
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Estamos a la altura de Otavalo esperando grúa / auxilio mecánico, todos los pasajeros estamos bien."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-slate-800"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCerrar}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={enviando}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{enviando ? 'Emitiendo...' : 'Transmitir Alerta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
