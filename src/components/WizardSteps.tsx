import React from 'react';
import { useTransport } from '../context/TransportContext';
import { MapPin, Armchair, CreditCard, CheckCircle2 } from 'lucide-react';

export const WizardSteps: React.FC = () => {
  const { bookingStep, setBookingStep, selectedAsientos, selectedSalida } = useTransport();

  const pasos = [
    { id: 1, title: '1. Ubicación', sub: 'Ibarra ➔ Quito', icon: MapPin },
    { id: 2, title: '2. Asientos', sub: 'Van Ejecutiva', icon: Armchair },
    { id: 3, title: '3. Pago', sub: 'Payphone, Efectivo, etc.', icon: CreditCard },
    { id: 4, title: '4. Boleto', sub: 'Ruta & Pase Digital', icon: CheckCircle2 }
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200 px-3 sm:px-6 py-2 shadow-2xs shrink-0 select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {pasos.map((paso) => {
          const Icon = paso.icon;
          const isCurrent = bookingStep === paso.id;
          const isCompleted = bookingStep > paso.id;

          const canNavigate = 
            paso.id < bookingStep || 
            (paso.id === 2 && !!selectedSalida) || 
            (paso.id === 3 && selectedAsientos.length > 0) ||
            (paso.id === 4 && bookingStep === 4);

          return (
            <button
              key={paso.id}
              type="button"
              disabled={!canNavigate && paso.id > bookingStep}
              onClick={() => {
                if (canNavigate) setBookingStep(paso.id as 1 | 2 | 3 | 4);
              }}
              className={`flex-1 flex items-center justify-center sm:justify-start gap-2 py-1 px-2.5 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                  : isCompleted
                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer font-bold'
                  : 'text-slate-400 bg-slate-50 cursor-not-allowed opacity-60'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0 ${
                  isCurrent
                    ? 'bg-slate-950/15 text-slate-950 font-black'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
              </div>

              <div className="text-left hidden md:block truncate">
                <span className="text-[11px] font-black leading-none block">
                  {paso.title}
                </span>
                <span className={`text-[10px] truncate block ${isCurrent ? 'text-slate-900/80' : 'text-slate-400'}`}>
                  {paso.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
