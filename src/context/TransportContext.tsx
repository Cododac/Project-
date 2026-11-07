import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Salida, 
  Reserva, 
  SalidaConEstado, 
  MetodoPago, 
  EstadoPago, 
  Usuario, 
  Refrigerio,
  RefrigerioComida,
  RefrigerioBebida,
  NotificacionPush,
  TipoEmergencia,
  ValoracionViaje,
  NombreNivel
} from '../types';
import { 
  testConnection, 
  guardarReservaFirestore, 
  reportarEmergenciaFirestore, 
  actualizarAbordajeFirestore,
  guardarValoracionFirestore,
  guardarUsuarioFirestore
} from '../firebase/dbService';
import { auth } from '../firebase/config';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  SALIDAS_INICIALES, 
  RESERVAS_INICIALES, 
  PUNTOS_PARTIDA_IBARRA, 
  PUNTOS_LLEGADA_QUITO 
} from '../data/mockData';
import { reproducirSonidoCompra } from '../utils/soundEffects';
import { calcularProgresoLealtad, NIVELES_CHIVA } from '../utils/nivelesLealtad';

const STORAGE_SALIDAS_KEY = 'chiva_salidas_ibarra_quito_v5';
const STORAGE_RESERVAS_KEY = 'chiva_reservas_ibarra_quito_v5';
const STORAGE_USUARIO_KEY = 'chiva_usuario_activo_v5';
const STORAGE_NOTIF_KEY = 'chiva_notificaciones_v5';
const STORAGE_VALORACIONES_KEY = 'chiva_valoraciones_v5';

interface TransportContextType {
  salidas: Salida[];
  reservas: Reserva[];
  salidasConEstado: SalidaConEstado[];
  
  // Usuario, Autenticación y Niveles de Lealtad
  usuarioActual: Usuario | null;
  setUsuarioActual: (u: Usuario | null) => void;
  login: (user: string, pass: string) => { success: boolean; message?: string };
  loginConGoogle: () => Promise<void>;
  registrarConEmail: (email: string, pass: string, nombre: string, tel: string) => Promise<{ success: boolean; message?: string }>;
  loginConEmail: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  actualizarPerfil: (datos: Partial<Usuario>) => void;
  logout: () => void;
  mostrarLogin: boolean;
  setMostrarLogin: (show: boolean) => void;

  // Valoración del viaje y conductor (Firestore)
  reservaParaValorar: Reserva | null;
  setReservaParaValorar: (r: Reserva | null) => void;
  guardarValoracion: (valoracion: ValoracionViaje) => Promise<void>;
  valoraciones: ValoracionViaje[];

  // Pantalla de Celebración Verde y Sonidos
  mostrarCelebracionVerde: boolean;
  setMostrarCelebracionVerde: (show: boolean) => void;
  mostrarModalEmergenciaGlobal: boolean;
  setMostrarModalEmergenciaGlobal: (show: boolean) => void;

  // Refrigerio a bordo ($1 USD)
  refrigerio: Refrigerio;
  setRefrigerio: React.Dispatch<React.SetStateAction<Refrigerio>>;
  toggleRefrigerioActivo: (activo?: boolean) => void;
  seleccionarComida: (comida: RefrigerioComida) => void;
  seleccionarBebida: (bebida: RefrigerioBebida) => void;

  // Notificaciones Push
  notificaciones: NotificacionPush[];
  notificacionActiva: NotificacionPush | null;
  enviarNotificacion: (titulo: string, mensaje: string, tipo?: NotificacionPush['tipo']) => void;
  cerrarNotificacionActiva: () => void;
  marcarTodasNotificacionesLeidas: () => void;

  // Flujo por pasos / pantallas separadas
  bookingStep: 1 | 2 | 3 | 4;
  setBookingStep: (step: 1 | 2 | 3 | 4) => void;
  avanzarPaso: () => void;
  retrocederPaso: () => void;
  iniciarNuevaReserva: () => void;

  // Pantalla 1: Partida y Destino (Ibarra ➔ Quito)
  puntoPartida: string;
  setPuntoPartida: (p: string) => void;
  coordsPartida: [number, number];
  setCoordsPartida: (c: [number, number]) => void;
  direccionPartidaManual: string;
  setDireccionPartidaManual: (d: string) => void;
  puntoLlegada: string;
  setPuntoLlegada: (p: string) => void;
  coordsLlegada: [number, number];
  setCoordsLlegada: (c: [number, number]) => void;
  direccionLlegadaManual: string;
  setDireccionLlegadaManual: (d: string) => void;
  fechaViaje: string;
  setFechaViaje: (f: string) => void;

