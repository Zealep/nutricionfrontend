import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatpickrDefaultsInterface, FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';
import { sign } from 'crypto';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { firstValueFrom } from 'rxjs';
import { Paciente } from 'src/app/model/paciente';
import { PacienteService } from 'src/app/service/paciente.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
    selector: 'app-datos-personales',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FlatpickrDirective],
     providers: [provideFlatpickrDefaults()],
    templateUrl: './datos-personales.component.html',
})
export class DatosPersonalesComponent {
    private readonly pacientesService = inject(PacienteService);
    private readonly fb = inject(FormBuilder);
    private toastService = inject(ToastService);
    private router = inject(Router);
    private route = inject(ActivatedRoute)
    paciente = signal<Paciente>({
        apellidos: '',
        nombres: '',
        fechaNacimiento: '',
        sexo: '',
        celular: '',
        correo: '',
    });
    params!: FormGroup;
    basic: FlatpickrDefaultsInterface;

    constructor() {
        this.basic = {
            dateFormat: 'd/m/Y',
            allowInput: true,
            // position: this.store.rtlClass === 'rtl' ? 'auto right' : 'auto left',
            monthSelectorType: 'dropdown',
            locale: Spanish,
        };
    }

     ngOnInit() {
        this.initForm();
    }

    initForm() {
       this.params = this.fb.group({
           apellidos: [''],
           nombres: [''],
           sexo: [''],
           fechaNacimiento: [''],
           celular: [''],
           correo: [''],
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
            fechaNacimiento: this.params.value.fechaNacimiento ? this.params.value.fechaNacimiento.toISOString() : '',
        };

    }
}
