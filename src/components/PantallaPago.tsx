import React, { useState, useEffect } from 'react';
import { useTransport } from '../context/TransportContext';
import { MetodoPago } from '../types';
import { DATOS_TRANSFERENCIA } from '../data/mockData';
import { SelectorRefrigerio } from './SelectorRefrigerio';
import { 
  CreditCard, 
  Banknote, 
  Building2, 
  Smartphone, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Copy, 
  User, 
  Phone, 
  Mail, 
  Coins,
  Sparkles,
  Gift
} from 'lucide-react';

export const PantallaPago: React.FC = () => {
  const { 
    selectedSalida, 
    selectedAsientos, 
    puntoPartida, 
    direccionPartidaManual, 
    puntoLlegada, 
    direccionLlegadaManual, 
    crearReserva, 
    retrocederPaso,
    usuarioActual,
    refrigerio
  } = useTransport();

  const [nombre, setNombre] = useState(usuarioActual?.nombre || '');
  const [telefono, setTelefono] = useState(usuarioActual?.telefono || '');
  const [email, setEmail] = useState('');
  const [notas, setNotas] = useState('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('tarjeta');

  const [tarjetaNumero, setTarjetaNumero] = useState('');
  const [tarjetaExpira, setTarjetaExpira] = useState('');
  const [tarjetaCvv, setTarjetaCvv] = useState('');
  const [payphoneTelefono, setPayphoneTelefono] = useState(usuarioActual?.telefono?.replace('+593', '0') || '');
  const [paypalEmail, setPaypalEmail] = useState('');

  const [copiado, setCopiado] = useState(false);
  const [errores, setErrores] = useState<{ nombre?: string; telefono?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (usuarioActual) {
      if (!nombre) setNombre(usuarioActual.nombre);
      if (!telefono && usuarioActual.telefono) setTelefono(usuarioActual.telefono);
    }
  }, [usuarioActual]);

  if (!selectedSalida) return null;

  const subtotal = selectedAsientos.length * selectedSalida.precio;
  const descuentoPorcentaje = usuarioActual?.descuentoNivel || 0;
  let total = Math.round(subtotal * (1 - descuentoPorcentaje / 100));

  // Añadir refrigerio de $1 si está activado
  if (refrigerio.activo) {
    total += refrigerio.precio;
  }

  const partidaFinal = puntoPartida.includes('domicilio') && direccionPartidaManual
    ? `Ibarra: ${direccionPartidaManual}`
    : `Ibarra: ${puntoPartida}`;

  const llegadaFinal = (puntoLlegada.includes('domicilio') || puntoLlegada.includes('personalizado')) && direccionLlegadaManual
    ? `Quito: ${direccionLlegadaManual}`
    : `Quito: ${puntoLlegada}`;

  const handleCopiarDatos = () => {
    navigator.clipboard.writeText(DATOS_TRANSFERENCIA.clabeOalias);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const validarFormulario = () => {
    const nuevosErrores: { nombre?: string; telefono?: string } = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = 'Ingresa el nombre del pasajero';
    } else if (nombre.trim().length < 3) {
      nuevosErrores.nombre = 'Ingresa nombre y apellido';
    }

    if (!telefono.trim()) {
      nuevosErrores.telefono = 'Ingresa tu número celular';
    } else if (telefono.trim().length < 8) {
      nuevosErrores.telefono = 'Teléfono no válido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleConfirmar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setIsSubmitting(true);
    try {
      const detallesPago: {
        numeroTarjetaOculto?: string;
        cuentaPayphone?: string;
        cuentaPaypal?: string;
      } = {};

      if (metodoPago === 'tarjeta') {
        const ultimos4 = tarjetaNumero.replace(/\s/g, '').slice(-4) || '8842';
        detallesPago.numeroTarjetaOculto = `•••• ${ultimos4}`;
      } else if (metodoPago === 'payphone') {
        detallesPago.cuentaPayphone = payphoneTelefono || telefono;
      } else if (metodoPago === 'paypal') {
        detallesPago.cuentaPaypal = paypalEmail || email || 'usuario@paypal.com';
      }

      crearReserva({
        pasajeroNombre: nombre,
        pasajeroTelefono: telefono,
        pasajeroEmail: email || undefined,
        puntoPartidaPersonalizado: partidaFinal,
        puntoLlegadaPersonalizado: llegadaFinal,
        metodoPago,
        detallesPago,
        notas: notas.trim() || undefined
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleConfirmar} 
      className="w-full h-full flex flex-col justify-between bg-white rounded-3xl border border-slate-200/90 p-3 sm:p-5 shadow-xs min-h-0 select-none overflow-hidden"
    >
      {/* Cabecera con Letrero Ecuatoriano: Dárame suelticos vea */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5 shrink-0">
        <div>
          {/* LETRERO JOCOSO ECUATORIANO DESALINEADO Y ULTRA VISIBLE (Requerido) */}
          <div className="transform -rotate-2 hover:rotate-0 transition-transform duration-300 bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-xl border-3 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] inline-flex items-center gap-2 mb-1">
            <Coins className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span className="font-black text-xs sm:text-sm uppercase tracking-tight">"¡Dárame suelticos vea!"</span>
          </div>

          <h2 className="text-xs sm:text-sm font-extrabold text-slate-800">
            Paso Final: Datos del Pasajero y Forma de Pago
          </h2>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 block">Total a pagar:</span>
          <span className="text-base sm:text-lg font-black text-emerald-700">
            ${total} USD ({selectedAsientos.length} asientos)
          </span>
          <div className="flex items-center justify-end gap-1 flex-wrap mt-0.5">
            {refrigerio.activo && (
              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full inline-block border border-amber-300">
                Refrigerio: +$1
              </span>
            )}
            {descuentoPorcentaje > 0 && (
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full inline-block border border-emerald-300">
                Nivel {usuarioActual?.nivel}: -{descuentoPorcentaje}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cuerpo en dos columnas sin scroll general */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4 py-2 overflow-y-auto">
        {/* Columna Izquierda: Datos del Pasajero & Refrigerio */}
        <div className="space-y-2.5">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
              1. Datos para Coordinar Abordaje:
            </span>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                Nombre Completo *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Carlos Proaño"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    if (errores.nombre) setErrores((prev) => ({ ...prev, nombre: undefined }));
                  }}
                  className={`w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border rounded-xl font-bold ${
                    errores.nombre ? 'border-rose-400' : 'border-slate-300'
                  }`}
                />
              </div>
              {errores.nombre && <p className="text-[10px] text-rose-600 mt-0.5">{errores.nombre}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                Teléfono Celular (WhatsApp) *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="Ej. 099 841 2901"
                  value={telefono}
                  onChange={(e) => {
                    setTelefono(e.target.value);
                    if (errores.telefono) setErrores((prev) => ({ ...prev, telefono: undefined }));
                  }}
                  className={`w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border rounded-xl font-bold ${
                    errores.telefono ? 'border-rose-400' : 'border-slate-300'
                  }`}
                />
              </div>
              {errores.telefono && <p className="text-[10px] text-rose-600 mt-0.5">{errores.telefono}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Correo Electrónico (Para recibir boleto)
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="tu-correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Indicaciones de abordaje (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Llevo 1 maleta grande o viajo con menor"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* Componente Refrigerio a Bordo ($1 USD) con botones sin texto */}
          <SelectorRefrigerio />
        </div>

        {/* Columna Derecha: Métodos de Pago con Verde Chiva */}
        <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block mb-1.5">
              2. Método de Pago:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {/* Tarjeta */}
              <button
                type="button"
                onClick={() => setMetodoPago('tarjeta')}
                className={`p-2 rounded-xl border text-left transition-all ${
                  metodoPago === 'tarjeta'
                    ? 'bg-emerald-500 text-slate-950 font-black border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span className="text-xs">Tarjeta</span>
                </div>
              </button>

              {/* Payphone */}
              <button
                type="button"
                onClick={() => setMetodoPago('payphone')}
                className={`p-2 rounded-xl border text-left transition-all ${
                  metodoPago === 'payphone'
                    ? 'bg-orange-500 text-white font-black border-orange-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="text-xs">Payphone</span>
                </div>
              </button>

              {/* PayPal */}
              <button
                type="button"
                onClick={() => setMetodoPago('paypal')}
                className={`p-2 rounded-xl border text-left transition-all ${
                  metodoPago === 'paypal'
                    ? 'bg-sky-600 text-white font-black border-sky-700 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs">PP</span>
                  <span className="text-xs">PayPal</span>
                </div>
              </button>

              {/* Efectivo */}
              <button
                type="button"
                onClick={() => setMetodoPago('efectivo')}
                className={`p-2 rounded-xl border text-left transition-all ${
                  metodoPago === 'efectivo'
                    ? 'bg-emerald-600 text-white font-black border-emerald-700 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5" />
                  <span className="text-xs">Efectivo</span>
                </div>
              </button>

              {/* Transferencia */}
              <button
                type="button"
                onClick={() => setMetodoPago('transferencia')}
                className={`p-2 rounded-xl border text-left transition-all col-span-2 sm:col-span-1 ${
                  metodoPago === 'transferencia'
                    ? 'bg-slate-900 text-white font-black border-slate-950 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="text-xs truncate">DeUna / Banco</span>
                </div>
              </button>
            </div>

            {/* Detalle del método */}
            <div className="mt-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
              {metodoPago === 'tarjeta' && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-700 block uppercase">Tarjeta Crédito / Débito:</span>
                  <input
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    value={tarjetaNumero}
                    onChange={(e) => setTarjetaNumero(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono border border-slate-300 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={tarjetaExpira}
                      onChange={(e) => setTarjetaExpira(e.target.value)}
                      className="w-full px-2 py-1 text-xs text-center border border-slate-300 rounded-lg font-mono"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      value={tarjetaCvv}
                      onChange={(e) => setTarjetaCvv(e.target.value)}
                      className="w-full px-2 py-1 text-xs text-center border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
              )}

              {metodoPago === 'payphone' && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-orange-600 block uppercase">Payphone Ecuador:</span>
                  <input
                    type="tel"
                    placeholder="0998410921"
                    value={payphoneTelefono}
                    onChange={(e) => setPayphoneTelefono(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono border border-slate-300 rounded-lg font-bold"
                  />
                  <p className="text-[10px] text-slate-500">Cobro directo por ${total} USD a tu app Payphone.</p>
                </div>
              )}

              {metodoPago === 'paypal' && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-sky-700 block uppercase">Cuenta PayPal:</span>
                  <input
                    type="email"
                    placeholder="usuario@paypal.com"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                  <p className="text-[10px] text-slate-500">Débito seguro internacional por ${total} USD.</p>
                </div>
              )}

              {metodoPago === 'efectivo' && (
                <div className="space-y-0.5 text-slate-600 text-[11px]">
                  <p className="font-bold text-slate-800">"Dárame suelticos vea"</p>
                  <p>Pagas <strong>${total} USD</strong> en efectivo directamente a {selectedSalida.conductor.nombre} al abordar.</p>
                </div>
              )}

              {metodoPago === 'transferencia' && (
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{DATOS_TRANSFERENCIA.banco}</span>
                    <button
                      type="button"
                      onClick={handleCopiarDatos}
                      className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200"
                    >
                      {copiado ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                  <p><strong>Cta:</strong> {DATOS_TRANSFERENCIA.numeroCuenta}</p>
                  <p><strong>DeUna:</strong> {DATOS_TRANSFERENCIA.clabeOalias}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navegación sin la palabra slide */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={retrocederPaso}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Atrás</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-slate-950 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-500/25 transition-all"
        >
          <span>{isSubmitting ? 'Confirmando...' : `Confirmar Reserva ($${total} USD)`}</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </form>
  );
};