  // Salida seleccionada
  selectedSalida: SalidaConEstado | null;
  selectedSalidaId: string | null;
  setSelectedSalidaId: (id: string | null) => void;

  // Pantalla 2: Asientos
  selectedAsientos: number[];
  toggleAsiento: (numero: number) => { success: boolean; message?: string };
  limpiarSeleccionAsientos: () => void;

  // Pantalla 3 y 4: Reserva
  crearReserva: (datos: {
    pasajeroNombre: string;
    pasajeroTelefono: string;
    pasajeroEmail?: string;
    puntoPartidaPersonalizado: string;
    puntoLlegadaPersonalizado: string;
    metodoPago: MetodoPago;
    detallesPago?: {
      numeroTarjetaOculto?: string;
      cuentaPayphone?: string;
      cuentaPaypal?: string;
    };
    notas?: string;
  }) => Reserva;

  marcarComoPagada: (reservaId: string, forzarEstado?: EstadoPago) => void;
  cancelarReserva: (reservaId: string) => void;
  agregarSalida: (nueva: Omit<Salida, 'id'>) => Salida;
  resetearDatos: () => void;

  reservaConfirmada: Reserva | null;
  setReservaConfirmada: (reserva: Reserva | null) => void;

  // Sección ¿Cómo estás mi guambra? & Seguimiento en tiempo real
  codigoSeguimientoSeleccionado: string;
  setCodigoSeguimientoSeleccionado: (codigo: string) => void;
  reportarEmergencia: (codigoReserva: string, tipo: TipoEmergencia, descripcion: string) => Promise<void>;
  actualizarEstadoGuambra: (codigoReserva: string, estado: 'viajando_bien' | 'ya_llego_bien', ubicacion?: string) => Promise<void>;

  // Navegación principal: Reservar, Historial, ¿Cómo estás mi guambra?, Mi Perfil, Chófer
  activeTab: 'pasajero' | 'historial' | 'guambra' | 'perfil' | 'admin';
  setActiveTab: (tab: 'pasajero' | 'historial' | 'guambra' | 'perfil' | 'admin') => void;
}

const TransportContext = createContext<TransportContextType | undefined>(undefined);

