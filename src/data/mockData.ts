import { Salida, Reserva, DatosTransferencia } from '../types';

export interface UbicacionPreset {
  nombre: string;
  ciudad: 'Ibarra' | 'Quito';
  coords: [number, number];
  descripcion: string;
}

export const PRESETS_IBARRA: UbicacionPreset[] = [
  { nombre: 'Terminal Terrestre de Ibarra (Bahía Principal)', ciudad: 'Ibarra', coords: [-0.3472, -78.1189], descripcion: 'Bahía principal de transporte interprovincial' },
  { nombre: 'Parque Pedro Moncayo (Centro de Ibarra)', ciudad: 'Ibarra', coords: [-0.3524, -78.1228], descripcion: 'Centro histórico, frente a la Catedral' },
  { nombre: 'Redondel de Ajaví / Av. Mariano Acosta', ciudad: 'Ibarra', coords: [-0.3412, -78.1284], descripcion: 'Intersección Mariano Acosta y Teodoro Gómez' },
  { nombre: 'Sector Los Ceibos / Av. 17 de Julio', ciudad: 'Ibarra', coords: [-0.3621, -78.1340], descripcion: 'Cerca del campus UTN y estadio' },
  { nombre: 'San Antonio de Ibarra (Panamericana)', ciudad: 'Ibarra', coords: [-0.3245, -78.1630], descripcion: 'Parada Panamericana Norte E35' },
  { nombre: 'Laguna de Yaguarcocha', ciudad: 'Ibarra', coords: [-0.3750, -78.0980], descripcion: 'Ingreso al autódromo / sector turístico' }
];

export const PRESETS_QUITO: UbicacionPreset[] = [
  { nombre: 'Terminal Terrestre Carcelén (Norte de Quito)', ciudad: 'Quito', coords: [-0.0986, -78.4725], descripcion: 'Punto de conexión norte Panamericana' },
  { nombre: 'Quicentro Norte / Av. Naciones Unidas', ciudad: 'Quito', coords: [-0.1798, -78.4839], descripcion: 'Sector Financiero y Comercial' },
  { nombre: 'Parque La Carolina / CCI (Centro Norte)', ciudad: 'Quito', coords: [-0.1824, -78.4845], descripcion: 'Av. Amazonas y Av. Naciones Unidas' },
  { nombre: 'Plaza Foch / La Mariscal', ciudad: 'Quito', coords: [-0.2032, -78.4908], descripcion: 'Zona turística y centro norte' },
  { nombre: 'Cumbayá / San Francisco de Quito', ciudad: 'Quito', coords: [-0.2015, -78.4312], descripcion: 'Valle de Cumbayá y USFQ' },
  { nombre: 'Aeropuerto Internacional Mariscal Sucre (Tababela)', ciudad: 'Quito', coords: [-0.1292, -78.3575], descripcion: 'Terminal aérea internacional' },
  { nombre: 'Terminal Quitumbe (Sur de Quito)', ciudad: 'Quito', coords: [-0.2917, -78.5478], descripcion: 'Conexión sur de la capital' }
];

export const PUNTOS_PARTIDA_IBARRA = PRESETS_IBARRA.map((p) => p.nombre).concat([
  'Recogida a domicilio en Ibarra (Indicar dirección exacta)'
]);

export const PUNTOS_LLEGADA_QUITO = PRESETS_QUITO.map((p) => p.nombre).concat([
  'Entrega a domicilio / destino personalizado en Quito'
]);

export const DATOS_TRANSFERENCIA: DatosTransferencia = {
  banco: 'Banco Pichincha / Produbanco (Ecuador)',
  titular: 'Expreso Ibarra-Quito Directo Cía. Ltda.',
  tipoCuenta: 'Cuenta Corriente',
  numeroCuenta: '2100849201',
  clabeOalias: 'RUC: 1091748291001 (DeUna: 0998472910)',
  instrucciones: 'Realiza el pago por transferencia o DeUna e incluye tu nombre o código en el detalle. El conductor validará el comprobante.'
};

