export interface HistorialOrden {
    id?: number;
    precio: number;
    tipo_orden: string;
    fecha_hora: string;
    comision: number;
    ordenId: number;
    createdAt?: string;
    updateAt?: string;
    deletedAt?: string | null;
} 