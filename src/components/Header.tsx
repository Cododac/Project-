import React, { useState, useRef, useEffect } from 'react';
import { useTransport } from '../context/TransportContext';
import { ChivaLogo } from './ChivaLogo';
import { 
  Bell, 
  RotateCcw, 
  LogOut, 
  Edit3, 
  User, 
  Phone, 
  ShieldCheck, 
  Check, 
  X,
  Ticket,
  Star,
  Award,
  Percent,
  Sparkles
} from 'lucide-react';
import { reproducirClickSuave } from '../utils/soundEffects';

export const Header: React.FC = () => {
  const { 
    setActiveTab, 
    reservas, 
    resetearDatos, 
    usuarioActual, 
    actualizarPerfil,
    logout, 
    setMostrarLogin,
    notificaciones,
    enviarNotificacion
  } = useTransport();

  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombreEdit, setNombreEdit] = useState('');
  const [telefonoEdit, setTelefonoEdit] = useState('');
  const [avatarEdit, setAvatarEdit] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length;
  const totalPasajesUsuario = reservas.filter((r) => 
    usuarioActual ? r.pasajeroNombre.toLowerCase().includes(usuarioActual.nombre.toLowerCase().split(' ')[0]) : false
  ).length;

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMostrarMenuUsuario(false);
        setModoEdicion(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAbrirMenuUsuario = () => {
    reproducirClickSuave();
    if (usuarioActual) {
      setNombreEdit(usuarioActual.nombre);
      setTelefonoEdit(usuarioActual.telefono || '+593 99 841 2901');
      setAvatarEdit(usuarioActual.avatar);
      setModoEdicion(false);
      setMostrarMenuUsuario(!mostrarMenuUsuario);
    } else {
      setMostrarLogin(true);
    }
  };

  const handleGuardarPersonalizacion = (e: React.FormEvent) => {
    e.preventDefault();
    reproducirClickSuave();
    actualizarPerfil({
      nombre: nombreEdit.trim() || usuarioActual?.nombre,
      telefono: telefonoEdit.trim() || usuarioActual?.telefono,
      avatar: avatarEdit.trim() || usuarioActual?.avatar
    });
    setModoEdicion(false);
  };

  const handleCerrarSesion = () => {
    reproducirClickSuave();
    setMostrarMenuUsuario(false);
    logout();
  };

  const handleIrAPerfil = () => {
    reproducirClickSuave();
    setMostrarMenuUsuario(false);
    setActiveTab('perfil');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo Simplista de Chiva */}
          <div 
            onClick={() => {
              reproducirClickSuave();
              setActiveTab('pasajero');
            }}
            className="cursor-pointer"
          >
            <ChivaLogo size="md" />
          </div>

          {/* Banner Superior Limpio (Sin abarrotar) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Botón de Nivel & Estrellas de Lealtad (Reemplaza la ruleta eliminada) */}
            {usuarioActual && (
              <button
                type="button"
                onClick={handleIrAPerfil}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 text-slate-950 border border-amber-400/50 hover:bg-amber-400/30 transition-all font-black text-xs cursor-pointer shadow-2xs"
                title="Ver tu nivel de lealtad, velocímetro y descuentos"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span className="hidden sm:inline capitalize">
                  {usuarioActual.nivel} ({usuarioActual.estrellas}★)
                </span>
                <span className="sm:hidden">
                  {usuarioActual.estrellas}★
                </span>
                {usuarioActual.descuentoNivel > 0 && (
                  <span className="bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded-md text-[10px] font-black">
                    -{usuarioActual.descuentoNivel}%
                  </span>
                )}
              </button>
            )}

            {/* Campana de Notificaciones Push */}
            <button
              type="button"
              onClick={() => {
                reproducirClickSuave();
                enviarNotificacion(
                  '🚐 Chofer en camino - Ibarra ➔ Quito',
                  'Marco Baez ya está coordinando la recogida en tu punto de abordaje.',
                  'chofer'
                );
              }}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Notificaciones Push"
            >
              <Bell className="w-4 h-4" />
              {notificacionesNoLeidas > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center animate-pulse">
                  {notificacionesNoLeidas}
                </span>
              )}
            </button>

            {/* Restablecer datos */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('¿Reiniciar datos a valores iniciales de prueba?')) {
                  resetearDatos();
                }
              }}
              title="Restablecer datos demo"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* FOTO DE USUARIO CON MENÚ DESPLEGABLE */}
            <div className="relative" ref={menuRef}>
              {usuarioActual ? (
                <button
                  type="button"
                  onClick={handleAbrirMenuUsuario}
                  className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 cursor-pointer"
                  title="Mi Perfil - Clic para ver opciones y cerrar sesión"
                >
                  <div className="relative">
                    <img
                      src={usuarioActual.avatar}
                      alt={usuarioActual.nombre}
                      className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                    />
                    <div className="absolute 0 bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>

                  <div className="hidden sm:block text-left leading-tight pr-1">
                    <span className="text-xs font-black text-slate-900 block truncate max-w-[110px]">
                      {usuarioActual.nombre}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 block capitalize">
                      {usuarioActual.rol === 'chofer' ? 'Chófer Pro' : usuarioActual.nivel}
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMostrarLogin(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black uppercase transition-all shadow-xs cursor-pointer"
                >
                  Entrar
                </button>
              )}

              {/* TARJETA DESPLEGABLE CON DATOS DE USUARIO, PERSONALIZAR Y CERRAR SESIÓN */}
              {mostrarMenuUsuario && usuarioActual && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 z-50 animate-scaleUp text-slate-800">
                  {!modoEdicion ? (
                    <div className="space-y-3.5">
                      {/* Cabecera del Perfil */}
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                        <img
                          src={usuarioActual.avatar}
                          alt={usuarioActual.nombre}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider mb-0.5">
                            {usuarioActual.rol === 'chofer' ? '🚐 Chófer Oficial' : `⚡ Nivel: ${usuarioActual.nivel}`}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 truncate">
                            {usuarioActual.nombre}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium block truncate">
                            {usuarioActual.email || `@${usuarioActual.user}`}
                          </span>
                        </div>
                      </div>

                      {/* Datos y Estadísticas de Lealtad */}
                      <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="font-bold flex items-center gap-1.5 text-slate-500">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Estrellas Chiva:
                          </span>
                          <span className="font-extrabold text-slate-900">
                            {usuarioActual.estrellas} estrellas
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-700">
                          <span className="font-bold flex items-center gap-1.5 text-slate-500">
                            <Ticket className="w-3.5 h-3.5 text-emerald-600" /> Viajes Realizados:
                          </span>
                          <span className="font-extrabold text-slate-900">
                            {usuarioActual.viajesCompletados || totalPasajesUsuario || 1} trayectos
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-700">
                          <span className="font-bold flex items-center gap-1.5 text-slate-500">
                            <Percent className="w-3.5 h-3.5 text-emerald-600" /> Descuento Activo:
                          </span>
                          <span className="font-extrabold text-emerald-700">
                            {usuarioActual.descuentoNivel}% OFF
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-700">
                          <span className="font-bold flex items-center gap-1.5 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400" /> Teléfono:
                          </span>
                          <span className="font-extrabold text-slate-900">
                            {usuarioActual.telefono || '+593 99 841 2901'}
                          </span>
                        </div>
                      </div>

                      {/* Acciones del menú: Ver Nivel, Personalizar y Cerrar Sesión */}
                      <div className="space-y-2 pt-1">
                        {usuarioActual.rol === 'chofer' && (
                          <button
                            type="button"
                            onClick={() => {
                              reproducirClickSuave();
                              setMostrarMenuUsuario(false);
                              setActiveTab('admin');
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Panel de Conductor Chófer</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleIrAPerfil}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                        >
                          <Award className="w-4 h-4 stroke-[2.5]" />
                          <span>Ver Mi Nivel & Velocímetro</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            reproducirClickSuave();
                            setModoEdicion(true);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                          <span>Personalizar Perfil</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCerrarSesion}
                          className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-600" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Formulario de Personalización */
                    <form onSubmit={handleGuardarPersonalizacion} className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-black text-slate-900 uppercase">Personalizar Datos</span>
                        <button
                          type="button"
                          onClick={() => setModoEdicion(false)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          required
                          value={nombreEdit}
                          onChange={(e) => setNombreEdit(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                          Teléfono de Contacto
                        </label>
                        <input
                          type="text"
                          required
                          value={telefonoEdit}
                          onChange={(e) => setTelefonoEdit(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                          URL de Avatar o Foto
                        </label>
                        <input
                          type="url"
                          value={avatarEdit}
                          onChange={(e) => setAvatarEdit(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setModoEdicion(false)}
                          className="flex-1 py-1.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
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
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
