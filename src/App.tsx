import React, { useEffect } from 'react';
import { TransportProvider, useTransport } from './context/TransportContext';
import { Header } from './components/Header';
import { WizardSteps } from './components/WizardSteps';
import { PantallaRuta } from './components/PantallaRuta';
import { PantallaAsientos } from './components/PantallaAsientos';
import { PantallaPago } from './components/PantallaPago';
import { PantallaConfirmacion } from './components/PantallaConfirmacion';
import { PanelAdmin } from './components/PanelAdmin';
import { PantallaLogin } from './components/PantallaLogin';
import { HistorialViajes } from './components/HistorialViajes';
import { ComoEstasMiGuambra } from './components/ComoEstasMiGuambra';
import { NotificacionesPush } from './components/NotificacionesPush';
import { BottomNav } from './components/BottomNav';
import { ModalEmergenciaGlobal } from './components/ModalEmergenciaGlobal';
import { PantallaCelebracionVerde } from './components/PantallaCelebracionVerde';
import { ModalValoracionViaje } from './components/ModalValoracionViaje';
import { PantallaPerfilUsuario } from './components/PantallaPerfilUsuario';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SlideDeckFlow: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab,
    bookingStep, 
    setBookingStep, 
    avanzarPaso, 
    retrocederPaso, 
    selectedSalida, 
    selectedAsientos,
    reservaParaValorar,
    setReservaParaValorar,
    usuarioActual
  } = useTransport();

  // Si la URL contiene el parámetro ?guambra=, ir directo a la sección de seguimiento
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('guambra')) {
      setActiveTab('guambra');
    }
  }, [setActiveTab]);

  // Soporte de navegación con teclas de flecha
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evitar cambio si el usuario está escribiendo en un input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' && bookingStep < 4) {
        if (bookingStep === 1 && !selectedSalida) return;
        if (bookingStep === 2 && selectedAsientos.length === 0) return;
        avanzarPaso();
      } else if (e.key === 'ArrowLeft' && bookingStep > 1) {
        retrocederPaso();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bookingStep, selectedSalida, selectedAsientos, avanzarPaso, retrocederPaso]);

  // Invalidate map size on step change for perfect tile rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 150);
    return () => clearTimeout(timer);
  }, [bookingStep]);

  // Títulos de cada paso (sin usar la palabra slide)
  const titulosPantallas = [
    '1. Ubicación de Recogida & Destino',
    '2. Asientos en la Van Ejecutiva',
    '3. Contacto & Forma de Pago',
    '4. Boleto Digital & Ruta en Vivo'
  ];

  const canGoNext = 
    (bookingStep === 1 && !!selectedSalida) || 
    (bookingStep === 2 && selectedAsientos.length > 0) || 
    (bookingStep === 3);

  return (
    <div className="h-screen h-[100dvh] max-h-screen overflow-hidden flex flex-col bg-slate-100 text-slate-800 font-sans select-none">
      {/* Notificaciones Push Flotantes */}
      <NotificacionesPush />

      {/* Modales globales de Autenticación, Emergencia y Celebración Verde (Ruleta Eliminada) */}
      <PantallaLogin />
      <ModalEmergenciaGlobal />
      <PantallaCelebracionVerde />

      {/* Modal de Valoración del Viaje y Conductor (Aparece al finalizar trayecto) */}
      {reservaParaValorar && (
        <ModalValoracionViaje
          isOpen={true}
          reserva={reservaParaValorar}
          conductorNombre={selectedSalida?.conductor.nombre || 'Marco Baez'}
          conductorVehiculo={selectedSalida?.conductor.vehiculo || 'Mercedes Sprinter Ejecutiva'}
          conductorPlaca={selectedSalida?.conductor.placa || 'IBC-4821'}
          onClose={() => setReservaParaValorar(null)}
        />
      )}

      {/* 1. Barra Superior Fija (Header) con Foto de Perfil y Estrellas */}
      <Header />

      {activeTab === 'pasajero' ? (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden pb-16 sm:pb-18">
          {/* 2. Barra de Pasos Fija */}
          <WizardSteps />

          {/* 3. Escenario Fijo (Sin scroll vertical en pantalla, deslizamiento lateral) */}
          <div className="flex-1 min-h-0 relative overflow-hidden p-2 sm:p-3">
            <div
              className="w-[400%] h-full flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${(bookingStep - 1) * 25}%)`
              }}
            >
              {/* PANTALLA 1: MAPA DE UBICACIÓN & HORARIO */}
              <div className="w-[25%] h-full px-1 min-h-0">
                <PantallaRuta />
              </div>

              {/* PANTALLA 2: SELECCIÓN DE ASIENTOS */}
              <div className="w-[25%] h-full px-1 min-h-0">
                <PantallaAsientos />
              </div>

              {/* PANTALLA 3: DATOS Y PAGO */}
              <div className="w-[25%] h-full px-1 min-h-0">
                <PantallaPago />
              </div>

              {/* PANTALLA 4: CONFIRMACIÓN Y MAPA FINAL */}
              <div className="w-[25%] h-full px-1 min-h-0">
                <PantallaConfirmacion />
              </div>
            </div>
          </div>

          {/* 4. Dock Inferior Fijo de Navegación (Sin la palabra slide) */}
          <div className="h-12 bg-white border-t border-slate-200 px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
            {/* Botón Atrás */}
            <button
              type="button"
              disabled={bookingStep === 1}
              onClick={retrocederPaso}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                bookingStep === 1
                  ? 'text-slate-300 cursor-not-allowed opacity-50'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Atrás</span>
            </button>

            {/* Indicador de Paso Actual */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider hidden md:inline">
                {titulosPantallas[bookingStep - 1]}
              </span>

              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => {
                      if (step < bookingStep || (step === 2 && !!selectedSalida) || (step === 3 && selectedAsientos.length > 0)) {
                        setBookingStep(step as 1 | 2 | 3 | 4);
                      }
                    }}
                    title={`Paso ${step}`}
                    className={`h-2.5 rounded-full transition-all ${
                      bookingStep === step
                        ? 'w-8 bg-emerald-500'
                        : step < bookingStep
                        ? 'w-2.5 bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                        : 'w-2.5 bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs font-bold text-slate-500">
                {bookingStep}/4
              </span>
            </div>

            {/* Botón Siguiente / Acción */}
            {bookingStep < 4 ? (
              <button
                type="button"
                disabled={!canGoNext}
                onClick={avanzarPaso}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black transition-all shadow-xs ${
                  !canGoNext
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/25 active:scale-95'
                }`}
              >
                <span>{bookingStep === 3 ? 'Confirmar Reserva' : 'Continuar'}</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : (
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Boleto Confirmado</span>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'historial' ? (
        /* Pestaña: Historial de Viajes Anteriores */
        <div className="flex-1 min-h-0 overflow-y-auto pb-24">
          <HistorialViajes />
        </div>
      ) : activeTab === 'guambra' ? (
        /* Pestaña: ¿Cómo estás mi guambra? - Seguimiento en Tiempo Real */
        <div className="flex-1 min-h-0 overflow-y-auto pb-24">
          <ComoEstasMiGuambra />
        </div>
      ) : activeTab === 'perfil' ? (
        /* Pestaña: Perfil de Usuario con Velocímetro, Estrellas y Niveles de Lealtad */
        <div className="flex-1 min-h-0 overflow-y-auto pb-24">
          <PantallaPerfilUsuario />
        </div>
      ) : usuarioActual?.rol === 'chofer' ? (
        /* Vista de Administración Chófer (Exclusivo para choferes autorizados) */
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 pb-28 max-w-6xl w-full mx-auto">
          <PanelAdmin />
        </div>
      ) : (
        /* Pantalla de Acceso Restringido si un pasajero intenta entrar a chofer */
        <div className="flex-1 min-h-0 flex items-center justify-center p-6 text-center">
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-xl max-w-md space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl font-black">
              🚐
            </div>
            <h3 className="text-lg font-black text-slate-900">Perfil Exclusivo para Chóferes Oficiales</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              El panel de chofer solo está disponible para conductores registrados de la cooperativa Chiva. Tu cuenta actual es de <strong>Pasajero</strong>.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('pasajero')}
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              Volver a Reservar Pasajes
            </button>
          </div>
        </div>
      )}

      {/* 5. Barra / Banner Inferior de Navegación con Botón de Emergencia SOS */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <TransportProvider>
      <SlideDeckFlow />
    </TransportProvider>
  );
}
