import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { Salida } from '../types';
import { X, Plus, Calendar, Clock, DollarSign, MapPin, Bus, User, Phone } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalNuevaSalida: React.FC<Props> = ({ isOpen, onClose }) => {
  const { agregarSalida } = useTransport();

  const [origen, setOrigen] = useState('Ibarra (Recogida Flexible)');
  const [origenDetalle, setOrigenDetalle] = useState('Terminal Terrestre o a convenir en Ibarra');
  const [destino, setDestino] = useState('Quito (Destino Flexible)');
  const [destinoDetalle, setDestinoDetalle] = useState('Sector Carcelén, La Carolina, Cumbayá o domicilio');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [horaSalida, setHoraSalida] = useState('09:00');
  const [horaLlegadaEstimada, setHoraLlegadaEstimada] = useState('11:15');
  const [duracion, setDuracion] = useState('2h 15m');
  const [precio, setPrecio] = useState(10);
  const [conductorNombre, setConductorNombre] = useState('Marco Benalcázar');
  const [conductorTelefono, setConductorTelefono] = useState('+593 99 824 1092');
  const [vehiculo, setVehiculo] = useState('Mercedes-Benz Sprinter 516 (15 Asientos)');
  const [placa, setPlaca] = useState('IBC-4821');
  const [puntoEncuentro, setPuntoEncuentro] = useState('Paradas flexibles acordadas con el pasajero');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!origen || !destino || !fecha || !horaSalida) return;

    const nueva: Omit<Salida, 'id'> = {
      origen,
      origenDetalle: origenDetalle || 'Punto de abordaje principal',
      destino,
      destinoDetalle: destinoDetalle || 'Destino central',
      fecha,
      horaSalida,
      horaLlegadaEstimada,
      duracion,
      precio: Number(precio),
      totalAsientos: 15,
      conductor: {
        nombre: conductorNombre,
        telefono: conductorTelefono,
        calificacion: 5.0,
        vehiculo,
        placa
      },
      puntoEncuentro,
      equipajePermitido: '1 maleta en cajuela + 1 mochila de mano'
    };

    agregarSalida(nueva);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden my-6 border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Programar Nueva Salida</h3>
              <p className="text-xs text-slate-500">Agrega un viaje fijo con sus horarios y tarifa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Ruta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Origen *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Ibarra Centro"
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Destino *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Quito La Carolina"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Fecha y Horarios */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Fecha *
              </label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hora Salida *
              </label>
              <input
                type="time"
                required
                value={horaSalida}
                onChange={(e) => setHoraSalida(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Llegada Est.
              </label>
              <input
                type="time"
                value={horaLlegadaEstimada}
                onChange={(e) => setHoraLlegadaEstimada(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Precio y Duración */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Precio por Asiento ($) *
              </label>
              <input
                type="number"
                required
                min="10"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Duración Estimada
              </label>
              <input
                type="text"
                placeholder="Ej. 2h 15m"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Conductor y Vehículo */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase block">
              Datos del Conductor y Vehículo
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Conductor</label>
                <input
                  type="text"
                  value={conductorNombre}
                  onChange={(e) => setConductorNombre(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={conductorTelefono}
                  onChange={(e) => setConductorTelefono(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Vehículo</label>
                <input
                  type="text"
                  value={vehiculo}
                  onChange={(e) => setVehiculo(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Placas</label>
                <input
                  type="text"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Punto de Encuentro
            </label>
            <input
              type="text"
              value={puntoEncuentro}
              onChange={(e) => setPuntoEncuentro(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Guardar Salida
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
