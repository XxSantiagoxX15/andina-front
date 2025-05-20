export interface Auditoria {
    id: number;
    accion: string;
    descripcion: string;
    fechaHora: string; // Usamos string para manejar LocalDateTime del backend
    usuario: string;
  }