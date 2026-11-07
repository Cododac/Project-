import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { ChivaLogo } from './ChivaLogo';
import { User, Lock, ArrowRight, AlertCircle, Mail, Phone, Sparkles, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';
import { reproducirClickSuave } from '../utils/soundEffects';

export const PantallaLogin: React.FC = () => {
  const { 
    mostrarLogin, 
    setMostrarLogin, 
    login, 
    loginConGoogle, 
    loginConEmail, 
    registrarConEmail, 
    usuarioActual 
  } = useTransport();

  const [modo, setModo] = useState<'login' | 'registro'>('login');
  
  // Campos Login
  const [identificador, setIdentificador] = useState('Pasajero');
  const [passwordLogin, setPasswordLogin] = useState('Pasajero');

  // Campos Registro
  const [nombreRegistro, setNombreRegistro] = useState('');
  const [emailRegistro, setEmailRegistro] = useState('');
  const [telefonoRegistro, setTelefonoRegistro] = useState('+593 99 ');
  const [passwordRegistro, setPasswordRegistro] = useState('');

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!mostrarLogin && usuarioActual) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reproducirClickSuave();
    setError(null);
    setCargando(true);

    try {
      const idTrim = identificador.trim();
      const passTrim = passwordLogin.trim();

      // Si es correo electrónico con @, usar Firebase Auth real
      if (idTrim.includes('@')) {
        const res = await loginConEmail(idTrim, passTrim);
        if (!res.success && res.message) {
          setError(res.message);
        }
      } else {
        // Nombre de usuario estándar o demo (Pasajero / Baez)
        const res = login(idTrim, passTrim);
        if (!res.success && res.message) {
          setError(res.message);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  const handleRegistroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reproducirClickSuave();
    setError(null);

    if (passwordRegistro.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    setCargando(true);
    try {
      const res = await registrarConEmail(
        emailRegistro,
        passwordRegistro,
        nombreRegistro,
        telefonoRegistro
      );
      if (!res.success && res.message) {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Error al registrar usuario');
    } finally {
      setCargando(false);
    }
  };

  const handleQuickLogin = (userVal: string, passVal: string) => {
    reproducirClickSuave();
    setModo('login');
    setIdentificador(userVal);
    setPasswordLogin(passVal);
    setError(null);
    login(userVal, passVal);
  };

  const handleGoogleLogin = async () => {
    reproducirClickSuave();
    setCargando(true);
    setError(null);
    try {
      await loginConGoogle();
    } catch (err: any) {
      setError(err?.message || 'Error conectando con Google');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-slate-900 overflow-hidden my-auto">
        {/* Fondo decorativo con gradiente verde */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo de la Chiva */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <ChivaLogo size="lg" />
          </div>

          {/* LETRERO JOCOSO ECUATORIANO DESALINEADO Y ULTRA VISIBLE (Requerido) */}
          <div className="pt-1 px-1">
            <div className="transform -rotate-2 hover:rotate-0 transition-transform duration-300 bg-amber-300 text-slate-950 p-3 rounded-2xl border-3 border-slate-950 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] inline-block w-full">
              <span className="text-[10px] font-black uppercase tracking-widest bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md inline-block mb-1">
                Letrero de Parabrisas
              </span>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight leading-tight">
                "¿Sigues viajando en bus? <br />
                <span className="text-rose-600 underline decoration-slate-950 decoration-2">
                  ¡Qué cholazo, mijín!
                </span>"
              </h2>
            </div>
          </div>
        </div>

        {/* Selector de Pestañas: Iniciar Sesión / Crear Cuenta */}
        <div className="mt-4 flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              reproducirClickSuave();
              setModo('login');
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              modo === 'login'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Iniciar Sesión</span>
          </button>

          <button
            type="button"
            onClick={() => {
              reproducirClickSuave();
              setModo('registro');
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              modo === 'registro'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Crear Cuenta Real</span>
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* BOTÓN OFICIAL DE GOOGLE SIGN-IN */}
        <div className="mt-4 space-y-2.5">
          <button
            type="button"
            disabled={cargando}
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-bold text-xs sm:text-sm rounded-xl border-2 border-slate-200 hover:border-slate-300 shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Conectar con Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2.5 text-[10px] font-bold uppercase text-slate-400 absolute">
              o con correo electrónico
            </span>
          </div>
        </div>

        {/* Formulario 1: Iniciar Sesión */}
        {modo === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="mt-2.5 space-y-2.5">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-0.5">
                Correo o Usuario
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                  placeholder="ej. Pasajero o tu@correo.com"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-0.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={passwordLogin}
                  onChange={(e) => setPasswordLogin(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
            >
              <span>{cargando ? 'Ingresando...' : 'Entrar a Chiva'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        ) : (
          /* Formulario 2: Crear Cuenta Real en Firebase */
          <form onSubmit={handleRegistroSubmit} className="mt-2.5 space-y-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-0.5">
                Nombre y Apellido
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={nombreRegistro}
                  onChange={(e) => setNombreRegistro(e.target.value)}
                  placeholder="Mateo Cárdenas"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-0.5">
                Correo Electrónico Real
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={emailRegistro}
                  onChange={(e) => setEmailRegistro(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-0.5">
                Teléfono Celular
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={telefonoRegistro}
                  onChange={(e) => setTelefonoRegistro(e.target.value)}
                  placeholder="+593 99 841 2901"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-0.5">
                Contraseña (mínimo 6 caracteres)
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordRegistro}
                  onChange={(e) => setPasswordRegistro(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-1.5"
            >
              <span>{cargando ? 'Creando cuenta...' : 'Registrarme en Chiva'}</span>
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        )}

        {/* Accesos Rápidos de Prueba (1-Click) */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center mb-1">
            Accesos rápidos de prueba:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('Pasajero', 'Pasajero')}
              className="p-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-left transition-colors cursor-pointer"
            >
              <span className="text-xs font-black block">👤 Pasajero Demo</span>
              <span className="text-[10px] text-emerald-700 font-mono">Pasajero / Pasajero</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('Baez', 'Baez')}
              className="p-1.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900 text-left transition-colors cursor-pointer"
            >
              <span className="text-xs font-black block">🚐 Chófer Baez</span>
              <span className="text-[10px] text-slate-600 font-mono">Baez / Baez</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