export const TransportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialización de usuario con niveles de lealtad
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_USUARIO_KEY);
      if (guardado) {
        const u = JSON.parse(guardado);
        const prog = calcularProgresoLealtad(u.viajesCompletados || 0, u.estrellas || 0);
        return {
          ...u,
          estrellas: prog.estrellas,
          viajesCompletados: prog.viajesTotales,
          nivel: prog.nivelActual.nombre,
          descuentoNivel: prog.descuentoActual,
          avatar: (!u.avatar || u.avatar.includes('unsplash')) ? prog.nivelActual.avatarUrl : u.avatar
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const [mostrarLogin, setMostrarLogin] = useState<boolean>(false);

  // Valoración de viajes
  const [reservaParaValorar, setReservaParaValorar] = useState<Reserva | null>(null);
  const [valoraciones, setValoraciones] = useState<ValoracionViaje[]>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_VALORACIONES_KEY);
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  // Pantalla festiva verde al comprar y modal global de emergencia
  const [mostrarCelebracionVerde, setMostrarCelebracionVerde] = useState<boolean>(false);
  const [mostrarModalEmergenciaGlobal, setMostrarModalEmergenciaGlobal] = useState<boolean>(false);

  // Refrigerio a bordo ($1 USD)
  const [refrigerio, setRefrigerio] = useState<Refrigerio>({
    activo: false,
    comida: 'sanduchito',
    bebida: 'jugo',
    precio: 1
  });

  const toggleRefrigerioActivo = (activo?: boolean) => {
    setRefrigerio((prev) => ({
      ...prev,
      activo: activo !== undefined ? activo : !prev.activo
    }));
  };

  const seleccionarComida = (comida: RefrigerioComida) => {
    setRefrigerio((prev) => ({
      ...prev,
      comida,
      activo: true
    }));
  };

  const seleccionarBebida = (bebida: RefrigerioBebida) => {
    setRefrigerio((prev) => ({
      ...prev,
      bebida,
      activo: true
    }));
  };

  // Notificaciones Push
  const NOTIFICACIONES_DEMO: NotificacionPush[] = [
    {
      id: 'notif-1',
      titulo: '🚐 Chofer en camino',
      mensaje: 'Marco Baez está saliendo con la Sprinter IBC-4821 hacia tu recogida en Ibarra.',
      fecha: 'Hace 5 min',
      leida: false,
      tipo: 'chofer'
    },
    {
      id: 'notif-2',
      titulo: '⭐ Programa de Lealtad Chiva Activo',
      mensaje: 'Cada 2 viajes ganas 1 estrella. ¡Acumula 20 estrellas y obtén 10% de descuento automático!',
      fecha: 'Hace 1 hora',
      leida: false,
      tipo: 'promo'
    },
    {
      id: 'notif-3',
      titulo: '🥪 Refrigerio a bordo por $1',
      mensaje: 'Pide tu sanduchito o humita con café caliente o jugo para el trayecto.',
      fecha: 'Hoy 08:30',
      leida: true,
      tipo: 'info'
    }
  ];

  const [notificaciones, setNotificaciones] = useState<NotificacionPush[]>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_NOTIF_KEY);
      return guardado ? JSON.parse(guardado) : NOTIFICACIONES_DEMO;
    } catch {
      return NOTIFICACIONES_DEMO;
    }
  });

  const [notificacionActiva, setNotificacionActiva] = useState<NotificacionPush | null>(null);

  const enviarNotificacion = (titulo: string, mensaje: string, tipo: NotificacionPush['tipo'] = 'info') => {
    const nueva: NotificacionPush = {
      id: `notif-${Date.now()}`,
      titulo,
      mensaje,
      fecha: 'Ahora mismo',
      leida: false,
      tipo
    };
    setNotificaciones((prev) => [nueva, ...prev]);
    setNotificacionActiva(nueva);

    // Auto-ocultar toast después de 6 segundos
    setTimeout(() => {
      setNotificacionActiva((curr) => (curr?.id === nueva.id ? null : curr));
    }, 6000);
  };

  const cerrarNotificacionActiva = () => {
    setNotificacionActiva(null);
  };

  const marcarTodasNotificacionesLeidas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const [salidas, setSalidas] = useState<Salida[]>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_SALIDAS_KEY);
      return guardado ? JSON.parse(guardado) : SALIDAS_INICIALES;
    } catch (e) {
      console.error('Error cargando salidas:', e);
      return SALIDAS_INICIALES;
    }
  });

  const [reservas, setReservas] = useState<Reserva[]>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_RESERVAS_KEY);
      return guardado ? JSON.parse(guardado) : RESERVAS_INICIALES;
    } catch (e) {
      console.error('Error cargando reservas:', e);
      return RESERVAS_INICIALES;
    }
  });

  // Pantallas: 1: Ubicación, 2: Asientos, 3: Datos & Pago, 4: Boleto
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1);

  // Puntos y coordenadas
  const [puntoPartida, setPuntoPartida] = useState<string>(PUNTOS_PARTIDA_IBARRA[0]);
  const [coordsPartida, setCoordsPartida] = useState<[number, number]>([-0.3472, -78.1189]); // Ibarra
  const [direccionPartidaManual, setDireccionPartidaManual] = useState<string>('');
  const [puntoLlegada, setPuntoLlegada] = useState<string>(PUNTOS_LLEGADA_QUITO[0]);
  const [coordsLlegada, setCoordsLlegada] = useState<[number, number]>([-0.0986, -78.4725]); // Carcelén, Quito
  const [direccionLlegadaManual, setDireccionLlegadaManual] = useState<string>('');
  const [fechaViaje, setFechaViaje] = useState<string>('2026-11-06');

  const [selectedSalidaId, setSelectedSalidaId] = useState<string | null>('IQ-01');
  const [selectedAsientos, setSelectedAsientos] = useState<number[]>([]);
  const [reservaConfirmada, setReservaConfirmada] = useState<Reserva | null>(null);
  const [activeTab, setActiveTab] = useState<'pasajero' | 'historial' | 'guambra' | 'perfil' | 'admin'>('pasajero');
  const [codigoSeguimientoSeleccionado, setCodigoSeguimientoSeleccionado] = useState<string>('CHIVA-8821');

  // Verificar conexión con Firestore y sincronizar Auth listener
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Si hay usuario de Firebase autenticado y no hay usuario local
        setUsuarioActual((prev) => {
          if (prev && prev.id === firebaseUser.uid) return prev;
          const prog = calcularProgresoLealtad(prev?.viajesCompletados || 0, prev?.estrellas || 0);
          const usuarioSync: Usuario = {
            id: firebaseUser.uid,
            user: firebaseUser.email?.split('@')[0] || 'Pasajero',
            email: firebaseUser.email || undefined,
            nombre: firebaseUser.displayName || prev?.nombre || 'Pasajero Chiva',
            rol: prev?.rol || 'pasajero',
            telefono: firebaseUser.phoneNumber || prev?.telefono || '+593 99 841 2901',
            avatar: firebaseUser.photoURL || prog.nivelActual.avatarUrl,
            estrellas: prog.estrellas,
            viajesCompletados: prog.viajesTotales,
            nivel: prog.nivelActual.nombre,
            descuentoNivel: prog.descuentoActual
          };
          return usuarioSync;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Persistir en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SALIDAS_KEY, JSON.stringify(salidas));
    } catch (e) {
      console.error(e);
    }
  }, [salidas]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RESERVAS_KEY, JSON.stringify(reservas));
    } catch (e) {
      console.error(e);
    }
  }, [reservas]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(notificaciones));
    } catch (e) {
      console.error(e);
    }
  }, [notificaciones]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_VALORACIONES_KEY, JSON.stringify(valoraciones));
    } catch (e) {
      console.error(e);
    }
  }, [valoraciones]);

  useEffect(() => {
    try {
      if (usuarioActual) {
        localStorage.setItem(STORAGE_USUARIO_KEY, JSON.stringify(usuarioActual));
      } else {
        localStorage.removeItem(STORAGE_USUARIO_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [usuarioActual]);

  // Si no hay usuario logueado al inicio, abrir modal de login
  useEffect(() => {
    if (!usuarioActual) {
      setMostrarLogin(true);
    }
  }, []);

  // Registro con Email y Password real en Firebase
  const registrarConEmail = async (email: string, pass: string, nombre: string, tel: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const uid = userCredential.user.uid;
      const prog = calcularProgresoLealtad(0, 0);

      const nuevoUsuario: Usuario = {
        id: uid,
        user: email.split('@')[0],
        email: email.trim(),
        nombre: nombre.trim() || email.split('@')[0],
        rol: 'pasajero',
        telefono: tel.trim() || '+593 99 841 2901',
        avatar: prog.nivelActual.avatarUrl,
        estrellas: 0,
        viajesCompletados: 0,
        nivel: 'guambra de casa',
        descuentoNivel: 0
      };

      setUsuarioActual(nuevoUsuario);
      await guardarUsuarioFirestore(nuevoUsuario);
      setMostrarLogin(false);
      setActiveTab('pasajero');
      enviarNotificacion('✨ Cuenta creada con éxito', `¡Bienvenido a Chiva, ${nuevoUsuario.nombre}! Empiezas como 'guambra de casa'.`, 'info');
      return { success: true };
    } catch (err: any) {
      console.error('Error en Firebase createUserWithEmailAndPassword:', err);
      let mensaje = 'No se pudo crear la cuenta. Intenta de nuevo.';
      if (err.code === 'auth/email-already-in-use') {
        mensaje = 'Este correo electrónico ya está registrado. Inicia sesión.';
      } else if (err.code === 'auth/weak-password') {
        mensaje = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        mensaje = 'El formato de correo no es válido.';
      }
      return { success: false, message: mensaje };
    }
  };

  // Iniciar Sesión con Email y Password real en Firebase
  const loginConEmail = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const uid = userCredential.user.uid;
      const prog = calcularProgresoLealtad(10, 5);

      const usuarioLogueado: Usuario = {
        id: uid,
        user: email.split('@')[0],
        email: email.trim(),
        nombre: userCredential.user.displayName || email.split('@')[0],
        rol: 'pasajero',
        telefono: '+593 99 841 2901',
        avatar: userCredential.user.photoURL || prog.nivelActual.avatarUrl,
        estrellas: prog.estrellas,
        viajesCompletados: prog.viajesTotales,
        nivel: prog.nivelActual.nombre,
        descuentoNivel: prog.descuentoActual
      };

      setUsuarioActual(usuarioLogueado);
      await guardarUsuarioFirestore(usuarioLogueado);
      setMostrarLogin(false);
      setActiveTab('pasajero');
      enviarNotificacion('👋 ¡Bienvenido de vuelta!', `Hola ${usuarioLogueado.nombre}, tu nivel es ${usuarioLogueado.nivel}.`, 'info');
      return { success: true };
    } catch (err: any) {
      console.error('Error en Firebase signInWithEmailAndPassword:', err);
      let mensaje = 'Correo o contraseña incorrectos.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        mensaje = 'Usuario o contraseña no encontrados.';
      } else if (err.code === 'auth/wrong-password') {
        mensaje = 'Contraseña incorrecta.';
      }
      return { success: false, message: mensaje };
    }
  };

  // Autenticación rápida de demostración (Pasajero / Baez)
  const login = (user: string, pass: string): { success: boolean; message?: string } => {
    const userTrim = user.trim();
    const passTrim = pass.trim();

    // 1. Usuario Pasajero: User Pasajero / Password Pasajero
    if (userTrim.toLowerCase() === 'pasajero' && passTrim.toLowerCase() === 'pasajero') {
      const prog = calcularProgresoLealtad(42, 21); // 42 viajes = 21 estrellas -> Nivel 2: "andariego" (10% descuento)
      const nuevoUsuario: Usuario = {
        id: 'usr-pasajero-01',
        user: 'Pasajero',
        email: 'pasajero@chiva.ec',
        nombre: 'Mateo Cárdenas',
        rol: 'pasajero',
        telefono: '+593 99 841 2901',
        avatar: prog.nivelActual.avatarUrl,
        estrellas: prog.estrellas,
        viajesCompletados: prog.viajesTotales,
        nivel: prog.nivelActual.nombre,
        descuentoNivel: prog.descuentoActual
      };
      setUsuarioActual(nuevoUsuario);
      setMostrarLogin(false);
      setActiveTab('pasajero');
      enviarNotificacion(
        '👋 ¡Bienvenido a Chiva, Mateo!',
        `Tu nivel actual es '${nuevoUsuario.nivel.toUpperCase()}' con ${nuevoUsuario.descuentoNivel}% de descuento en tus viajes.`,
        'promo'
      );
      return { success: true };
    }

    // 2. Usuario Chófer: User Baez / Password Baez
    if (userTrim.toLowerCase() === 'baez' && passTrim.toLowerCase() === 'baez') {
      const prog = calcularProgresoLealtad(150, 75); // 75 estrellas -> Nivel 4: "un capo" (30% descuento)
      const nuevoUsuario: Usuario = {
        id: 'usr-chofer-baez',
        user: 'Baez',
        email: 'baez@chiva.ec',
        nombre: 'Marco Baez (Chófer Oficial)',
        rol: 'chofer',
        telefono: '+593 98 410 7733',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
        estrellas: prog.estrellas,
        viajesCompletados: prog.viajesTotales,
        nivel: 'un capo',
        descuentoNivel: 30
      };
      setUsuarioActual(nuevoUsuario);
      setMostrarLogin(false);
      setActiveTab('admin'); // Llevar directo al panel de chofer
      enviarNotificacion('🚐 Turno Activo - Chófer Baez', 'Tienes pasajeros asignados en la ruta Ibarra ➔ Quito.', 'chofer');
      return { success: true };
    }

    return {
      success: false,
      message: 'Credenciales inválidas. Usa Pasajero/Pasajero o Baez/Baez o crea tu cuenta.'
    };
  };

  // Google Sign-In real con fallback amigable en caso de bloqueo por iframe
  const loginConGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const gUser = userCredential.user;
      const prog = calcularProgresoLealtad(24, 12);

      const nuevoUsuario: Usuario = {
        id: gUser.uid,
        user: gUser.email?.split('@')[0] || 'GoogleUser',
        email: gUser.email || 'usuario@gmail.com',
        nombre: gUser.displayName || 'Pasajero Google',
        rol: 'pasajero',
        telefono: gUser.phoneNumber || '+593 99 841 2901',
        avatar: gUser.photoURL || prog.nivelActual.avatarUrl,
        estrellas: prog.estrellas,
        viajesCompletados: prog.viajesTotales,
        nivel: prog.nivelActual.nombre,
        descuentoNivel: prog.descuentoActual
      };

      setUsuarioActual(nuevoUsuario);
      await guardarUsuarioFirestore(nuevoUsuario);
      setMostrarLogin(false);
      setActiveTab('pasajero');
      enviarNotificacion('✨ Sesión iniciada con Google', `¡Bienvenido a Chiva, ${nuevoUsuario.nombre}! Nivel: ${nuevoUsuario.nivel}.`, 'promo');
    } catch (err: any) {
      console.warn('Google Popup falló o bloqueado por el navegador iframe, aplicando sesión Google demo:', err);
      // Fallback seguro si el navegador del iframe bloquea popups de Google
      const prog = calcularProgresoLealtad(42, 21);
      const usuarioFallback: Usuario = {
        id: 'usr-google-baez',
        user: 'Cododac.baez',
        email: 'Cododac.baez@gmail.com',
        nombre: 'Cododac Baez (Google)',
        rol: 'pasajero',
        telefono: '+593 99 841 2901',
        avatar: prog.nivelActual.avatarUrl,
        estrellas: 21,
        viajesCompletados: 42,
        nivel: 'andariego',
        descuentoNivel: 10
      };
      setUsuarioActual(usuarioFallback);
      setMostrarLogin(false);
      setActiveTab('pasajero');
      enviarNotificacion('✨ Sesión iniciada con cuenta Google', '¡Bienvenido Cododac Baez! Nivel Andariego con 10% de descuento.', 'promo');
    }
  };

  const logout = () => {
    signOut(auth).catch(() => {});
    setUsuarioActual(null);
    setMostrarLogin(true);
    setActiveTab('pasajero');
  };

  const actualizarPerfil = (datos: Partial<Usuario>) => {
    setUsuarioActual((prev) => {
      if (!prev) return null;
      const actualizado = { ...prev, ...datos };
      try {
        localStorage.setItem(STORAGE_USUARIO_KEY, JSON.stringify(actualizado));
        guardarUsuarioFirestore(actualizado).catch(console.error);
      } catch (e) {
        console.error(e);
      }
      return actualizado;
    });
    enviarNotificacion('✅ Perfil actualizado', 'Tus datos han sido guardados exitosamente.', 'info');
  };

  // Guardar valoración del viaje en Firestore y actualizar reserva
  const guardarValoracion = async (val: ValoracionViaje) => {
    try {
      await guardarValoracionFirestore(val);
      setValoraciones((prev) => [val, ...prev]);

      // Actualizar la reserva en estado local y persistir
      setReservas((prev) =>
        prev.map((r) => {
          if (r.id === val.reservaId) {
            return {
              ...r,
              calificacion: val.estrellas,
              comentarioConductor: val.comentario
            };
          }
          return r;
        })
      );

      // Si el usuario es pasajero, sumar un viaje si no estaba contado
      if (usuarioActual && usuarioActual.rol === 'pasajero') {
        const nuevosViajes = (usuarioActual.viajesCompletados || 0) + 1;
        const prog = calcularProgresoLealtad(nuevosViajes);
        const uActualizado: Usuario = {
          ...usuarioActual,
          viajesCompletados: prog.viajesTotales,
          estrellas: prog.estrellas,
          nivel: prog.nivelActual.nombre,
          descuentoNivel: prog.descuentoActual
        };
        setUsuarioActual(uActualizado);
        guardarUsuarioFirestore(uActualizado).catch(console.error);
      }
    } catch (e) {
      console.error('Error guardando valoración:', e);
    }
  };

  // Salidas calculadas con su estado actual
  const salidasConEstado: SalidaConEstado[] = useMemo(() => {
    return salidas.map((salida) => {
      const reservasDeSalida = reservas.filter((r) => r.salidaId === salida.id);
      const asientosOcupados = reservasDeSalida.flatMap((r) => r.asientos);
      const asientosLibresCount = Math.max(0, salida.totalAsientos - asientosOcupados.length);
      const porcentajeOcupacion = Math.round((asientosOcupados.length / salida.totalAsientos) * 100);

      return {
        ...salida,
        asientosOcupados,
        asientosLibresCount,
        porcentajeOcupacion,
        reservas: reservasDeSalida
      };
    });
  }, [salidas, reservas]);

  const selectedSalida = useMemo(() => {
    if (!selectedSalidaId) return null;
    return salidasConEstado.find((s) => s.id === selectedSalidaId) || null;
  }, [selectedSalidaId, salidasConEstado]);

  const toggleAsiento = (numero: number): { success: boolean; message?: string } => {
    if (!selectedSalida) return { success: false, message: 'Selecciona una salida' };

    if (selectedSalida.asientosOcupados.includes(numero)) {
      return { success: false, message: `El asiento ${numero} ya está ocupado.` };
    }

    if (selectedAsientos.includes(numero)) {
      setSelectedAsientos((prev) => prev.filter((n) => n !== numero));
      return { success: true };
    } else {
      if (selectedAsientos.length >= 4) {
        return {
          success: false,
          message: 'Máximo 4 asientos por reserva, mijín.'
        };
      }
      setSelectedAsientos((prev) => [...prev, numero].sort((a, b) => a - b));
      return { success: true };
    }
  };

  const limpiarSeleccionAsientos = () => {
    setSelectedAsientos([]);
  };

  const avanzarPaso = () => {
    setBookingStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : prev));
  };

  const retrocederPaso = () => {
    setBookingStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev));
  };

  const iniciarNuevaReserva = () => {
    setSelectedAsientos([]);
    setReservaConfirmada(null);
    setBookingStep(1);
  };

  const crearReserva = (datos: {
    pasajeroNombre: string;
    pasajeroTelefono: string;
    pasajeroEmail?: string;
    puntoPartidaPersonalizado: string;
    puntoLlegadaPersonalizado: string;
    metodoPago: MetodoPago;
    detallesPago?: {
      numeroTarjetaOculto?: string;
      cuentaPayphone?: string;
      cuentaPaypal?: string;
    };
    notas?: string;
  }): Reserva => {
    if (!selectedSalida) throw new Error('No hay salida seleccionada');
    if (selectedAsientos.length === 0) throw new Error('Debes seleccionar al menos un asiento');

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const codigoReserva = `CHIVA-${randomNum}`;

    const estadoInicial: EstadoPago = 
      (datos.metodoPago === 'tarjeta' || datos.metodoPago === 'payphone' || datos.metodoPago === 'paypal')
        ? 'pagado'
        : 'pendiente';

    // Descuento del nivel de lealtad (0%, 10%, 20%, 30%)
    const subtotal = selectedSalida.precio * selectedAsientos.length;
    const descuentoPorcentaje = usuarioActual?.descuentoNivel || 0;
    let totalCalculado = Math.round(subtotal * (1 - descuentoPorcentaje / 100));

    // Agregar refrigerio ($1 USD) si está activo
    if (refrigerio.activo) {
      totalCalculado += refrigerio.precio;
    }

    const nuevaReserva: Reserva = {
      id: codigoReserva,
      salidaId: selectedSalida.id,
      pasajeroNombre: datos.pasajeroNombre.trim(),
      pasajeroTelefono: datos.pasajeroTelefono.trim(),
      pasajeroEmail: datos.pasajeroEmail?.trim(),
      puntoPartidaPersonalizado: datos.puntoPartidaPersonalizado,
      coordsPartida: coordsPartida,
      puntoLlegadaPersonalizado: datos.puntoLlegadaPersonalizado,
      coordsLlegada: coordsLlegada,
      asientos: [...selectedAsientos],
      metodoPago: datos.metodoPago,
      detallesPago: datos.detallesPago,
      estadoPago: estadoInicial,
      total: totalCalculado,
      refrigerio: refrigerio.activo ? { ...refrigerio } : undefined,
      fechaCreacion: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notas: datos.notas,
      descuentoAplicado: descuentoPorcentaje,
      nivelPasajero: usuarioActual?.nivel || 'guambra de casa'
    };

    setReservas((prev) => [nuevaReserva, ...prev]);
    setReservaConfirmada(nuevaReserva);
    setCodigoSeguimientoSeleccionado(nuevaReserva.id);
    setSelectedAsientos([]);
    setBookingStep(4);

    // Sincronizar en tiempo real con Firestore
    guardarReservaFirestore(nuevaReserva).catch(console.error);

    // Actualizar progreso de lealtad del usuario
    if (usuarioActual && usuarioActual.rol === 'pasajero') {
      const nuevoTotalViajes = (usuarioActual.viajesCompletados || 0) + 1;
      const nuevoProg = calcularProgresoLealtad(nuevoTotalViajes);
      const subioDeNivel = nuevoProg.nivelActual.nombre !== usuarioActual.nivel;

      const userActualizado: Usuario = {
        ...usuarioActual,
        viajesCompletados: nuevoProg.viajesTotales,
        estrellas: nuevoProg.estrellas,
        nivel: nuevoProg.nivelActual.nombre,
        descuentoNivel: nuevoProg.descuentoActual
      };
      setUsuarioActual(userActualizado);
      guardarUsuarioFirestore(userActualizado).catch(console.error);

      if (subioDeNivel) {
        enviarNotificacion(
          '🚀 ¡SUBISTE DE NIVEL EN CHIVA!',
          `¡Felicitaciones! Ahora eres '${nuevoProg.nivelActual.nombre.toUpperCase()}' con ${nuevoProg.descuentoActual}% de descuento en todos tus viajes.`,
          'promo'
        );
      }
    }

    // Reproducir sonido triunfal de compra y activar pantalla verde festiva
    reproducirSonidoCompra();
    setMostrarCelebracionVerde(true);

    // Disparar notificación push automática
    enviarNotificacion(
      '🎉 ¡Boleto Emitido Exitosamente!',
      `Reserva ${codigoReserva} para Ibarra ➔ Quito confirmada. Descuento aplicado: ${descuentoPorcentaje}%. Asientos: [${nuevaReserva.asientos.join(', ')}]${refrigerio.activo ? ' con refrigerio a bordo.' : '.'}`,
      'reserva'
    );

    return nuevaReserva;
  };

  const marcarComoPagada = (reservaId: string, forzarEstado?: EstadoPago) => {
    setReservas((prev) =>
      prev.map((r) => {
        if (r.id === reservaId) {
          const nuevoEstado = forzarEstado ?? (r.estadoPago === 'pagado' ? 'pendiente' : 'pagado');
          const reservaActualizada = { 
            ...r, 
            estadoPago: nuevoEstado,
            estadoAbordaje: nuevoEstado === 'pagado' ? ('abordado' as const) : r.estadoAbordaje 
          };
          guardarReservaFirestore(reservaActualizada).catch(console.error);
          return reservaActualizada;
        }
        return r;
      })
    );
  };

  const reportarEmergencia = async (codigoReserva: string, tipo: TipoEmergencia, descripcion: string) => {
    try {
      await reportarEmergenciaFirestore(codigoReserva, tipo, descripcion);
    } catch (e) {
      console.warn('Error reportando emergencia en Firestore:', e);
    }
  };

  const actualizarEstadoGuambra = async (
    codigoReserva: string, 
    estado: 'viajando_bien' | 'ya_llego_bien', 
    ubicacion?: string
  ) => {
    try {
      if (estado === 'ya_llego_bien') {
        await actualizarAbordajeFirestore(codigoReserva, 'completado');

        // Disparar modal de valoración de viaje para calificar al conductor
        const reservaEncontrada = reservas.find((r) => r.id === codigoReserva);
        if (reservaEncontrada) {
          setReservaParaValorar(reservaEncontrada);
        }
      }
    } catch (e) {
      console.warn('Error actualizando estado en Firestore:', e);
    }
  };

  const cancelarReserva = (reservaId: string) => {
    setReservas((prev) => prev.filter((r) => r.id !== reservaId));
  };

  const agregarSalida = (nueva: Omit<Salida, 'id'>): Salida => {
    const id = `IQ-0${salidas.length + 1}`;
    const salidaCreada: Salida = { ...nueva, id };
    setSalidas((prev) => [...prev, salidaCreada]);
    return salidaCreada;
  };

  const resetearDatos = () => {
    setSalidas(SALIDAS_INICIALES);
    setReservas(RESERVAS_INICIALES);
    setSelectedAsientos([]);
    setSelectedSalidaId('IQ-01');
    setReservaConfirmada(null);
    setBookingStep(1);
    setPuntoPartida(PUNTOS_PARTIDA_IBARRA[0]);
    setCoordsPartida([-0.3472, -78.1189]);
    setDireccionPartidaManual('');
    setPuntoLlegada(PUNTOS_LLEGADA_QUITO[0]);
    setCoordsLlegada([-0.0986, -78.4725]);
    setDireccionLlegadaManual('');
    setRefrigerio({
      activo: false,
      comida: 'sanduchito',
      bebida: 'jugo',
      precio: 1
    });
    localStorage.removeItem(STORAGE_SALIDAS_KEY);
    localStorage.removeItem(STORAGE_RESERVAS_KEY);
  };

  return (
    <TransportContext.Provider
      value={{
        salidas,
        reservas,
        salidasConEstado,
        usuarioActual,
        setUsuarioActual,
        login,
        loginConGoogle,
        registrarConEmail,
        loginConEmail,
        actualizarPerfil,
        logout,
        mostrarLogin,
        setMostrarLogin,
        reservaParaValorar,
        setReservaParaValorar,
        guardarValoracion,
        valoraciones,
        mostrarCelebracionVerde,
        setMostrarCelebracionVerde,
        mostrarModalEmergenciaGlobal,
        setMostrarModalEmergenciaGlobal,
        refrigerio,
        setRefrigerio,
        toggleRefrigerioActivo,
        seleccionarComida,
        seleccionarBebida,
        notificaciones,
        notificacionActiva,
        enviarNotificacion,
        cerrarNotificacionActiva,
        marcarTodasNotificacionesLeidas,
        bookingStep,
        setBookingStep,
        avanzarPaso,
        retrocederPaso,
        iniciarNuevaReserva,
        puntoPartida,
        setPuntoPartida,
        coordsPartida,
        setCoordsPartida,
        direccionPartidaManual,
        setDireccionPartidaManual,
        puntoLlegada,
        setPuntoLlegada,
        coordsLlegada,
        setCoordsLlegada,
        direccionLlegadaManual,
        setDireccionLlegadaManual,
        fechaViaje,
        setFechaViaje,
        selectedSalida,
        selectedSalidaId,
        setSelectedSalidaId,
        selectedAsientos,
        toggleAsiento,
        limpiarSeleccionAsientos,
        crearReserva,
        marcarComoPagada,
        cancelarReserva,
        agregarSalida,
        resetearDatos,
        reservaConfirmada,
        setReservaConfirmada,
        codigoSeguimientoSeleccionado,
        setCodigoSeguimientoSeleccionado,
        reportarEmergencia,
        actualizarEstadoGuambra,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </TransportContext.Provider>
  );
};

export const useTransport = () => {
  const context = useContext(TransportContext);
  if (!context) {
    throw new Error('useTransport debe ser usado dentro de un TransportProvider');
  }
  return context;
};
