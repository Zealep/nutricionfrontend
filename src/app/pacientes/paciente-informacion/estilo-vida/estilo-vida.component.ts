import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgLabelTemplateDirective, NgOptionComponent, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FlatpickrDirective } from 'angularx-flatpickr';
import { firstValueFrom } from 'rxjs';
import { Paciente } from 'src/app/model/paciente';
import { PacienteService } from 'src/app/service/paciente.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
    selector: 'app-estilo-vida',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgLabelTemplateDirective, NgOptionComponent, NgSelectComponent],

    templateUrl: './estilo-vida.component.html',
})
export class EstiloVidaComponent {
    private readonly pacientesService = inject(PacienteService);
    private readonly fb = inject(FormBuilder);
    private readonly toastService = inject(ToastService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    params!: FormGroup;

    paciente = signal<Paciente>({
            apellidos: '',
            nombres: '',
            fechaNacimiento: '',
            sexo: '',
            celular: '',
            correo: '',
        });

    actividades = [
        { label: 'Sedentario', value: '1' },
        { label: 'Ligeramente Activo', value: '2' },
        { label: 'Moderamente Activo', value: '3' },
        { label: 'Muy Activo', value: '4' },
        { label: 'Extremadamente Activo', value: '5' },
    ];

    nivelesEstres = [
        { label: 'No tiene', value: '1' },
        { label: 'Bajo', value: '2' },
        { label: 'Moderado', value: '3' },
        { label: 'Alto', value: '4' },
    ];

    nivelesDormir = [
        { label: 'Muy Malo', value: '1' },
        { label: 'Malo', value: '2' },
        { label: 'Regular', value: '3' },
        { label: 'Bueno', value: '4' },
        { label: 'Muy Bueno', value: '5' },
    ];

    consumosAlcohol = [
        { label: 'Nunca', value: '1' },
        { label: 'Ocasionalmente', value: '2' },
        { label: 'Semanalmente', value: '3' },
        { label: 'Diariamente', value: '4' },
    ]

    consumosTabaco = [
        { label: 'Nunca', value: '1' },
        { label: 'Ocasionalmente', value: '2' },
        { label: 'Semanalmente', value: '3' },
        { label: 'Diariamente', value: '4' },
    ]

    consumosCafe = [
        { label: 'Nunca', value: '1' },
        { label: 'Ocasionalmente', value: '2' },
        { label: 'Semanalmente', value: '3' },
        { label: 'Diariamente', value: '4' },
    ]

     ngOnInit() {
        this.initForm();
    }

    initForm() {
       this.params = this.fb.group({
              actividadFisica: [''],
                nivelEstres: [''],
                motivoEstres: [''],
                nivelCalidadSueño: [''],
                consumoAlcohol: [''],
                consumoTabaco: [''],
                consumoCafe: [''],
                consumoSuplementos: [''],
       });

       this.asignarPaciente()
    }

    async asignarPaciente(){
        const paciente = await firstValueFrom(this.pacientesService.getById(this.route.snapshot.params['id']));
        this.paciente.set(paciente);
        this.params.patchValue(paciente);

    }


     actualizarDatos() {
        const paciente: Paciente = {
            ...this.paciente(),
            ...this.params.value,
        };

        this.pacientesService.save(paciente).subscribe((x) => {
            this.toastService.showMessage('Datos actualizados correctamente');
        });
    }

}
