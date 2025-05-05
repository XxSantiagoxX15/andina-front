import { Ciudad } from "./ciudad.model";
import { Rol } from "./rol.model";

export interface Usuario {
    identificacion: number;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    correo: string;
    contrasena: string;
    direccion: string;
    telefono: string;
    numeroLicencia: string;
    rolId?: number;
    ciudadId?: number;
    rol?: Rol;
    ciudad?: Ciudad;
    createdAt?: string;
    updateAt?: string;
    deletedAt?: string | null;
} 