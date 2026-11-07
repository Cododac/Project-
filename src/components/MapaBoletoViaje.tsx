import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Reserva, Salida } from '../types';
import { Navigation, Car, Compass } from 'lucide-react';

interface Props {
  reserva: Reserva;
  salida?: Salida;
}

const RUTA_PANAMERICANA_E35: [number, number][] = [
  [-0.3524, -78.1228], // Ibarra Centro
  [-0.3412, -78.1284], // Ajaví
  [-0.3245, -78.1630], // San Antonio de Ibarra
  [-0.2450, -78.2580], // Atuntaqui
  [-0.2280, -78.2610], // Otavalo
  [-0.1890, -78.2190], // San Pablo del Lago
  [-0.0890, -78.1750], // Cajas
  [0.0020, -78.1450],  // Cayambe bypass
  [-0.0540, -78.2800], // Guayllabamba
  [-0.0986, -78.4725], // Carcelén
  [-0.1450, -78.4800], // El Condado
  [-0.1798, -78.4839], // Quicentro Norte
  [-0.1824, -78.4845]  // La Carolina
];

export const MapaBoletoViaje: React.FC<Props> = ({ reserva, salida }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const coordsPartida: [number, number] = reserva.coordsPartida || [-0.3524, -78.1228];
  const coordsLlegada: [number, number] = reserva.coordsLlegada || [-0.1798, -78.4839];

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-0.26, -78.30],
      zoom: 9,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    mapInstanceRef.current = map;

    const iconPartida = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="background-color: #10B981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; border: 3px solid white; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.45); transform: translate(-50%, -50%);">
          📍 INICIO
        </div>
      `,
      iconSize: [30, 30]
    });

    const iconLlegada = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="background-color: #2563EB; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; border: 3px solid white; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.45); transform: translate(-50%, -50%);">
          🏁 FIN
        </div>
      `,
      iconSize: [30, 30]
    });

    const iconVan = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="background-color: #1E293B; color: #F59E0B; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transform: translate(-50%, -50%);">
          🚐
        </div>
      `,
      iconSize: [34, 34]
    });

    const markerStart = L.marker(coordsPartida, { icon: iconPartida }).addTo(map);
    markerStart.bindPopup(`<b>Punto de Recogida:</b><br/>${reserva.puntoPartidaPersonalizado}<br/><i>Salida: ${salida?.horaSalida || '06:00'} hrs</i>`).openPopup();

    const markerEnd = L.marker(coordsLlegada, { icon: iconLlegada }).addTo(map);
    markerEnd.bindPopup(`<b>Punto de Destino:</b><br/>${reserva.puntoLlegadaPersonalizado}<br/><i>Llegada: ${salida?.horaLlegadaEstimada || '08:15'} hrs</i>`);

    const vanPos: [number, number] = [-0.15, -78.23];
    const markerVan = L.marker(vanPos, { icon: iconVan }).addTo(map);
    markerVan.bindPopup(`<b>Unidad en Trayecto:</b><br/>${salida?.conductor.vehiculo || 'Mercedes Sprinter'}<br/>Placa: ${salida?.conductor.placa || 'IBC-4821'}<br/>Chofer: ${salida?.conductor.nombre || 'Marco Benalcázar'}`);

    L.polyline([coordsPartida, ...RUTA_PANAMERICANA_E35.slice(1, -1), coordsLlegada], {
      color: '#2563EB',
      weight: 4,
      opacity: 0.9
    }).addTo(map);

    const bounds = L.latLngBounds([coordsPartida, coordsLlegada]);
    map.fitBounds(bounds, { padding: [30, 30] });

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [coordsPartida, coordsLlegada]);

  const centrarRuta = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds([coordsPartida, coordsLlegada]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
    }
  };

  const centrarRecogida = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.flyTo(coordsPartida, 14);
  };

  const centrarDestino = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.flyTo(coordsLlegada, 14);
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex flex-col">
      {/* Barra superior con controles */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md border border-slate-200 text-xs font-black text-slate-800 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Itinerario Geográfico Confirmado</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200">
          <button
            type="button"
            onClick={centrarRecogida}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
          >
            Recogida
          </button>
          <button
            type="button"
            onClick={centrarRuta}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
          >
            Ruta
          </button>
          <button
            type="button"
            onClick={centrarDestino}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
          >
            Destino
          </button>
        </div>
      </div>

      <div 
        ref={mapContainerRef} 
        className="w-full flex-1 min-h-0 z-10"
      />

      <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
        <div className="bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-medium shadow-md flex items-center gap-2 border border-slate-700">
          <Car className="w-3.5 h-3.5 text-amber-400" />
          <span>Ibarra ➔ Quito: <strong>~115 km</strong> (~2h 15m)</span>
        </div>
      </div>
    </div>
  );
};
