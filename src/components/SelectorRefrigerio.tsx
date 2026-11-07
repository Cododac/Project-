import React from 'react';
import { useTransport } from '../context/TransportContext';
import { RefrigerioComida, RefrigerioBebida } from '../types';
import { 
  UtensilsCrossed, 
  Coffee, 
  CupSoda, 
  Sparkles, 
  Check, 
  Plus, 
  X,
  Cookie,
  Flame,
  Wheat,
  Sandwich
} from 'lucide-react';

export const SelectorRefrigerio: React.FC = () => {
  const { refrigerio, toggleRefrigerioActivo, seleccionarComida, seleccionarBebida } = useTransport();

  const comidas: { id: RefrigerioComida; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'sanduchito',
      label: 'Sanduchito',
      icon: <Sandwich className="w-5 h-5" />,
      color: 'hover:border-amber-400 hover:bg-amber-50'
    },
    {
      id: 'galleta dulce',
      label: 'Galleta dulce',
      icon: <Cookie className="w-5 h-5" />,
      color: 'hover:border-rose-400 hover:bg-rose-50'
    },
    {
      id: 'galleta sal',
      label: 'Galleta de sal',
      icon: <Wheat className="w-5 h-5" />,
      color: 'hover:border-yellow-400 hover:bg-yellow-50'
    },
    {
      id: 'humita',
      label: 'Humita tradicional',
      icon: <Flame className="w-5 h-5" />,
      color: 'hover:border-emerald-400 hover:bg-emerald-50'
    }
  ];

  const bebidas: { id: RefrigerioBebida; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'jugo',
      label: 'Jugo natural',
      icon: <CupSoda className="w-5 h-5" />,
      color: 'hover:border-orange-400 hover:bg-orange-50'
    },
    {
      id: 'horchata',
      label: 'Horchata lojana',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'hover:border-purple-400 hover:bg-purple-50'
    },
    {
      id: 'café',
      label: 'Café de altura',
      icon: <Coffee className="w-5 h-5" />,
      color: 'hover:border-amber-600 hover:bg-amber-50'
    }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-4 select-none transition-all">
      {/* Cabecera del Refrigerio con botón de activación sin texto */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900">Refrigerio a Bordo</span>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md border border-emerald-300">
                +$1 USD
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              {refrigerio.activo ? (
                <span className="font-semibold text-emerald-700 capitalize">
                  {refrigerio.comida} + {refrigerio.bebida}
                </span>
              ) : (
                'Elige 1 bocado y 1 bebida para tu viaje'
              )}
            </p>
          </div>
        </div>

        {/* Botón de toggle del combo SIN TEXTO (sólo icono) */}
        <button
          type="button"
          onClick={() => toggleRefrigerioActivo()}
          title={refrigerio.activo ? 'Quitar refrigerio' : 'Agregar combo refrigerio (+$1 USD)'}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            refrigerio.activo
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95'
              : 'bg-white border-2 border-dashed border-slate-300 text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50'
          }`}
        >
          {refrigerio.activo ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : (
            <Plus className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>
      </div>

      {/* Opciones de Selección: Botones 100% sin texto */}
      <div className={`space-y-3 transition-opacity duration-300 ${refrigerio.activo ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        {/* Fila 1: Comidas (sanduchito, galleta dulce, galleta sal, humita) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Bocado: <strong className="text-slate-800 capitalize">{refrigerio.comida || 'Selecciona'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {comidas.map((item) => {
              const isSelected = refrigerio.comida === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => seleccionarComida(item.id)}
                  title={`${item.label} (Clic para elegir)`}
                  className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center transition-all relative group ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500 scale-[1.03]'
                      : `bg-white text-slate-600 border border-slate-200 shadow-2xs ${item.color} active:scale-95`
                  }`}
                >
                  {/* Ícono sin texto */}
                  <div className="transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>

                  {/* Indicador de seleccionado */}
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-slate-950" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fila 2: Bebidas (jugo, horchata, café) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Bebida: <strong className="text-slate-800 capitalize">{refrigerio.bebida || 'Selecciona'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {bebidas.map((item) => {
              const isSelected = refrigerio.bebida === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => seleccionarBebida(item.id)}
                  title={`${item.label} (Clic para elegir)`}
                  className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center transition-all relative group ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500 scale-[1.03]'
                      : `bg-white text-slate-600 border border-slate-200 shadow-2xs ${item.color} active:scale-95`
                  }`}
                >
                  {/* Ícono sin texto */}
                  <div className="transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>

                  {/* Indicador de seleccionado */}
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-slate-950" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
