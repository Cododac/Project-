import React, { useState, useEffect } from 'react';
import { useTransport } from '../context/TransportContext';
import { SeguimientoGuambra, TipoEmergencia } from '../types';
import { 
  Heart, 
  MapPin, 
  Share2, 
  Copy, 
  Check, 
  Clock, 
  Car, 
  Phone, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  Compass, 
  Navigation,
  Send,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Flame,
  Wrench,
  Shield,
  Siren
} from 'lucide-react';
import L from 'leaflet';

export const ComoEstasMiGuambra: React.FC = () => {
  const { 
    reservas, 
    salidas, 
    codigoSeguimientoSeleccionado, 
    setCodigoSeguimientoSeleccionado,
    reportarEmergencia,
    actualizarEstadoGuambra,
    enviarNotificacion
  } = useTransport();

  const [inputCodigo, setInputCodigo] = useState(codigoSeguimientoSeleccionado || 'CHIVA-8821');
  const [copiadoLink, setCopiadoLink] = useState(false);
  const [mostrarModalEmergencia, setMostrarModalEmergencia] = useState(false);
  const [tipoEmergenciaSeleccionada, setTipoEmergenciaSeleccionada] = useState<TipoEmergencia>('se_danio');
  const [descripcionEmergencia, setDescripcionEmergencia] = useState('');
  const [mapaInstancia, setMapaInstancia] = useState<L.Map | null>(null);
  const [markerVan, setMarkerVan] = useState<L.Marker | null>(null);

  // Puntos clave de la ruta Ibarra a Quito
  const HITOS_RUTA = [
    { nombre: 'Ibarra (Partida)', lat: -0.3472, lng: -78.1189, km: 0 },
    { nombre: 'San Antonio de Ibarra', lat: -0.3245, lng: -78.1630, km: 8 },
    { nombre: 'Atuntaqui', lat: -0.3320, lng: -78.2140, km: 14 },
    { nombre: 'Otavalo (Redondel)', lat: -0.2350, lng: -78.2610, km: 25 },
    { nombre: 'Cajas (Peaje)', lat: -0.1520, lng: -78.2430, km: 42 },
    { nombre: 'Tabacundo', lat: -0.0450, lng: -78.2150, km: 58 },
    { nombre: 'Guayllabamba', lat: -0.0580, lng: -78.3420, km: 82 },
    { nombre: 'Oyacoto (Peaje Norte)', lat: -0.0810, lng: -78.4350, km: 98 },
    { nombre: 'Carcelén (Norte de Quito)', lat: -0.0986, lng: -78.4725, km: 108 },
    { nombre: 'Quito La Carolina (Destino)', lat: -0.1824, lng: -78.4845, km: 118 }
  ];

  // Leer parámetro ?guambra= en URL si existe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guambraParam = params.get('guambra');
    if (guambraParam) {
      setInputCodigo(guambraParam);
      setCodigoSeguimientoSeleccionado(guambraParam);
    }
  }, [setCodigoSeguimientoSeleccionado]);

  // Buscar la reserva actual
  const reservaActual = reservas.find((r) => r.id.toLowerCase() === inputCodigo.trim().toLowerCase()) 
    || reservas[0];

  const salidaActual = salidas.find((s) => s.id === reservaActual?.salidaId);

  // Estado del viaje de este guambra
  const [estadoGuambra, setEstadoGuambra] = useState<'viajando_bien' | 'ya_llego_bien' | 'emergencia'>('viajando_bien');
  const [indiceHito, setIndiceHito] = useState(6); // Guayllabamba por defecto
  const [novedadActual, setNovedadActual] = useState<string | null>(null);

  const hitoActual = HITOS_RUTA[indiceHito] || HITOS_RUTA[6];

  // Inicializar mapa de seguimiento
  useEffect(() => {
    const contenedor = document.getElementById('mapa-guambra-live');
    if (!contenedor) return;

    if (mapaInstancia) {
      mapaInstancia.remove();
    }

    const mapa = L.map(contenedor, {
      center: [hitoActual.lat, hitoActual.lng],
      zoom: 10,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapa);

    // Línea de la Panamericana Ibarra ➔ Quito
    const puntosRuta: [number, number][] = HITOS_RUTA.map((h) => [h.lat, h.lng]);
    L.polyline(puntosRuta, {
      color: '#10B981',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8'
    }).addTo(mapa);

    // Marcador Ibarra
    L.circleMarker([-0.3472, -78.1189], {
      radius: 7,
      fillColor: '#10B981',
      color: '#ffffff',
      weight: 3,
      fillOpacity: 1
    }).bindPopup('<b>Partida:</b> Ibarra').addTo(mapa);

    // Marcador Quito
    L.circleMarker([-0.1824, -78.4845], {
      radius: 8,
      fillColor: '#0f172a',
      color: '#ffffff',
      weight: 3,
      fillOpacity: 1
    }).bindPopup('<b>Destino:</b> Quito').addTo(mapa);

    // Marcador de la Van en Tiempo Real
    const iconoVan = L.divIcon({
      className: 'custom-van-marker',
      html: `
        <div style="background-color: ${estadoGuambra === 'emergencia' ? '#ef4444' : '#10b981'}; width: 34px; height: 34px; border-radius: 9999px; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.3); animation: pulse 2s infinite;">
          <span style="font-size: 16px;">🚐</span>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marker = L.marker([hitoActual.lat, hitoActual.lng], { icon: iconoVan })
      .bindPopup(`<b>Van Chiva en Vivo:</b><br/>Ubicación: ${hitoActual.nombre}`)
      .addTo(mapa);

    setMarkerVan(marker);
    setMapaInstancia(mapa);

    return () => {
      mapa.remove();
    };
  }, [indiceHito, estadoGuambra]);

  const handleCopiarEnlace = () => {
    const urlSeguimiento = `${window.location.origin}${window.location.pathname}?guambra=${reservaActual?.id || inputCodigo}`;
    navigator.clipboard.writeText(urlSeguimiento);
    setCopiadoLink(true);
    setTimeout(() => setCopiadoLink(false), 2500);
    enviarNotificacion('🔗 Enlace copiado', 'Comparte este enlace para que tu ser querido rastree tu trayecto en vivo.', 'info');
  };

  const handleCompartirWhatsApp = () => {
    const urlSeguimiento = `${window.location.origin}${window.location.pathname}?guambra=${reservaActual?.id || inputCodigo}`;
    const texto = encodeURIComponent(
      `¡Hola familia! Sigan en vivo mi viaje en Chiva de Ibarra a Quito en la sección "¿Cómo estás mi guambra?":\nCódigo: ${reservaActual?.id || inputCodigo}\nEnlace: ${urlSeguimiento}`
    );
    window.open(`https://wa.me/?text=${texto}`, '_blank');
  };

  const simularAvanzarUbicacion = () => {
    if (indiceHito < HITOS_RUTA.length - 1) {
      const nuevoIndice = indiceHito + 1;
      setIndiceHito(nuevoIndice);
      const siguientePunto = HITOS_RUTA[nuevoIndice];

      if (nuevoIndice === HITOS_RUTA.length - 1) {
        setEstadoGuambra('ya_llego_bien');
        enviarNotificacion(
          '🎉 ¡Ya llegó mi guambra, todo bien!',
          `${reservaActual?.pasajeroNombre || 'Tu ser querido'} acaba de llegar a su destino en Quito sano y salvo.`,
          'reserva'
        );
      } else {
        enviarNotificacion(
          '🟢 Aún sigue viajando todo bien',
          `La van va por ${siguientePunto.nombre} a buen paso. Llegada estimada: ${salidaActual?.horaLlegadaEstimada || '11:15'}.`,
          'info'
        );
      }
    }
  };

  const handleEnviarEmergencia = (e: React.FormEvent) => {
    e.preventDefault();
    setEstadoGuambra('emergencia');
    const labels: Record<TipoEmergencia, string> = {
      se_danio: 'Se dañó la van (Falla mecánica / neumático)',
      seguridad: 'Alerta de seguridad en la Panamericana',
      accidente: 'Accidente o choque en la vía',
      bloqueo_via: 'Paso cerrado / Deslave en la ruta',
      ninguna: 'Sin novedad'
    };
    const textoNovedad = descripcionEmergencia || labels[tipoEmergenciaSeleccionada];
    setNovedadActual(textoNovedad);
    setMostrarModalEmergencia(false);

    // Enviar alerta push
    enviarNotificacion(
      `🚨 ALERTA: ${labels[tipoEmergenciaSeleccionada]}`,
      `Novedad en el viaje ${reservaActual?.id}: ${textoNovedad} a la altura de ${hitoActual.nombre}.`,
      'chofer'
    );

    reportarEmergencia(reservaActual?.id || inputCodigo, tipoEmergenciaSeleccionada, textoNovedad);
  };

  const handleResolverEmergencia = () => {
    setEstadoGuambra('viajando_bien');
    setNovedadActual(null);
    enviarNotificacion(
      '✅ Novedad Superada',
      'El percance en ruta ha sido solucionado. La van retoma la marcha hacia Quito.',
      'info'
    );
  };

  return (
    <div className="h-full flex flex-col min-h-0 bg-slate-100 select-none overflow-y-auto p-3 sm:p-5 max-w-6xl w-full mx-auto animate-fadeIn">
      {/* 1. Cabecera Emotiva Ecuatoriana */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl mb-3.5 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-emerald-400 fill-emerald-400/40 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1 border border-emerald-400/40">
                <Navigation className="w-3 h-3 text-emerald-300" />
                Seguimiento en Vivo Familiar
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                ¿Cómo estás mi guambra?
              </h1>
              <p className="text-xs text-slate-300">
                Tranquilidad para la familia: sigue la van en tiempo real y recibe novedades al instante.
              </p>
            </div>
          </div>

          {/* Buscador de Código / Enlace */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 self-stretch sm:self-auto">
            <input
              type="text"
              placeholder="Código: ej. CHIVA-8821"
              value={inputCodigo}
              onChange={(e) => setInputCodigo(e.target.value.toUpperCase())}
              className="px-3 py-1.5 text-xs bg-white text-slate-900 rounded-xl font-mono font-black focus:outline-none w-full sm:w-36"
            />
            <button
              type="button"
              onClick={() => setCodigoSeguimientoSeleccionado(inputCodigo)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs shrink-0"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* 2. Banner de Estado del Guambra (Notificación visual en tiempo real) */}
      <div className="mb-3.5 shrink-0">
        {estadoGuambra === 'emergencia' ? (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-500 text-white shadow-lg border-2 border-rose-300 flex items-center justify-between gap-3 animate-bounceOnce">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-rose-200 block">
                  Novedad de Emergencia Reportada
                </span>
                <h4 className="text-sm font-black">
                  {novedadActual || 'Incidente en ruta Panamericana'}
                </h4>
                <p className="text-xs text-rose-100">
                  Ubicación actual: <strong>{hitoActual.nombre}</strong> • Chofer coordinando asistencia.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResolverEmergencia}
              className="px-3 py-1.5 bg-white text-rose-700 hover:bg-rose-50 font-black text-xs rounded-xl shadow-xs shrink-0"
            >
              Marcar Resuelto
            </button>
          </div>
        ) : estadoGuambra === 'ya_llego_bien' ? (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-600 text-white shadow-lg border-2 border-emerald-400 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-200 block">
                  Notificación Oficial
                </span>
                <h4 className="text-sm sm:text-base font-black">
                  "¡Ya llegó mi guambra, todo bien!"
                </h4>
                <p className="text-xs text-emerald-100">
                  Arribó a salvo a su destino final en Quito. ¡Buen viaje cumplido!
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-xl shrink-0">
              Completado 🏁
            </span>
          </div>
        ) : (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/15 text-emerald-950 border-2 border-emerald-500/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-700 block">
                  Notificación Oficial en Vivo
                </span>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  "Aún sigue viajando todo bien mi guambra"
                </h4>
                <p className="text-xs text-slate-600">
                  Sector: <strong>{hitoActual.nombre}</strong> • Aprox. {HITOS_RUTA.length - 1 - indiceHito} paradas para llegar a Quito.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={simularAvanzarUbicacion}
                title="Avanzar van en ruta"
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1"
              >
                <span>Avanzar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Cuadrícula Principal: Mapa en Vivo + Panel de Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[380px]">
        {/* Columna Izquierda: Mapa de la Panamericana en Vivo (7/12) */}
        <div className="lg:col-span-7 h-72 sm:h-96 lg:h-full bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden relative flex flex-col">
          <div id="mapa-guambra-live" className="w-full h-full z-0" />

          {/* Tarjeta Flotante en el Mapa */}
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 shadow-md max-w-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-black uppercase text-slate-700">
                Monitoreo Panamericana E35
              </span>
            </div>
            <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
              {hitoActual.nombre} (~{hitoActual.km} km recorridos)
            </p>
          </div>

          {/* Barra de Progreso Inferior */}
          <div className="absolute bottom-3 left-3 right-3 z-10 bg-slate-900/90 backdrop-blur-md text-white p-2.5 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400">Ibarra</span>
            <div className="flex-1 mx-3 bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round(((indiceHito + 1) / HITOS_RUTA.length) * 100)}%` }}
              />
            </div>
            <span className="font-bold text-emerald-400">Quito</span>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta del Viaje, Contacto y Botón de Emergencia (5/12) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {/* Ficha del Viajero */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Boleto Digital</span>
                <span className="text-xs font-mono font-black text-slate-900">{reservaActual?.id || 'CHIVA-8821'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopiarEnlace}
                  title="Copiar enlace de seguimiento"
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  {copiadoLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiadoLink ? 'Copiado' : 'Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompartirWhatsApp}
                  title="Enviar por WhatsApp a la familia"
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Pasajero en el viaje:</span>
                <p className="font-black text-slate-900 text-sm">{reservaActual?.pasajeroNombre || 'Mateo Cárdenas'}</p>
                <p className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {reservaActual?.pasajeroTelefono || '+593 99 841 2901'}
                </p>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Recogida y Destino:</span>
                <p className="text-slate-700 truncate">
                  <strong className="text-emerald-700">Sube:</strong> {reservaActual?.puntoPartidaPersonalizado || 'Ibarra'}
                </p>
                <p className="text-slate-700 truncate">
                  <strong className="text-slate-900">Baja:</strong> {reservaActual?.puntoLlegadaPersonalizado || 'Quito'}
                </p>
              </div>

              {salidaActual && (
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Conductor</span>
                    <span className="font-bold text-slate-800">{salidaActual.conductor.nombre}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Vehículo</span>
                    <span className="font-bold text-slate-800">{salidaActual.conductor.placa}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOTÓN DE EMERGENCIA REQUERIDO (Se dañó, seguridad, accidente) */}
          <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-rose-900 uppercase tracking-wide">
                  Botón de Emergencia / SOS
                </h4>
                <p className="text-[10px] text-rose-700 leading-tight">
                  ¿Se dañó la van, hubo un accidente o tema de seguridad? Notifica de inmediato a tu ser querido.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMostrarModalEmergencia(true)}
              className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-rose-600/25 flex items-center justify-center gap-1.5 transition-all"
            >
              <Siren className="w-4 h-4 animate-bounce" />
              <span>Reportar Emergencia en Ruta</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE REPORTE DE EMERGENCIA */}
      {mostrarModalEmergencia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs select-none animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Reportar Emergencia en Ruta</h3>
                  <span className="text-[10px] text-slate-400">Se enviará la novedad inmediata al ser querido</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMostrarModalEmergencia(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnviarEmergencia} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Tipo de Novedad:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setTipoEmergenciaSeleccionada('se_danio')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      tipoEmergenciaSeleccionada === 'se_danio'
                        ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-2 ring-rose-400'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Se dañó la van</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipoEmergenciaSeleccionada('seguridad')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      tipoEmergenciaSeleccionada === 'seguridad'
                        ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-2 ring-rose-400'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Seguridad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipoEmergenciaSeleccionada('accidente')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      tipoEmergenciaSeleccionada === 'accidente'
                        ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-2 ring-rose-400'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Accidente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipoEmergenciaSeleccionada('bloqueo_via')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      tipoEmergenciaSeleccionada === 'bloqueo_via'
                        ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-2 ring-rose-400'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Car className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>Paso Cerrado</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                  Descripción del percance:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ej. Llanta baja a la altura de Guayllabamba, estamos cambiando la rueda, todo tranquilo."
                  value={descripcionEmergencia}
                  onChange={(e) => setDescripcionEmergencia(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMostrarModalEmergencia(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-rose-600/20"
                >
                  Emitir Alerta SOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
