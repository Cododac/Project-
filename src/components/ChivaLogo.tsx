import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const ChivaLogo: React.FC<Props> = ({ size = 'md', showText = true }) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14'
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  }[size];

  return (
    <div className="flex items-center gap-2.5 group select-none">
      {/* Icono Vectorial Simplista de Chiva / Ranchera ecuatoriana */}
      <div
        className={`${iconDimensions} rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform shrink-0 relative overflow-hidden`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5 stroke-slate-950"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Parrilla superior de la Chiva (portaequipaje) */}
          <line x1="10" y1="9" x2="28" y2="9" />
          <line x1="13" y1="9" x2="13" y2="12" />
          <line x1="25" y1="9" x2="25" y2="12" />

          {/* Techo y cabina de la Chiva */}
          <path d="M7 13 H31 C33 13 34 15 34 17 V25 H6 V15 C6 13.9 6.9 13 8 13 Z" fill="currentColor" fillOpacity="0.15" />
          
          {/* Barrotes / ventanas abiertas tradicionales de la Chiva */}
          <line x1="12" y1="16" x2="12" y2="21" />
          <line x1="17" y1="16" x2="17" y2="21" />
          <line x1="22" y1="16" x2="22" y2="21" />
          <line x1="27" y1="16" x2="27" y2="21" />

          {/* Trompa frontal */}
          <path d="M34 20 H37 C37.6 20 38 20.4 38 21 V25 H34" />
          {/* Faro delantero */}
          <circle cx="36" cy="22.5" r="1" fill="currentColor" stroke="none" />

          {/* Ruedas */}
          <circle cx="12" cy="27" r="3.5" fill="#022c22" stroke="white" strokeWidth="1.8" />
          <circle cx="28" cy="27" r="3.5" fill="#022c22" stroke="white" strokeWidth="1.8" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <span className={`${textSize} font-black tracking-tight text-slate-950 leading-none`}>
              chiva
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5 animate-pulse" />
          </div>
          <span className="text-[9px] uppercase tracking-wider text-emerald-800 font-extrabold -mt-0.5">
            Ibarra ➔ Quito
          </span>
        </div>
      )}
    </div>
  );
};
