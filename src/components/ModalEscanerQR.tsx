import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { Reserva } from '../types';
import { 
  QrCode, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  User, 
  Phone, 
  Car, 
  CreditCard, 
  Banknote,
  Search,
  Check
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalEscanerQR: React.FC<Props> = ({ isOpen, onClose }) => {
  const { reservas, marcarComoPagada, enviarNotificacion } = useTransport();

  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [reservaEscaneada, setReservaEscaneada] = useState<Reserva | null>(null);
  const [errorScan, setErrorScan] = useState<string | null>(null);
  const [abordajeExitoso, setAbordajeExitoso] = useState(false);

  if (!isOpen) return null;

  const procesarCodigo = (codigo: string) => {
    setErrorScan(null);
    setAbordajeExitoso(false);
    const codigoLimpio = codigo.trim().toUpperCase();

    const encontrada = reservas.find((r) => r.id.toUpperCase() === codigoLimpio);

    if (encontrada) {
      setReservaEscaneada(encontrada);
    } else {
      setErrorScan(`No se encontró ningún boleto válido con el código ${codigoLimpio}.`);
      setReservaEscaneada(null);
    }
  };

  const handleConfirmarAbordaje = () => {
    if (!reservaEscaneada) return;

    marcarComoPagada(reservaEscaneada.id, 'pagado');
    setAbordajeExitoso(true);

    enviarNotificacion(
      '✅ Abordaje Confirmado por el Conductor',
      `El pasajero ${reservaEscaneada.pasajeroNombre} ha abordado con éxito en los asientos [${reservaEscaneada.asientos.join(', ')}].`,
      'chofer'
    );

    setTimeout(() => {
      setReservaEscaneada(null);
      setAbordajeExitoso(false);
      setCodigoIngresado('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs select-none animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Escáner de Boletos QR</h3>
              <p className="text-[10px] text-slate-500">Valida los pases de abordaje de los pasajeros</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visor de Cámara Simulado */}
        <div className="relative w-full h-44 bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/60 p-4 mb-3">
          {/* Línea Láser animada de Escáner */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500 shadow-lg shadow-emerald-400 animate-pulse" />
          
          <div className="w-28 h-28 border-2 border-emerald-400 rounded-2xl flex items-center justify-center relative bg-emerald-500/10">
            <Camera className="w-8 h-8 text-emerald-400 opacity-80" />
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-300" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-300" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-300" />
          </div>

          <span className="text-[10px] font-mono font-bold text-emerald-400 mt-2">
            Apunta la cámara al código QR del pasajero
          </span>
        </div>

        {/* Input manual de código o selector rápido */}
        <div className="space-y-2 mb-3">
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
            O escribe / selecciona el código QR:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ej. CHIVA-8821"
              value={codigoIngresado}
              onChange={(e) => setCodigoIngresado(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-black"
            />
            <button
              type="button"
              onClick={() => procesarCodigo(codigoIngresado)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-xs"
            >
              Escanear
            </button>
          </div>

          {/* Accesos rápidos de prueba para el chofer */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-slate-400 font-bold">Probar con:</span>
            {reservas.slice(0, 3).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setCodigoIngresado(r.id);
                  procesarCodigo(r.id);
                }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black bg-slate-100 hover:bg-emerald-100 text-slate-700 border border-slate-200"
              >
                {r.id}
              </button>
            ))}
          </div>
        </div>

        {errorScan && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorScan}</span>
          </div>
        )}

        {/* Resultado del Escaneo */}
        {reservaEscaneada && (
          <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-2 animate-scaleUp">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-emerald-900">
                {reservaEscaneada.id}
              </span>
              <span className="px-2 py-0.5 bg-emerald-600 text-white font-black text-[10px] rounded-full uppercase">
                Válido para abordar
              </span>
            </div>

            <div className="text-xs space-y-1 text-slate-800">
              <p>
                <strong>Pasajero:</strong> {reservaEscaneada.pasajeroNombre} ({reservaEscaneada.pasajeroTelefono})
              </p>
              <p>
                <strong>Asientos:</strong> [#{reservaEscaneada.asientos.join(', #')}] • <strong>Monto:</strong> ${reservaEscaneada.total} USD ({reservaEscaneada.metodoPago})
              </p>
              <p className="truncate text-slate-600 text-[11px]">
                <strong>Subida:</strong> {reservaEscaneada.puntoPartidaPersonalizado}
              </p>
            </div>

            {abordajeExitoso ? (
              <div className="py-2 text-center text-xs font-black text-emerald-800 bg-emerald-200/80 rounded-xl flex items-center justify-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>¡Pasajero Validado y Abordado!</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirmarAbordaje}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirmar Abordaje & Marcar Pagado</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
