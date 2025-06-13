import { TipoRaza } from "./tipo-raza";


export interface Toro{
    id: number;
    codigo: string;
    nombre: string;
    tipoRaza: TipoRaza;
    activo?: boolean;
}
