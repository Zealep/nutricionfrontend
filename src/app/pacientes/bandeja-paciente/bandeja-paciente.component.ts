import { CommonModule } from '@angular/common';
import { Paciente } from './../../model/paciente';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { sign } from 'crypto';
import { PacienteService } from 'src/app/service/paciente.service';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { FlatpickrDefaultsInterface, FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { ToastService } from 'src/app/service/toast.service';
import { log } from 'console';

@Component({
    selector: 'app-bandeja-paciente',
    standalone: true,
    providers: [provideFlatpickrDefaults()],
    imports: [DataTableModule, CommonModule, FormsModule, NgxCustomModalComponent, ReactiveFormsModule, FlatpickrDirective],
    templateUrl: './bandeja-paciente.component.html',
})
export class BandejaPacienteComponent {
    private readonly pacientesService = inject(PacienteService);
    private readonly fb = inject(FormBuilder);
    private toastService = inject(ToastService);
    pacientes = signal<Paciente[]>([]);
    @ViewChild('datatable') datatable: any;
    @ViewChild('addModal') addModal!: NgxCustomModalComponent;
    params!: FormGroup;
    search = '';
    basic: FlatpickrDefaultsInterface;

    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'apellidos', title: 'Apellidos' },
        { field: 'nombres', title: 'Nombres' },
        { field: 'fechaNacimiento', title: 'Fecha Nacimiento' },
        { field: 'celular', title: 'Celular' },
        { field: 'correo', title: 'Correo' },
        { field: 'acciones', title: 'Acciones' },
    ];

    constructor() {
        this.basic = {
            dateFormat: 'd/m/Y',
            allowInput: true,
            // position: this.store.rtlClass === 'rtl' ? 'auto right' : 'auto left',
            monthSelectorType: 'dropdown',
            locale: Spanish,
        };
    }

    ngOnInit(): void {
        this.getAll();
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
    }

    nuevo() {
        this.addModal.open();
        this.initForm();
    }

    getAll() {
        this.pacientesService.getAll().subscribe((data) => {
            this.pacientes.set(data);
        });
    }

    guardar() {
        const req: Paciente = {

            apellidos: this.params.value.apellidos,
            nombres: this.params.value.nombres,
            sexo: this.params.value.sexo,
            fechaNacimiento: this.params.value.fechaNacimiento,
            celular: this.params.value.celular,
            correo: this.params.value.correo,
        };
        this.pacientesService.save(req).subscribe((data) => {
            this.getAll();
            this.toastService.showMessage('Registro guardado', 'success');
            this.addModal.close();
        }
        );

    }


}
