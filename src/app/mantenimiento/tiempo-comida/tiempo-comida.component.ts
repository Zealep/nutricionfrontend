import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { firstValueFrom } from 'rxjs';
import { TiempoComida } from 'src/app/model/tiempo-comida';
import { TiempoComidaService } from 'src/app/service/tiempo-comida.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-tiempo-comida',
    standalone: true,
    imports: [DataTableModule, CommonModule, FormsModule, NgxCustomModalComponent, ReactiveFormsModule],
    templateUrl: './tiempo-comida.component.html',
})
export class TiempoComidaComponent {
    loading = false;
    private readonly tiempoComidaService = inject(TiempoComidaService);
    private readonly fb = inject(FormBuilder);
    tiemposComida = signal<TiempoComida[]>([]);
    @ViewChild('datatable') datatable: any;
    @ViewChild('addModal') addModal!: NgxCustomModalComponent;
    params!: FormGroup;
    search = '';
    tipo: any;

    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'nombre', title: 'Nombre' },
        { field: 'acciones', title: 'Acciones' },
    ];

    initForm() {
        this.params = this.fb.group({
            id: [0],
            nombre: [''],
        });
    }

    ngOnInit(): void {
        this.getAll();
    }

    getAll() {
        this.tiempoComidaService.getAll().subscribe((data) => {
            this.tiemposComida.set(data);
        });
    }

    editar(row: TiempoComida | null) {
        this.addModal.open();
        this.initForm();
        if (row) {
            this.params.setValue({
                id: row.id,
                nombre: row.nombre,
            });
        }
    }

    guardar() {
        if (this.params.controls['nombre'].errors) {
            this.showMessage('El nombre es requerido.', 'error');
            return;
        }

        const req: TiempoComida = {
            id: this.params.value.id != 0 ? this.params.value.id : null,
            nombre: this.params.value.nombre,
        };

        this.tiempoComidaService.save(req).subscribe((data) => {
            this.getAll();
            this.showMessage('Registro guardado', 'success');
            this.addModal.close();
        });
    }

    eliminar(row: TiempoComida) {
        Swal.fire({
            title: 'Desea eliminar el registro?',
            showCancelButton: true,
            confirmButtonText: 'SI',
            icon: 'warning',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await firstValueFrom(this.tiempoComidaService.delete(row.id!));
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
