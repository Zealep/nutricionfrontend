import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgLabelTemplateDirective, NgOptionComponent, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FlatpickrDirective } from 'angularx-flatpickr';
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
}
