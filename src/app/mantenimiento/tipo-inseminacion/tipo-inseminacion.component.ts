import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { firstValueFrom } from 'rxjs';
import { TipoInseminacion } from 'src/app/model/tipo-inseminacion';
import { TipoInseminacionService } from 'src/app/service/tipo-inseminacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-inseminacion',
  standalone: true,
  imports: [DataTableModule, CommonModule, FormsModule, NgxCustomModalComponent, ReactiveFormsModule],
  templateUrl: './tipo-inseminacion.component.html',
  styleUrl: './tipo-inseminacion.component.css'
})
export class TipoInseminacionComponent {
loading = false;
    private readonly tipoInseminacionService = inject(TipoInseminacionService);
    private readonly fb = inject(FormBuilder);
    tiposInseminacion: TipoInseminacion[] = [];
    @ViewChild ('datatable') datatable: any;
    @ViewChild('addModal') addModal!: NgxCustomModalComponent;
    params!: FormGroup;
    search = '';

    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'codigo', title: 'Codigo' },
        { field: 'descripcion', title: 'Descripcion' },
        { field: 'acciones', title: 'Acciones' },
    ];

    initForm() {
        this.params = this.fb.group({
            id: [0],
            codigo: [''],
            descripcion: [''],
        });
    }

    ngOnInit(): void {
        this.getAll();
    }

    getAll() {
        this.tipoInseminacionService.getAll().subscribe((data) => {
            this.tiposInseminacion = data;
        });
    }

    editar(row: TipoInseminacion | null) {
        this.addModal.open();
        this.initForm();
        if (row) {
            this.params.setValue({
                id: row.id,
                codigo: row.codigo,
                descripcion: row.descripcion,
            });
        }
    }

    guardar(){
         if (this.params.controls['codigo'].errors) {
            this.showMessage('Codigo es requerido.', 'error');
            return;
        }

        if (this.params.controls['descripcion'].errors) {
            this.showMessage('Descripcion es requerido.', 'error');
            return;
        }

        const req: TipoInseminacion = {
            id: this.params.value.id != 0 ? this.params.value.id : null,
            codigo: this.params.value.codigo,
            descripcion: this.params.value.descripcion,
        };

        this.tipoInseminacionService.save(req).subscribe(data => {
        this.getAll();
        this.showMessage('Registro guardado', 'success');
        this.addModal.close();
        });

    }

    eliminar(row: TipoInseminacion) {
        Swal.fire({
            title: 'Desea eliminar el registro?',
            showCancelButton: true,
            confirmButtonText: 'SI',
            icon: "warning",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await firstValueFrom(this.tipoInseminacionService.delete(row.id!));
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
