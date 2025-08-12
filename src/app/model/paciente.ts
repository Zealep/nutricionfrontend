import { Alergia } from "./alergias";
import { Medicamento } from "./medicamento";
import { Patologia } from "./patologia";

export interface Paciente {
    id?: number;
    apellidos: string;
    nombres: string;
    fechaNacimiento: '';
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
    nivelEstres?: string;
    motivoEstres?: string;
    nivelCalidadSueño?: string;
    consumoAlcohol?: string;
    consumoTabaco?: string;
    consumoCafe?: string;
    consumoSuplementos?: string;
    patologias?: Patologia[];
    antecedentesPatologicos?: Patologia[];
    antecedentesPatologicosFamiliares?: Patologia[];
    alergias?: Alergia[];
    medicamentos?: Medicamento[];
    observaciones?: string;

}
