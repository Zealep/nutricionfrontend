import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { firstValueFrom } from 'rxjs';
import { Objetivo } from 'src/app/model/objetivo';
import { ObjetivoService } from 'src/app/service/objetivo.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-objetivos',
    standalone: true,
    imports: [DataTableModule, CommonModule, FormsModule, NgxCustomModalComponent, ReactiveFormsModule],
    templateUrl: './objetivos.component.html',
})
export class ObjetivosComponent {
    loading = false;
    private readonly objetivoService = inject(ObjetivoService);
    private readonly fb = inject(FormBuilder);
    objetivos = signal<Objetivo[]>([]);
    @ViewChild('datatable') datatable: any;
    @ViewChild('addModal') addModal!: NgxCustomModalComponent;
    params!: FormGroup;
    search = '';
    tipo: any;

    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'nombre', title: 'Nombre' },
        { field: 'descripcion', title: 'Descripcion' },
        { field: 'calorias', title: 'Calorias' },
        { field: 'porcentajeProteinas', title: 'Porcentaje de Proteinas' },
        { field: 'porcentajeCarbohidratos', title: 'Porcentaje de Carbohidratos' },
        { field: 'porcentajeGrasas', title: 'Porcentaje de Grasas' },
        { field: 'acciones', title: 'Acciones' },
    ];

    initForm() {
        this.params = this.fb.group({
            id: [0],
            nombre: [''],
            descripcion: [''],
            calorias: [0],
            porcentajeProteinas: [0],
            porcentajeCarbohidratos: [0],
            porcentajeGrasas: [0],
        });
    }

    ngOnInit(): void {
        this.getAll();
    }

    getAll() {
        this.objetivoService.getAll().subscribe((data) => {
            this.objetivos.set(data);
        });
    }

    editar(row: Objetivo | null) {
        this.addModal.open();
        this.initForm();
        if (row) {
            this.params.setValue({
                id: row.id,
                nombre: row.nombre,
                descripcion: row.descripcion,
                calorias: row.calorias,
                porcentajeProteinas: row.porcentajeProteinas,
                porcentajeCarbohidratos: row.porcentajeCarbohidratos,
                porcentajeGrasas: row.porcentajeGrasas,
            });
        }
    }

    guardar() {
        if (this.params.controls['descripcion'].errors) {
            this.showMessage('La descripcion es requerida.', 'error');
            return;
        }

        const req: Objetivo = {
            id: this.params.value.id != 0 ? this.params.value.id : null,
            nombre: this.params.value.nombre,
            descripcion: this.params.value.descripcion,
            calorias: this.params.value.calorias,
            porcentajeProteinas: this.params.value.porcentajeProteinas,
            porcentajeCarbohidratos: this.params.value.porcentajeCarbohidratos,
            porcentajeGrasas: this.params.value.porcentajeGrasas,
        };

        this.objetivoService.save(req).subscribe((data) => {
            this.getAll();
            this.showMessage('Registro guardado', 'success');
            this.addModal.close();
        });
    }

    eliminar(row: Objetivo) {
        Swal.fire({
            title: 'Desea eliminar el registro?',
            showCancelButton: true,
            confirmButtonText: 'SI',
            icon: 'warning',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await firstValueFrom(this.objetivoService.delete(row.id!));
                this.getAll();
                this.showMessage('Registro Eliminado', 'success');
            }
        });
    }

    showMessage(msg = '', type = 'success') {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    }
}
