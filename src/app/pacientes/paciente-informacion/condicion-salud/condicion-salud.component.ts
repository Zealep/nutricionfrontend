import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgLabelTemplateDirective, NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { firstValueFrom } from 'rxjs';
import { Alergia } from 'src/app/model/alergias';
import { Medicamento } from 'src/app/model/medicamento';
import { Paciente } from 'src/app/model/paciente';
import { Patologia } from 'src/app/model/patologia';
import { AlergiaService } from 'src/app/service/alergia.service';
import { MedicamentoService } from 'src/app/service/medicamento.service';
import { PacienteService } from 'src/app/service/paciente.service';
import { PatologiaService } from 'src/app/service/patologia.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
    selector: 'app-condicion-salud',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgLabelTemplateDirective, NgOptionComponent, NgSelectComponent],
    templateUrl: './condicion-salud.component.html',
})
export class CondicionSaludComponent {
    private readonly pacientesService = inject(PacienteService);
    private readonly patologiaService = inject(PatologiaService);
    private readonly alergiaService = inject(AlergiaService);
    private readonly medicamentoService = inject(MedicamentoService); // Asumiendo que el servicio de medicamentos es el mismo que el de pacientes

    private readonly fb = inject(FormBuilder);
    private readonly toastService = inject(ToastService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    params!: FormGroup;
    patologias =  signal<Patologia[]>([])
    alergias = signal<Alergia[]>([]);
    medicamentos = signal<Medicamento[]>([]);

    paciente = signal<Paciente>({
        apellidos: '',
        nombres: '',
        fechaNacimiento: '',
        sexo: '',
        celular: '',
        correo: '',
    });


    ngOnInit() {
        this.initForm();
        this.obtenerPatologias();
        this.obtenerAlergias();
        this.obtenerMedicamentos();
    }

    initForm() {
        this.params = this.fb.group({
            patologias: [''],
            antecedentesPatologicos: [''],
            antecedentesPatologicosFamiliares: [''],
            alergias: [''],
            medicamentos: [''],
            observaciones: [''],
        });

        this.asignarPaciente();
    }

    async asignarPaciente() {
        const paciente = await firstValueFrom(this.pacientesService.getById(this.route.snapshot.params['id']));
        this.paciente.set(paciente);
        this.params.patchValue(paciente);
    }

    obtenerPatologias() {
        this.patologiaService.getAll().subscribe((patologias) => {
            this.patologias.set(patologias);
        });
    }

    obtenerAlergias() {
        this.alergiaService.getAll().subscribe((alergias) => {
            this.alergias.set(alergias);
        });
    }

    obtenerMedicamentos() {
        this.medicamentoService.getAll().subscribe((medicamentos) => {
            this.medicamentos.set(medicamentos);
        });
    }
//patologia opcional

    actualizarDatos(patologia?: Patologia) {
        console.log('actualizar',patologia)
        const paciente: Paciente = {
            ...this.paciente(),
            ...this.params.value,
        };

        this.pacientesService.save(paciente).subscribe((x) => {
            this.toastService.showMessage('Datos actualizados correctamente');
        });
    }

   async onAddPatologia(patologia: Patologia) {
    // Guarda la nueva patología en el backend y espera la respuesta con el id
    const nuevaPatologia = await firstValueFrom(this.patologiaService.save({ descripcion: patologia.descripcion })) as Patologia;
    this.patologias.set([...this.patologias(), nuevaPatologia]);
    const seleccionados = this.params.value.patologias || [];
    const seleccionadosFiltrados = [...seleccionados, nuevaPatologia].filter(p => p.id);
    this.params.patchValue({ patologias: seleccionadosFiltrados });
    this.actualizarDatos();
    }

    async onAddPatologiaAntecedente(patologia: Patologia) {
        const nuevaPatologia = await firstValueFrom(this.patologiaService.save({ descripcion: patologia.descripcion })) as Patologia;
        const seleccionados = this.params.value.antecedentesPatologicos || [];
        const seleccionadosFiltrados = [...seleccionados, nuevaPatologia].filter(p => p.id);
        this.params.patchValue({ antecedentesPatologicos: seleccionadosFiltrados });
        this.actualizarDatos();
    }

    async onAddPatologiaAntecedenteFamiliar(patologia: Patologia) {
        const nuevaPatologia = await firstValueFrom(this.patologiaService.save({ descripcion: patologia.descripcion })) as Patologia;
        const seleccionados = this.params.value.antecedentesPatologicosFamiliares || [];
        const seleccionadosFiltrados = [...seleccionados, nuevaPatologia].filter(p => p.id);
        this.params.patchValue({ antecedentesPatologicosFamiliares: seleccionadosFiltrados });
        this.actualizarDatos();
    }

    async onAddAlergia(alergia: Alergia) {
        const nuevaAlergia = await firstValueFrom(this.alergiaService.save({ descripcion: alergia.descripcion })) as Alergia;
        const seleccionados = this.params.value.alergias || [];
        const seleccionadosFiltrados = [...seleccionados, nuevaAlergia].filter(a => a.id);
        this.params.patchValue({ alergias: seleccionadosFiltrados });
        this.actualizarDatos();
    }

    async onAddMedicamento(medicamento: Medicamento) {
        const nuevoMedicamento = await firstValueFrom(this.medicamentoService.save({ descripcion: medicamento.descripcion })) as Medicamento;
        const seleccionados = this.params.value.medicamentos || [];
        const seleccionadosFiltrados = [...seleccionados, nuevoMedicamento].filter(m => m.id);
        this.params.patchValue({ medicamentos: seleccionadosFiltrados });
        this.actualizarDatos();
    }

    onRemovePatologia(item: any) {
        const seleccionados = (this.params.value.patologias as Patologia[]) || [];
        const actualizados = seleccionados.filter((p) => p.id !== item.id);
        this.params.patchValue({ patologias: actualizados });
        this.actualizarDatos();
    }
    onRemoveAntecedentePatologia(item: any) {
        const seleccionados = (this.params.value.antecedentesPatologicos as Patologia[]) || [];
        const actualizados = seleccionados.filter((p) => p.id !== item.id);
        this.params.patchValue({ antecedentesPatologicos: actualizados });
        this.actualizarDatos();
    }

    onRemoveAntecedenteFamiliar(item: any) {
        const seleccionados = (this.params.value.antecedentesPatologicosFamiliares as Patologia[]) || [];
        const actualizados = seleccionados.filter((p) => p.id !== item.id);
        this.params.patchValue({ antecedentesPatologicosFamiliares: actualizados });
        this.actualizarDatos();
    }

    onRemoveAlergia(item: any) {
        const seleccionados = (this.params.value.alergias as Alergia[]) || [];
        const actualizados = seleccionados.filter((a) => a.id !== item.id);
        this.params.patchValue({ alergias: actualizados });
        this.actualizarDatos();
    }

    onRemoveMedicamento(item: any) {
        const seleccionados = (this.params.value.medicamentos as Medicamento[]) || [];
        const actualizados = seleccionados.filter((m) => m.id !== item.id);
        this.params.patchValue({ medicamentos: actualizados });
        this.actualizarDatos();
    }
}