export const SALIDAS_INICIALES: Salida[] = [
  {
    id: 'IQ-01',
    origen: 'Ibarra (Salida Matutina)',
    origenDetalle: 'Punto a convenir en Ibarra (puerta a puerta o terminal)',
    destino: 'Quito (Llegada Norte y Centro)',
    destinoDetalle: 'Destino flexible según solicitud del pasajero en Quito',
    fecha: '2026-11-06',
    horaSalida: '06:00',
    horaLlegadaEstimada: '08:15',
    duracion: '2h 15m',
    precio: 10,
    totalAsientos: 15,
    conductor: {
      nombre: 'Marco Benalcázar',
      telefono: '+593 99 824 1092',
      calificacion: 4.9,
      vehiculo: 'Mercedes-Benz Sprinter 516 CDI (A/C, WiFi, Cargadores)',
      placa: 'IBC-4821'
    },
    puntoEncuentro: 'Recogida flexible en Ibarra y entrega personalizada en Quito',
    equipajePermitido: '1 maleta en bodega (hasta 23kg) + 1 mochila de mano'
  },
  {
    id: 'IQ-02',
    origen: 'Ibarra (Media Mañana)',
    origenDetalle: 'Punto a convenir en Ibarra',
    destino: 'Quito (Flexible)',
    destinoDetalle: 'Destino flexible según solicitud del pasajero en Quito',
    fecha: '2026-11-06',
    horaSalida: '08:30',
    horaLlegadaEstimada: '10:45',
    duracion: '2h 15m',
    precio: 10,
    totalAsientos: 15,
    conductor: {
      nombre: 'Galo Villacís',
      telefono: '+593 98 410 7733',
      calificacion: 4.8,
      vehiculo: 'Toyota HiAce VIP Executive (Climatizada)',
      placa: 'IBB-7290'
    },
    puntoEncuentro: 'Recogida en domicilio o punto céntrico de Ibarra',
    equipajePermitido: '1 maleta en bodega + 1 equipaje de mano'
  },
  {
    id: 'IQ-03',
    origen: 'Ibarra (Mediodía)',
    origenDetalle: 'Punto a convenir en Ibarra',
    destino: 'Quito (Flexible)',
    destinoDetalle: 'Destino flexible según solicitud del pasajero en Quito',
    fecha: '2026-11-06',
    horaSalida: '11:30',
    horaLlegadaEstimada: '13:45',
    duracion: '2h 15m',
    precio: 10,
    totalAsientos: 15,
    conductor: {
      nombre: 'Luis Andrade',
      telefono: '+593 99 301 5564',
      calificacion: 5.0,
      vehiculo: 'Ford Transit Custom Interprovincial',
      placa: 'IBA-3199'
    },
    puntoEncuentro: 'Recogida personalizada en Ibarra',
    equipajePermitido: '1 maleta en bodega + 1 bolso'
  },
  {
    id: 'IQ-04',
    origen: 'Ibarra (Vespertina)',
    origenDetalle: 'Punto a convenir en Ibarra',
    destino: 'Quito (Flexible)',
    destinoDetalle: 'Destino flexible según solicitud del pasajero en Quito',
    fecha: '2026-11-06',
    horaSalida: '15:00',
    horaLlegadaEstimada: '17:20',
    duracion: '2h 20m',
    precio: 10,
    totalAsientos: 15,
    conductor: {
      nombre: 'Edwin Cárdenas',
      telefono: '+593 99 712 9081',
      calificacion: 4.9,
      vehiculo: 'Mercedes Sprinter Ejecutiva 2024',
      placa: 'IBD-1044'
    },
    puntoEncuentro: 'Recogida acordada en Ibarra',
    equipajePermitido: '1 maleta en bodega + 1 mochila'
  },
  {
    id: 'IQ-05',
    origen: 'Ibarra (Nocturna)',
    origenDetalle: 'Punto a convenir en Ibarra',
    destino: 'Quito (Flexible)',
    destinoDetalle: 'Destino flexible según solicitud del pasajero en Quito',
    fecha: '2026-11-06',
    horaSalida: '18:30',
    horaLlegadaEstimada: '20:50',
    duracion: '2h 20m',
    precio: 12,
    totalAsientos: 15,
    conductor: {
      nombre: 'Christian Pozo',
      telefono: '+593 98 902 4411',
      calificacion: 4.9,
      vehiculo: 'Hyundai H350 Gran Turismo',
      placa: 'IBC-9921'
    },
    puntoEncuentro: 'Recogida acordada en Ibarra',
    equipajePermitido: '1 maleta en bodega + 1 mochila'
  }
];

