import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useTransport } from '../context/TransportContext';
import { PRESETS_IBARRA, PRESETS_QUITO, UbicacionPreset } from '../data/mockData';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Crosshair, 
  Check, 
  Info,
  Car,
  Compass
} from 'lucide-react';

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

export const MapaSeleccionUbicacion: React.FC = () => {
  const { 
    puntoPartida, 
    setPuntoPartida, 
    coordsPartida, 
    setCoordsPartida, 
    puntoLlegada, 
    setPuntoLlegada, 
    coordsLlegada, 
    setCoordsLlegada 
  } = useTransport();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerPartidaRef = useRef<L.Marker | null>(null);
  const markerLlegadaRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [modoSeleccion, setModoSeleccion] = useState<'partida' | 'llegada'>('partida');

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-0.25, -78.30],
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
        <div style="background-color: #10B981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; border: 3px solid white; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.45); transform: translate(-50%, -50%);">
          📍 SUBIR
        </div>
      `,
      iconSize: [32, 32]
    });

    const iconLlegada = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="background-color: #2563EB; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; border: 3px solid white; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.45); transform: translate(-50%, -50%);">
          🏁 BAJAR
        </div>
      `,
      iconSize: [32, 32]
    });

    const markerPartida = L.marker(coordsPartida, {
      icon: iconPartida,
      draggable: true,
      title: 'Punto de Recogida en Ibarra'
    }).addTo(map);

    markerPartida.bindPopup(`<b>Recogida en Ibarra:</b><br/>${puntoPartida}`);

    markerPartida.on('dragend', (e) => {
      const latlng = e.target.getLatLng();
      setCoordsPartida([latlng.lat, latlng.lng]);
      setPuntoPartida(`Ubicación en mapa (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`);
    });

    markerPartidaRef.current = markerPartida;

    const markerLlegada = L.marker(coordsLlegada, {
      icon: iconLlegada,
      draggable: true,
      title: 'Punto de Destino en Quito'
    }).addTo(map);

    markerLlegada.bindPopup(`<b>Destino en Quito:</b><br/>${puntoLlegada}`);

    markerLlegada.on('dragend', (e) => {
      const latlng = e.target.getLatLng();
      setCoordsLlegada([latlng.lat, latlng.lng]);
      setPuntoLlegada(`Ubicación en mapa (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`);
    });

    markerLlegadaRef.current = markerLlegada;

    const polyline = L.polyline([coordsPartida, ...RUTA_PANAMERICANA_E35.slice(1, -1), coordsLlegada], {
      color: '#2563EB',
      weight: 4,
      opacity: 0.85,
      dashArray: '6, 8'
    }).addTo(map);

    polylineRef.current = polyline;

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      window.dispatchEvent(
        new CustomEvent('mapa-click-ubicacion', {
          detail: { lat, lng }
        })
      );
    });

    // Invalidation timeout for perfect rendering in layout
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleMapClick = (e: any) => {
      const { lat, lng } = e.detail;
      const coords: [number, number] = [lat, lng];

      if (modoSeleccion === 'partida') {
        setCoordsPartida(coords);
        setPuntoPartida(`Punto personalizado Ibarra (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        if (markerPartidaRef.current) {
          markerPartidaRef.current.setLatLng(coords);
          markerPartidaRef.current.setPopupContent(`<b>Recogida seleccionada:</b><br/>${lat.toFixed(4)}, ${lng.toFixed(4)}`).openPopup();
        }
      } else {
        setCoordsLlegada(coords);
        setPuntoLlegada(`Destino personalizado Quito (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        if (markerLlegadaRef.current) {
          markerLlegadaRef.current.setLatLng(coords);
          markerLlegadaRef.current.setPopupContent(`<b>Destino seleccionado:</b><br/>${lat.toFixed(4)}, ${lng.toFixed(4)}`).openPopup();
        }
      }
    };

    window.addEventListener('mapa-click-ubicacion', handleMapClick);
    return () => window.removeEventListener('mapa-click-ubicacion', handleMapClick);
  }, [modoSeleccion, setCoordsPartida, setPuntoPartida, setCoordsLlegada, setPuntoLlegada]);

  useEffect(() => {
    if (markerPartidaRef.current) markerPartidaRef.current.setLatLng(coordsPartida);
    if (markerLlegadaRef.current) markerLlegadaRef.current.setLatLng(coordsLlegada);
    if (polylineRef.current) {
      polylineRef.current.setLatLngs([coordsPartida, ...RUTA_PANAMERICANA_E35.slice(1, -1), coordsLlegada]);
    }
  }, [coordsPartida, coordsLlegada]);

  // Redibujar mapa si la ventana cambia de tamaño
  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const centrarEnIbarra = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coordsPartida, 14, { duration: 0.8 });
      setModoSeleccion('partida');
    }
  };

  const centrarEnQuito = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coordsLlegada, 13, { duration: 0.8 });
      setModoSeleccion('llegada');
    }
  };

  const verRutaCompleta = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds([coordsPartida, coordsLlegada]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
    }
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex flex-col">
      {/* Barra flotante superior del mapa */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setModoSeleccion('partida');
              centrarEnIbarra();
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
              modoSeleccion === 'partida'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            📍 Fijar Recogida (Ibarra)
          </button>
          <button
            type="button"
            onClick={() => {
              setModoSeleccion('llegada');
              centrarEnQuito();
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
              modoSeleccion === 'llegada'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            🏁 Fijar Llegada (Quito)
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200">
          <button
            type="button"
            onClick={verRutaCompleta}
            className="p-1.5 text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 text-xs font-bold"
            title="Ver ruta completa"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={centrarEnIbarra}
            className="px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 rounded"
          >
            Ibarra
          </button>
          <button
            type="button"
            onClick={centrarEnQuito}
            className="px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-50 rounded"
          >
            Quito
          </button>
        </div>
      </div>

      {/* Contenedor del Mapa Leaflet */}
      <div 
        ref={mapContainerRef} 
        className="w-full flex-1 min-h-0 z-10"
      />

      {/* Badge flotante inferior con distancia */}
      <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
        <div className="bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 border border-slate-700">
          <Car className="w-3.5 h-3.5 text-amber-400" />
          <span>Ibarra ➔ Quito: <strong>~115 km</strong> (~2h 15m)</span>
        </div>
      </div>
    </div>
  );
};
