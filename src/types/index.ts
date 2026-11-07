export type MetodoPago = 'efectivo' | 'transferencia' | 'payphone' | 'paypal' | 'tarjeta';
export type EstadoPago = 'pendiente' | 'pagado';

export interface Conductor {
  nombre: string;
  telefono: string;
  calificacion: number;
  vehiculo: string;
  placa: string;
  avatar?: string;
}

export interface Salida {
  id: string;
  origen: string;
  origenDetalle: string;
  destino: string;
  destinoDetalle: string;
  fecha: string; // Formato YYYY-MM-DD
  horaSalida: string; // Formato HH:MM
  horaLlegadaEstimada: string;
  duracion: string;
  precio: number;
  totalAsientos: number;
  conductor: Conductor;
  puntoEncuentro: string;
  paradasIntermedias?: string[];
  equipajePermitido: string;
  activo?: boolean;
}

export type RefrigerioComida = 'sanduchito' | 'galleta dulce' | 'galleta sal' | 'humita';
export type RefrigerioBebida = 'jugo' | 'horchata' | 'café';

export interface Refrigerio {
  activo: boolean;
  comida: RefrigerioComida | null;
  bebida: RefrigerioBebida | null;
  precio: number;
}

export interface NotificacionPush {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo?: 'info' | 'reserva' | 'chofer' | 'promo';
}

export type TipoEmergencia = 'ninguna' | 'se_danio' | 'seguridad' | 'accidente' | 'bloqueo_via';

export interface SeguimientoGuambra {
  codigoReserva: string;
  salidaId: string;
  pasajeroNombre: string;
  pasajeroTelefono: string;
  origen: string;
  destino: string;
  estado: 'viajando_bien' | 'ya_llego_bien' | 'emergencia';
  ubicacionActualNombre: string;
  lat: number;
  lng: number;
  progresoPorcentaje: number;
  horaSalida: string;
  horaLlegadaEstimada: string;
  conductorNombre: string;
  conductorTelefono: string;
  vehiculoPlaca: string;
  novedadTexto?: string;
  tipoEmergencia: TipoEmergencia;
  ultimaActualizacion: string;
}

export type NombreNivel = 'guambra de casa' | 'andariego' | 'un man de mundo' | 'un capo';

export interface InfoNivel {
  nombre: NombreNivel;
  numeroNivel: 1 | 2 | 3 | 4;
  estrellasMin: number;
  estrellasMax: number;
  descuentoPorcentaje: number;
  avatarUrl: string;
  tituloBadge: string;
  descripcion: string;
  colorGradiente: string;
}

export interface ValoracionViaje {
  id: string;
  reservaId: string;
  salidaId: string;
  conductorNombre: string;
  conductorTelefono?: string;
  pasajeroId: string;
  pasajeroNombre: string;
  estrellas: number; // 1 - 5
  comentario: string;
  etiquetas?: string[];
  fecha: string;
}

export interface Reserva {
  id: string; // Ej: CHIVA-8821
  salidaId: string;
  pasajeroNombre: string;
  pasajeroTelefono: string;
  pasajeroEmail?: string;
  puntoPartidaPersonalizado: string; // Punto específico en Ibarra
  coordsPartida?: [number, number]; // [lat, lng]
  puntoLlegadaPersonalizado: string; // Destino específico en Quito
  coordsLlegada?: [number, number]; // [lat, lng]
  asientos: number[]; // Asientos asignados (ej: [3, 4])
  metodoPago: MetodoPago;
  detallesPago?: {
    numeroTarjetaOculto?: string;
    cuentaPayphone?: string;
    cuentaPaypal?: string;
  };
  estadoPago: EstadoPago;
  estadoAbordaje?: 'no_abordado' | 'abordado' | 'en_camino' | 'completado';
  total: number;
  refrigerio?: Refrigerio;
  fechaCreacion: string;
  notas?: string;
  descuentoAplicado?: number;
  nivelPasajero?: NombreNivel;
  calificacion?: number;
  comentarioConductor?: string;
}

export interface SalidaConEstado extends Salida {
  asientosOcupados: number[];
  asientosLibresCount: number;
  porcentajeOcupacion: number;
  reservas: Reserva[];
}

export interface Usuario {
  id: string;
  user: string;
  nombre: string;
  email?: string;
  rol: 'pasajero' | 'chofer';
  telefono?: string;
  avatar: string;
  estrellas: number;
  viajesCompletados: number;
  nivel: NombreNivel;
  descuentoNivel: number;
}

export interface PremioRuleta {
  id: string;
  titulo: string;
  tipo: 'descuento_porcentaje' | 'descuento_fijo' | 'gratis' | 'snack' | 'asiento_vip';
  valor: number;
  color: string;
}

export interface DatosTransferencia {
  banco: string;
  titular: string;
  tipoCuenta: string;
  numeroCuenta: string;
  clabeOalias: string;
  instrucciones: string;
}
