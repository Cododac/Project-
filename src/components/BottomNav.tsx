import React from 'react';
import { useTransport } from '../context/TransportContext';
import { 
  Ticket, 
  History, 
  Heart, 
  ShieldCheck, 
  Siren, 
  Award,
  Star
} from 'lucide-react';
import { reproducirClickSuave, reproducirSonidoEmergencia } from '../utils/soundEffects';

export const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    reservas, 
    usuarioActual,
    setMostrarModalEmergenciaGlobal 
  } = useTransport();

  const reservasPendientes = reservas.filter((r) => r.estadoPago === 'pendiente').length;

  const handleTabClick = (tab: 'pasajero' | 'historial' | 'guambra' | 'perfil' | 'admin') => {
    reproducirClickSuave();
    setActiveTab(tab);
  };

  const handleEmergenciaClick = () => {
    reproducirSonidoEmergencia();
    setMostrarModalEmergenciaGlobal(true);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-1.5 sm:px-4 py-1.5 max-w-2xl mx-auto rounded-t-3xl sm:rounded-3xl sm:bottom-2 select-none">
      <div className="flex items-center justify-around gap-1">
        {/* 1. Reservar */}
        <button
          type="button"
          onClick={() => handleTabClick('pasajero')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'pasajero'
              ? 'text-emerald-700 font-black scale-105'
              : 'text-slate-500 hover:text-slate-900 font-bold'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'pasajero' ? 'bg-emerald-500 text-slate-950 shadow-xs' : ''}`}>
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight">Reservar</span>
        </button>

        {/* 2. Mis Viajes (Historial) */}
        <button
          type="button"
          onClick={() => handleTabClick('historial')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'historial'
              ? 'text-emerald-700 font-black scale-105'
              : 'text-slate-500 hover:text-slate-900 font-bold'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'historial' ? 'bg-emerald-500 text-slate-950 shadow-xs' : ''}`}>
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight">Historial</span>
        </button>

        {/* 3. BOTÓN DE EMERGENCIA SOS DESTACADO */}
        <button
          type="button"
          onClick={handleEmergenciaClick}
          className="flex flex-col items-center justify-center py-0.5 px-2 -mt-4 group cursor-pointer shrink-0"
          title="Botón de Emergencia / SOS en ruta"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-rose-600 group-hover:bg-rose-700 group-active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 border-4 border-white transition-transform animate-pulse">
            <Siren className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-black text-rose-600 uppercase tracking-wider mt-0.5">
            SOS
          </span>
        </button>

        {/* 4. ¿Cómo estás mi guambra? */}
        <button
          type="button"
          onClick={() => handleTabClick('guambra')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'guambra'
              ? 'text-emerald-700 font-black scale-105'
              : 'text-slate-500 hover:text-slate-900 font-bold'
          }`}
          title="Seguimiento en Vivo: ¿Cómo estás mi guambra?"
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'guambra' ? 'bg-emerald-500 text-slate-950 shadow-xs' : ''}`}>
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'guambra' ? 'fill-slate-950' : 'text-rose-500 fill-rose-500/20'}`} />
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight">Mi Guambra</span>
        </button>

        {/* 5. Mi Nivel / Perfil de Lealtad (Requerido: velocímetro y estrellas) */}
        <button
          type="button"
          onClick={() => handleTabClick('perfil')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'perfil'
              ? 'text-emerald-700 font-black scale-105'
              : 'text-slate-500 hover:text-slate-900 font-bold'
          }`}
          title="Mi Nivel de Lealtad y Velocímetro de Estrellas"
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'perfil' ? 'bg-amber-400 text-slate-950 shadow-xs' : ''}`}>
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight">Mi Nivel</span>
        </button>

        {/* 6. Chófer (Solo disponible si el usuario tiene rol de 'chofer') */}
        {usuarioActual?.rol === 'chofer' && (
          <button
            type="button"
            onClick={() => handleTabClick('admin')}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'text-slate-950 font-black scale-105'
                : 'text-slate-500 hover:text-slate-900 font-bold'
            }`}
            title="Panel Conductor"
          >
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'admin' ? 'bg-slate-900 text-white shadow-xs' : ''}`}>
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight">Chófer</span>
            {reservasPendientes > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 text-[8px] font-black flex items-center justify-center border border-white">
                {reservasPendientes}
              </span>
            )}
          </button>
        )}
      </div>
    </nav>
  );
};
