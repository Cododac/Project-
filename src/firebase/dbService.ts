import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  getDocFromServer 
} from 'firebase/firestore';
import { db, auth } from './config';
import { Reserva, Salida, SeguimientoGuambra, TipoEmergencia } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous
    },
    operationType,
    path
  };
  console.warn('Firestore Operation:', JSON.stringify(errInfo));
  // No interrumpir la UX si está en modo offline/preview
  return errInfo;
}

// Probar conexión inicial con getDocFromServer (Requerimiento crítico de SKILL.md)
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase en modo local/offline.');
    }
  }
}

// Sincronizar reservas con Firestore
export async function guardarReservaFirestore(reserva: Reserva): Promise<void> {
  const path = `reservas/${reserva.id}`;
  try {
    await setDoc(doc(db, 'reservas', reserva.id), {
      ...reserva,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Actualizar estado de abordaje en Firestore
export async function actualizarAbordajeFirestore(reservaId: string, estadoAbordaje: string): Promise<void> {
  const path = `reservas/${reservaId}`;
  try {
    await updateDoc(doc(db, 'reservas', reservaId), {
      estadoAbordaje,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// Guardar o actualizar seguimiento en vivo de "¿Cómo estás mi guambra?"
export async function guardarSeguimientoFirestore(seguimiento: SeguimientoGuambra): Promise<void> {
  const path = `seguimientos/${seguimiento.codigoReserva}`;
  try {
    await setDoc(doc(db, 'seguimientos', seguimiento.codigoReserva), {
      ...seguimiento,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Reportar novedad de emergencia en Firestore
export async function reportarEmergenciaFirestore(
  codigoReserva: string, 
  tipoEmergencia: TipoEmergencia, 
  novedadTexto: string
): Promise<void> {
  const path = `seguimientos/${codigoReserva}`;
  try {
    await updateDoc(doc(db, 'seguimientos', codigoReserva), {
      estado: 'emergencia',
      tipoEmergencia,
      novedadTexto,
      ultimaActualizacion: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// Guardar valoración del viaje y conductor en Firestore
export async function guardarValoracionFirestore(valoracion: {
  id: string;
  reservaId: string;
  salidaId: string;
  conductorNombre: string;
  conductorTelefono?: string;
  pasajeroId: string;
  pasajeroNombre: string;
  estrellas: number;
  comentario: string;
  etiquetas?: string[];
  fecha: string;
}): Promise<void> {
  const path = `valoraciones/${valoracion.id}`;
  try {
    await setDoc(doc(db, 'valoraciones', valoracion.id), {
      ...valoracion,
      updatedAt: new Date().toISOString()
    });

    // Actualizar también la reserva asociada con la calificación
    await updateDoc(doc(db, 'reservas', valoracion.reservaId), {
      calificacion: valoracion.estrellas,
      comentarioConductor: valoracion.comentario,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Guardar o actualizar perfil de usuario en Firestore
export async function guardarUsuarioFirestore(usuario: any): Promise<void> {
  const path = `usuarios/${usuario.id}`;
  try {
    await setDoc(doc(db, 'usuarios', usuario.id), {
      ...usuario,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

