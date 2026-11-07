import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { NIVELES_CHIVA, calcularProgresoLealtad } from '../utils/nivelesLealtad';
import { NombreNivel } from '../types';
import { 
  Star, 
  Ticket, 
  History, 
  Heart, 
  Award, 
  Percent, 
  ChevronRight, 
  Edit3, 
  LogOut, 
  ShieldCheck, 
  Flame, 
  Sparkles,
  Phone,
  User,
  Compass,
  ArrowRight,
  TrendingUp,
  Check
} from 'lucide-react';
import { reproducirClickSuave } from '../utils/soundEffects';

export const PantallaPerfilUsuario: React.FC = () => {
  const { 
    usuarioActual, 
    actualizarPerfil, 
    logout, 
    setActiveTab, 
    setBookingStep, 
    iniciarNuevaReserva,
    reservas 
  } = useTransport();

  const [editando, setEditando] = useState(false);
  const [nombreEdit, setNombreEdit] = useState(usuarioActual?.nombre || '');
  const [telefonoEdit, setTelefonoEdit] = useState(usuarioActual?.telefono || '+593 99 841 2901');

  // Calcular viajes y estrellas reales
  const viajesUsuario = reservas.filter((r) => 
    usuarioActual ? r.pasajeroNombre.toLowerCase().includes(usuarioActual.nombre.toLowerCase().split(' ')[0]) : false
  ).length;

  const totalViajesConsiderados = Math.max(viajesUsuario, usuarioActual?.viajesCompletados || 42); // Demo default 42 para nivel andariego
  const infoProgreso = calcularProgresoLealtad(totalViajesConsiderados, usuarioActual?.estrellas);

  const nivelActual = infoProgreso.nivelActual;
  const siguienteNivel = infoProgreso.siguienteNivel;

  const handleComprarBoleto = () => {
    reproducirClickSuave();
    iniciarNuevaReserva();
    setActiveTab('pasajero');
  };

  const handleGuardarPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    reproducirClickSuave();
    actualizarPerfil({
      nombre: nombreEdit.trim() || usuarioActual?.nombre,
      telefono: telefonoEdit.trim() || usuarioActual?.telefono
    });
    setEditando(false);
  };

  // Ángulo de la aguja del velocímetro (-90deg a +90deg)
  const anguloAguja = -90 + (infoProgreso.porcentajeProgresoVelocimetro / 100) * 180;

  return (
    <div className="h-full flex flex-col min-h-0 bg-slate-100 select-none overflow-y-auto p-3 sm:p-6 max-w-4xl w-full mx-auto animate-fadeIn text-slate-800">
      {/* 1. Cabecera Principal de Perfil con Avatar del Nivel */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl mb-4 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {/* Avatar Oficial del Nivel */}
            <div className="relative">
              <img
                src={nivelActual.avatarUrl}
                alt={nivelActual.nombre}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-emerald-400 shadow-2xl ring-4 ring-emerald-500/20"
              />
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 p-1.5 rounded-xl border-2 border-slate-950 shadow-md">
                <Award className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1.5 border border-emerald-500/40">
                <Sparkles className="w-3.5 h-3.5" />
                Nivel {nivelActual.numeroNivel} de 4: {nivelActual.nombre.toUpperCase()}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {usuarioActual?.nombre || 'Mateo Cárdenas'}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5 max-w-md">
                {nivelActual.descripcion}
              </p>

              {/* Placa de Estrellas y Descuento */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
                <span className="flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-black">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {infoProgreso.estrellas} Estrellas
                </span>

                <span className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-1 rounded-xl text-xs font-black">
                  <Percent className="w-3.5 h-3.5" />
                  {infoProgreso.descuentoActual}% Descuento Activo
                </span>

                <span className="text-xs text-slate-400 font-bold">
                  ({infoProgreso.viajesTotales} viajes completados)
                </span>
              </div>
            </div>
          </div>

          {/* Botón de Comprar Boleto Directo */}
          <button
            type="button"
            onClick={handleComprarBoleto}
            className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Ticket className="w-4 h-4 stroke-[2.5]" />
            <span>Comprar un Boleto (-{infoProgreso.descuentoActual}%)</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* 2. VELOCÍMETRO / TACÓMETRO DE ESTRELLAS Y NIVELES DE LA CHIVA */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-emerald-700 tracking-wider">
              <TrendingUp className="w-4 h-4" />
              Velocímetro de Lealtad & Niveles
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Cada 2 viajes = 1 Estrella • Cada 20 estrellas = Subes de Nivel (+10% OFF)
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 block">Progreso actual:</span>
            <span className="text-sm font-black text-emerald-700">
              {siguienteNivel ? `${infoProgreso.estrellasParaSiguienteNivel} estrellas para ${siguienteNivel.nombre}` : '¡Nivel Máximo Alcanzado!'}
            </span>
          </div>
        </div>

        {/* Gráfico SVG de Velocímetro Analógico */}
        <div className="flex flex-col items-center justify-center my-2">
          <div className="relative w-64 h-36 sm:w-72 sm:h-40 flex items-end justify-center">
            <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
              {/* Arco base fondo */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* Arco de progreso con gradiente */}
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="33%" stopColor="#14b8a6" />
                  <stop offset="66%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={`${251.2 * (1 - infoProgreso.porcentajeProgresoVelocimetro / 100)}`}
                className="transition-all duration-1000 ease-out"
              />

              {/* Marcas de los 4 niveles */}
              <text x="18" y="118" fill="#64748b" fontSize="8" fontWeight="bold">N1: Casa</text>
              <text x="60" y="32" fill="#64748b" fontSize="8" fontWeight="bold">N2: Andariego</text>
              <text x="120" y="32" fill="#64748b" fontSize="8" fontWeight="bold">N3: Mundo</text>
              <text x="160" y="118" fill="#64748b" fontSize="8" fontWeight="bold">N4: Capo</text>

              {/* Aguja del Velocímetro */}
              <g transform={`rotate(${anguloAguja}, 100, 100)`} className="transition-transform duration-700 ease-out">
                <line x1="100" y1="100" x2="100" y2="35" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                <circle cx="100" cy="100" r="8" fill="#0f172a" />
                <circle cx="100" cy="100" r="4" fill="#fbbf24" />
              </g>
            </svg>
          </div>

          {/* Tacómetro Digital en el Centro */}
          <div className="text-center -mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {infoProgreso.estrellas} ⭐
            </span>
            <span className="text-xs text-slate-500 font-bold block">
              {infoProgreso.porcentajeProgresoVelocimetro}% hacia el siguiente nivel
            </span>
          </div>
        </div>

        {/* 4 Niveles Oficiales de la Chiva en Cuadrícula */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-100">
          {(Object.keys(NIVELES_CHIVA) as NombreNivel[]).map((nombre) => {
            const nivel = NIVELES_CHIVA[nombre];
            const esActual = nivelActual.nombre === nombre;
            const esDesbloqueado = infoProgreso.estrellas >= nivel.estrellasMin;

            return (
              <div
                key={nombre}
                className={`p-3.5 rounded-2xl border transition-all ${
                  esActual
                    ? 'bg-emerald-50/80 border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : esDesbloqueado
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-50/50 border-dashed border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <img
                    src={nivel.avatarUrl}
                    alt={nivel.nombre}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider block truncate text-slate-900">
                      Nivel {nivel.numeroNivel}: {nivel.nombre}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-extrabold block">
                      {nivel.descuentoPorcentaje}% Descuento
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {nivel.descripcion}
                </p>

                <div className="mt-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Desde {nivel.estrellasMin} estrellas</span>
                  {esActual && (
                    <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-black">
                      ¡Tu Nivel!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Menú de Opciones del Usuario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Ficha de Información Personal y Edición */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              Datos de tu Cuenta
            </h3>
            <button
              type="button"
              onClick={() => setEditando(!editando)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editando ? 'Cancelar' : 'Personalizar'}</span>
            </button>
          </div>

          {!editando ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Nombre:</span>
                <span className="font-extrabold text-slate-900">{usuarioActual?.nombre}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Teléfono:</span>
                <span className="font-extrabold text-slate-900">{usuarioActual?.telefono || '+593 99 841 2901'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Correo:</span>
                <span className="font-extrabold text-slate-900">{usuarioActual?.email || 'pasajero@chiva.ec'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-bold">Rol:</span>
                <span className="font-black text-emerald-700 capitalize">{usuarioActual?.rol || 'pasajero'}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGuardarPerfil} className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={nombreEdit}
                  onChange={(e) => setNombreEdit(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">
                  Teléfono
                </label>
                <input
                  type="text"
                  required
                  value={telefonoEdit}
                  onChange={(e) => setTelefonoEdit(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditando(false)}
                  className="flex-1 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl"
                >
                  Guardar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Menú de Accesos Rápidos */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
          <h3 className="text-xs font-black uppercase text-slate-700 border-b border-slate-100 pb-2">
            Accesos de Pasajero
          </h3>

          <button
            type="button"
            onClick={handleComprarBoleto}
            className="w-full p-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              <span>Comprar un Boleto Ibarra ➔ Quito</span>
            </div>
            <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded-lg">
              -{infoProgreso.descuentoActual}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              reproducirClickSuave();
              setActiveTab('historial');
            }}
            className="w-full p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-between transition-all cursor-pointer border border-slate-200"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" />
              <span>Ver Mis Viajes Anteriores</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => {
              reproducirClickSuave();
              setActiveTab('guambra');
            }}
            className="w-full p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-between transition-all cursor-pointer border border-slate-200"
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              <span>¿Cómo estás mi guambra? (Seguimiento)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => {
              reproducirClickSuave();
              logout();
            }}
            className="w-full p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-rose-200 mt-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
