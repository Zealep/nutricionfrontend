export interface Paciente {
    id?: number;
    apellidos: string;
    nombres: string;
    fechaNacimiento: string;
    sexo: string;
    celular: string;
    direccion?: string;
    correo: string;
    estadoCivil?: string;
    numeroDocumento?: string;
    ocupacion?: string;
    actividadFisica?: string;
    peso?: number;
    talla?: number;

}
