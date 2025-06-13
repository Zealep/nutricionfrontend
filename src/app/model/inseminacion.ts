import { Inseminador } from "./inseminador";
import { TipoInseminacion } from "./tipo-inseminacion";
import { TipoRaza } from "./tipo-raza";

export interface Inseminacion {
    id: number;
    tipoInseminacion: TipoInseminacion;
    tipoRaza: TipoRaza;
    inseminador: Inseminador;
    descripcion: string;
    fecha: Date;
    activo?: boolean;
}
