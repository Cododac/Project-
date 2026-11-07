import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Sparkles, 
  Car, 
  Ticket, 
  Info, 
  Volume2, 
  ExternalLink 
} from 'lucide-react';

export const NotificacionesPush: React.FC = () => {
  const { 
    notificacionActiva, 
    cerrarNotificacionActiva, 
    notificaciones, 
    marcarTodasNotificacionesLeidas,
    setActiveTab 
  } = useTransport();

  const [mostrarBandeja, setMostrarBandeja] = useState(false);

  const getIcono = (tipo?: string) => {
    switch (tipo) {
      case 'chofer':
        return <Car className="w-4 h-4 text-emerald-400" />;
      case 'reserva':
        return <Ticket className="w-4 h-4 text-amber-400" />;
      case 'promo':
        return <Sparkles className="w-4 h-4 text-emerald-300" />;
      default:
        return <Info className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <>
      {/* Toast Flotante Push (Simulación realista en tiempo real) */}
      {notificacionActiva && (
        <aside 
          aria-label="Notificación Push"
          className="fixed top-3 right-3 sm:right-6 z-50 max-w-sm w-[92vw] sm:w-96 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-emerald-500/30 animate-bounceOnce select-none"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              {getIcono(notificacionActiva.tipo)}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Notificación Push
                </span>
                <span className="text-[9px] text-slate-400">{notificacionActiva.fecha}</span>
              </div>
              <h4 className="text-xs font-black text-white mt-0.5 truncate">
                {notificacionActiva.titulo}
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5 line-clamp-2">
                {notificacionActiva.mensaje}
              </p>
            </div>

            <button
              type="button"
              onClick={cerrarNotificacionActiva}
              title="Cerrar notificación"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Modal / Bandeja de Notificaciones si se abre */}
      {mostrarBandeja && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Bell className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Notificaciones Chiva</h3>
                  <span className="text-[10px] text-slate-400">Actualizaciones de tu viaje en tiempo real</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={marcarTodasNotificacionesLeidas}
                  title="Marcar todas como leídas"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarBandeja(false)}
                  title="Cerrar"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {notificaciones.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                  No tienes notificaciones pendientes.
                </div>
              ) : (
                notificaciones.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      n.leida
                        ? 'bg-slate-50 border-slate-200/70 text-slate-600'
                        : 'bg-emerald-50/50 border-emerald-200 text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-white shadow-2xs border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                        {getIcono(n.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold truncate">{n.titulo}</h5>
                          <span className="text-[9px] text-slate-400">{n.fecha}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                          {n.mensaje}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
              <button
                type="button"
                onClick={() => {
                  setMostrarBandeja(false);
                  setActiveTab('historial');
                }}
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>Ver mis viajes</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setMostrarBandeja(false)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
