import { InfoNivel, NombreNivel } from '../types';
import avatarGuambraCasa from '../assets/images/avatar_guambra_casa_1794015816754.jpg';
import avatarAndariego from '../assets/images/avatar_andariego_1794015803143.jpg';
import avatarManDeMundo from '../assets/images/avatar_man_de_mundo_1794015803692.jpg';
import avatarUnCapo from '../assets/images/avatar_un_capo_1794015803702.jpg';

export const NIVELES_CHIVA: Record<NombreNivel, InfoNivel> = {
  'guambra de casa': {
    nombre: 'guambra de casa',
    numeroNivel: 1,
    estrellasMin: 0,
    estrellasMax: 19,
    descuentoPorcentaje: 0,
    avatarUrl: avatarGuambraCasa,
    tituloBadge: '🏠 Guambra de Casa',
    descripcion: 'Apenas saliendo del nido y de su cuarto con su chocolate caliente. Viaja cuando toca, pero siempre seguro y cómodo en la Chiva.',
    colorGradiente: 'from-emerald-400 to-teal-500'
  },
  'andariego': {
    nombre: 'andariego',
    numeroNivel: 2,
    estrellasMin: 20,
    estrellasMax: 39,
    descuentoPorcentaje: 10,
    avatarUrl: avatarAndariego,
    tituloBadge: '🎒 Andariego',
    descripcion: 'Mochilero intrépido, botas de montaña y bastón en mano. No se pierde un viaje a Quito. 10% de descuento en todos sus pasajes.',
    colorGradiente: 'from-teal-500 to-cyan-600'
  },
  'un man de mundo': {
    nombre: 'un man de mundo',
    numeroNivel: 3,
    estrellasMin: 40,
    estrellasMax: 59,
    descuentoPorcentaje: 20,
    avatarUrl: avatarManDeMundo,
    tituloBadge: '🌍 Un Man de Mundo',
    descripcion: 'Elegante, cosmopolita con pasaporte en mano, boletos listos y gafas oscuras. Conoce el país y viaja con 20% de descuento VIP.',
    colorGradiente: 'from-blue-600 to-indigo-600'
  },
  'un capo': {
    nombre: 'un capo',
    numeroNivel: 4,
    estrellasMin: 60,
    estrellasMax: 999,
    descuentoPorcentaje: 30,
    avatarUrl: avatarUnCapo,
    tituloBadge: '👑 Un Capo',
    descripcion: 'El jefe legendario de la carretera con chaqueta aviadora y llaves de la Chiva. Máximo estatus y 30% de descuento en cada trayecto.',
    colorGradiente: 'from-amber-400 to-orange-500'
  }
};

/**
 * Cada 2 viajes = 1 estrella.
 * Cada 20 estrellas = subes de nivel.
 * Niveles:
 *  1. 'guambra de casa' (0-19 estrellas) -> 0% dto.
 *  2. 'andariego' (20-39 estrellas) -> 10% dto.
 *  3. 'un man de mundo' (40-59 estrellas) -> 20% dto.
 *  4. 'un capo' (60+ estrellas) -> 30% dto.
 */
export function calcularProgresoLealtad(viajesTotales: number, estrellasManuales?: number): {
  viajesTotales: number;
  estrellas: number;
  nivelActual: InfoNivel;
  siguienteNivel: InfoNivel | null;
  estrellasEnNivelActual: number;
  estrellasParaSiguienteNivel: number;
  porcentajeProgresoVelocimetro: number;
  descuentoActual: number;
} {
  // Cada 2 viajes es 1 estrella
  const estrellasCalculadas = estrellasManuales !== undefined 
    ? estrellasManuales 
    : Math.floor(Math.max(0, viajesTotales) / 2);

  let nombreNivel: NombreNivel = 'guambra de casa';
  let siguienteNombre: NombreNivel | null = 'andariego';

  if (estrellasCalculadas >= 60) {
    nombreNivel = 'un capo';
    siguienteNombre = null; // Nivel máximo
  } else if (estrellasCalculadas >= 40) {
    nombreNivel = 'un man de mundo';
    siguienteNombre = 'un capo';
  } else if (estrellasCalculadas >= 20) {
    nombreNivel = 'andariego';
    siguienteNombre = 'un man de mundo';
  } else {
    nombreNivel = 'guambra de casa';
    siguienteNombre = 'andariego';
  }

  const nivelActual = NIVELES_CHIVA[nombreNivel];
  const siguienteNivel = siguienteNombre ? NIVELES_CHIVA[siguienteNombre] : null;

  // Cálculo para el velocímetro / termómetro
  let porcentajeProgresoVelocimetro = 100;
  let estrellasEnNivelActual = estrellasCalculadas;
  let estrellasParaSiguienteNivel = 0;

  if (siguienteNivel) {
    const rangoNivel = siguienteNivel.estrellasMin - nivelActual.estrellasMin; // Siempre 20 estrellas
    estrellasEnNivelActual = estrellasCalculadas - nivelActual.estrellasMin;
    estrellasParaSiguienteNivel = siguienteNivel.estrellasMin - estrellasCalculadas;
    porcentajeProgresoVelocimetro = Math.min(100, Math.max(5, Math.round((estrellasEnNivelActual / rangoNivel) * 100)));
  } else {
    // Si ya es un capo
    porcentajeProgresoVelocimetro = 100;
    estrellasEnNivelActual = estrellasCalculadas - 60;
    estrellasParaSiguienteNivel = 0;
  }

  return {
    viajesTotales,
    estrellas: estrellasCalculadas,
    nivelActual,
    siguienteNivel,
    estrellasEnNivelActual,
    estrellasParaSiguienteNivel,
    porcentajeProgresoVelocimetro,
    descuentoActual: nivelActual.descuentoPorcentaje
  };
}
