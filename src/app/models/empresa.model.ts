export interface Empresa {
    id?: number;
    nombre: string;
    descripcion: string;
    sectorEconomico?: {
        id: number;
    };
    sector_economico_id?: number;
} 