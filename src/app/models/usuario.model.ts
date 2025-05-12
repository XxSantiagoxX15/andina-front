import { Ciudad } from "./ciudad.model";
import { Rol } from "./rol.model";

export interface Usuario {
    identificacion: number;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    correo: string;
    saldo:number;
    contrasena: string;
    direccion: string;
    telefono: string;
    numeroLicencia: string;
    rol?: number;
    ciudad?: number;
    
    
    
} 