export const RESERVAS_INICIALES: Reserva[] = [
  {
    id: 'CHIVA-8821',
    salidaId: 'IQ-01',
    pasajeroNombre: 'Mateo Cárdenas',
    pasajeroTelefono: '+593 99 841 2901',
    pasajeroEmail: 'mateo.cardenas@gmail.com',
    puntoPartidaPersonalizado: 'Terminal Terrestre de Ibarra (Bahía Principal)',
    puntoLlegadaPersonalizado: 'Parque La Carolina / CCI (Centro Norte)',
    asientos: [3, 4],
    metodoPago: 'payphone',
    detallesPago: { cuentaPayphone: '0998412901' },
    estadoPago: 'pagado',
    total: 21,
    refrigerio: {
      activo: true,
      comida: 'sanduchito',
      bebida: 'café',
      precio: 1
    },
    fechaCreacion: '2026-11-05 14:10',
    notas: 'Viaje reservado con combo refrigerio sanduchito + café'
  },
  {
    id: 'CHIVA-4390',
    salidaId: 'IQ-02',
    pasajeroNombre: 'Mateo Cárdenas',
    pasajeroTelefono: '+593 99 841 2901',
    pasajeroEmail: 'mateo.cardenas@gmail.com',
    puntoPartidaPersonalizado: 'Redondel de Ajaví / Av. Mariano Acosta',
    puntoLlegadaPersonalizado: 'Quicentro Norte / Av. Naciones Unidas',
    asientos: [7],
    metodoPago: 'tarjeta',
    detallesPago: { numeroTarjetaOculto: '•••• 8821' },
    estadoPago: 'pagado',
    total: 11,
    refrigerio: {
      activo: true,
      comida: 'humita',
      bebida: 'horchata',
      precio: 1
    },
    fechaCreacion: '2026-10-28 09:15',
    notas: 'Viaje completado exitosamente a Quito'
  },
  {
    id: 'CHIVA-1904',
    salidaId: 'IQ-04',
    pasajeroNombre: 'Mateo Cárdenas',
    pasajeroTelefono: '+593 99 841 2901',
    pasajeroEmail: 'mateo.cardenas@gmail.com',
    puntoPartidaPersonalizado: 'Sector Los Ceibos / Av. 17 de Julio',
    puntoLlegadaPersonalizado: 'Terminal Terrestre Carcelén (Norte de Quito)',
    asientos: [2],
    metodoPago: 'efectivo',
    estadoPago: 'pagado',
    total: 10,
    fechaCreacion: '2026-10-15 16:30'
  },
  {
    id: 'IQ-1048',
    salidaId: 'IQ-01',
    pasajeroNombre: 'Patricio Montenegro',
    pasajeroTelefono: '+593 99 443 1209',
    puntoPartidaPersonalizado: 'Terminal Terrestre de Ibarra (Bahía Principal)',
    puntoLlegadaPersonalizado: 'Quicentro Norte / Av. Naciones Unidas',
    asientos: [1, 2],
    metodoPago: 'payphone',
    detallesPago: { cuentaPayphone: '0994431209' },
    estadoPago: 'pagado',
    total: 20,
    fechaCreacion: '2026-11-05 08:30',
    notas: 'Lleva una laptop y maleta mediana'
  },
  {
    id: 'IQ-2291',
    salidaId: 'IQ-01',
    pasajeroNombre: 'Andrea Jaramillo',
    pasajeroTelefono: '+593 98 554 9912',
    puntoPartidaPersonalizado: 'Parque Pedro Moncayo (Centro de Ibarra)',
    puntoLlegadaPersonalizado: 'Parque La Carolina / CCI (Centro Norte)',
    asientos: [5, 6],
    metodoPago: 'efectivo',
    estadoPago: 'pendiente',
    total: 20,
    fechaCreacion: '2026-11-05 10:15'
  }
];

export const LAYOUT_VAN_15: {
  filas: number;
  asientos: { id: number; numero: number; fila: number; col: number; tipo: 'asiento' | 'conductor' | 'puerta' | 'pasillo' }[];
} = {
  filas: 6,
  asientos: [
    // Fila 0: Conductor y Copiloto (Asiento 1)
    { id: 999, numero: 0, fila: 0, col: 0, tipo: 'conductor' },
    { id: 0, numero: 0, fila: 0, col: 1, tipo: 'pasillo' },
    { id: 0, numero: 0, fila: 0, col: 2, tipo: 'pasillo' },
    { id: 1, numero: 1, fila: 0, col: 3, tipo: 'asiento' },

    // Fila 1:
    { id: 2, numero: 2, fila: 1, col: 0, tipo: 'asiento' },
    { id: 3, numero: 3, fila: 1, col: 1, tipo: 'asiento' },
    { id: 0, numero: 0, fila: 1, col: 2, tipo: 'pasillo' },
    { id: 998, numero: 0, fila: 1, col: 3, tipo: 'puerta' },

    // Fila 2:
    { id: 4, numero: 4, fila: 2, col: 0, tipo: 'asiento' },
    { id: 5, numero: 5, fila: 2, col: 1, tipo: 'asiento' },
    { id: 0, numero: 0, fila: 2, col: 2, tipo: 'pasillo' },
    { id: 6, numero: 6, fila: 2, col: 3, tipo: 'asiento' },

    // Fila 3:
    { id: 7, numero: 7, fila: 3, col: 0, tipo: 'asiento' },
    { id: 8, numero: 8, fila: 3, col: 1, tipo: 'asiento' },
    { id: 0, numero: 0, fila: 3, col: 2, tipo: 'pasillo' },
    { id: 9, numero: 9, fila: 3, col: 3, tipo: 'asiento' },

    // Fila 4:
    { id: 10, numero: 10, fila: 4, col: 0, tipo: 'asiento' },
    { id: 0, numero: 0, fila: 4, col: 1, tipo: 'pasillo' },
    { id: 0, numero: 0, fila: 4, col: 2, tipo: 'pasillo' },
    { id: 11, numero: 11, fila: 4, col: 3, tipo: 'asiento' },

    // Fila 5: Fila trasera corrida (4 asientos)
    { id: 12, numero: 12, fila: 5, col: 0, tipo: 'asiento' },
    { id: 13, numero: 13, fila: 5, col: 1, tipo: 'asiento' },
    { id: 14, numero: 14, fila: 5, col: 2, tipo: 'asiento' },
    { id: 15, numero: 15, fila: 5, col: 3, tipo: 'asiento' }
  ]
};
