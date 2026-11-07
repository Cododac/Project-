import React, { useEffect } from 'react';
import { useTransport } from '../context/TransportContext';
import { Sparkles, CheckCircle2, Ticket, ArrowRight, Heart, Car } from 'lucide-react';
import { reproducirClickSuave } from '../utils/soundEffects';

export const PantallaCelebracionVerde: React.FC = () => {
  const { 
    mostrarCelebracionVerde, 
    setMostrarCelebracionVerde, 
    reservaConfirmada,
    selectedSalida,
    setActiveTab
  } = useTransport();

  if (!mostrarCelebracionVerde || !reservaConfirmada) return null;

  const handleContinuar = () => {
    reproducirClickSuave();
    setMostrarCelebracionVerde(false);
  };

  const handleIrASeguimiento = () => {
    reproducirClickSuave();
    setMostrarCelebracionVerde(false);
    setActiveTab('guambra');
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 sm:p-10 bg-emerald-500 text-slate-950 select-none animate-fadeIn overflow-hidden">
      {/* Fondo festivo con círculos y destellos */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 opacity-95 pointer-events-none" />
      
      {/* Rayos/destellos de celebración */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Partículas y Confetti flotante */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-bounce"
            style={{
              top: `${(i * 17) % 95}%`,
              left: `${(i * 23) % 95}%`,
              width: `${(i % 3 + 1) * 8}px`,
              height: `${(i % 3 + 1) * 8}px`,
              backgroundColor: i % 2 === 0 ? '#ffffff' : '#fef08a',
              opacity: 0.7,
              animationDuration: `${1.5 + (i % 4) * 0.5}s`,
              animationDelay: `${(i % 5) * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* 1. Header de la Pantalla Verde */}
      <div className="relative z-10 w-full max-w-lg text-center pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/15 backdrop-blur-md border border-slate-950/20 text-slate-950 text-xs sm:text-sm font-black uppercase tracking-widest shadow-xs mb-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
          <span>¡Confirmado, mijín! Viaje asegurado</span>
        </div>
      </div>

      {/* 2. Cuerpo Central: Letrero Jocoso Ecuatoriano Desalineado & Tarjeta del Boleto */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center my-auto space-y-4">
        {/* Letrero Desalineado Estilo Bus Chiva */}
        <div className="transform -rotate-3 hover:rotate-0 transition-transform duration-300 bg-amber-300 text-slate-950 px-6 py-2.5 rounded-2xl border-4 border-slate-950 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-lg sm:text-2xl font-black uppercase tracking-tight block">
            ¡Súbase nomás con fe!
          </span>
          <span className="text-xs font-black text-slate-800 tracking-wide uppercase">
            Expreso Ibarra ➔ Quito sin rodeos
          </span>
        </div>

        {/* Círculo Central con Van Animada */}
        <div className="relative">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-950 text-white flex items-center justify-center border-4 border-white shadow-2xl animate-scaleUp">
            <span className="text-5xl sm:text-6xl animate-pulse">🚐</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 p-2 rounded-full border-2 border-slate-950 shadow-md">
            <CheckCircle2 className="w-6 h-6 stroke-[3]" />
          </div>
        </div>

        {/* Resumen del Boleto */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border-2 border-slate-950 text-left space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <span className="text-[10px] uppercase font-black text-slate-400 block">Código Boleto</span>
              <span className="text-base font-black font-mono text-slate-900">{reservaConfirmada.id}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-black text-slate-400 block">Total Cancelado</span>
              <span className="text-base font-black text-emerald-700">${reservaConfirmada.total} USD</span>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <p className="text-slate-800 font-bold truncate">
              👤 <strong>Pasajero:</strong> {reservaConfirmada.pasajeroNombre}
            </p>
            <p className="text-slate-800 font-bold">
              💺 <strong>Asientos:</strong> [#{reservaConfirmada.asientos.join(', #')}]
            </p>
            <p className="text-slate-700 text-[11px] truncate">
              📍 <strong>Sube en:</strong> {reservaConfirmada.puntoPartidaPersonalizado}
            </p>
            <p className="text-slate-700 text-[11px] truncate">
              🏁 <strong>Baja en:</strong> {reservaConfirmada.puntoLlegadaPersonalizado}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Botones Inferiores de Acción */}
      <div className="relative z-10 w-full max-w-md space-y-2.5 pb-2">
        <button
          type="button"
          onClick={handleContinuar}
          className="w-full py-3.5 px-6 bg-slate-950 hover:bg-slate-900 active:scale-95 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Ticket className="w-5 h-5 text-emerald-400" />
          <span>Ver mi Boleto con Código QR</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>

        <button
          type="button"
          onClick={handleIrASeguimiento}
          className="w-full py-2.5 px-4 bg-white/80 hover:bg-white active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md border border-slate-950/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
          <span>Compartir en "¿Cómo estás mi guambra?"</span>
        </button>
      </div>
    </div>
  );
};
