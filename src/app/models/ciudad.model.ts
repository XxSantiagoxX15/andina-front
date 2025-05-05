export interface Ciudad {
    id?: number;
    nombre: string;
    pais: {
        id: number;
        nombre?: string;
    };
} 