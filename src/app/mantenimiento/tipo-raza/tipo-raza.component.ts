import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { firstValueFrom } from 'rxjs';
import { TipoRaza } from 'src/app/model/tipo-raza';
import { TipoRazaService } from 'src/app/service/tipo-raza.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-raza',
  standalone: true,
  imports: [DataTableModule, CommonModule, FormsModule, NgxCustomModalComponent, ReactiveFormsModule],
  templateUrl: './tipo-raza.component.html',
  styleUrl: './tipo-raza.component.css'
})
export class TipoRazaComponent {
    loading = false;
    private readonly tipoRazaService = inject(TipoRazaService);
    private readonly fb = inject(FormBuilder);
    tipoRazas: TipoRaza[] = [];
    @ViewChild ('datatable') datatable: any;
    @ViewChild('addModal') addModal!: NgxCustomModalComponent;
    params!: FormGroup;
    search = '';

    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'descripcion', title: 'Descripcion' },
        { field: 'acciones', title: 'Acciones' },
    ];

    initForm() {
        this.params = this.fb.group({
            id: [0],
            descripcion: [''],
        });
    }

    ngOnInit(): void {
        this.getAll();
    }

    getAll() {
        this.tipoRazaService.getAll().subscribe((data) => {
            this.tipoRazas = data;
        });
    }

    editar(row: TipoRaza | null) {
        this.addModal.open();
        this.initForm();
        if (row) {
            this.params.setValue({
                id: row.id,
                descripcion: row.descripcion,
            });
        }
    }

    guardar(){


        if (this.params.controls['descripcion'].errors) {
            this.showMessage('Descripcion es requerido.', 'error');
            return;
        }

        const req: TipoRaza = {
            id: this.params.value.id != 0 ? this.params.value.id : null,
            descripcion: this.params.value.descripcion,
        };

        this.tipoRazaService.save(req).subscribe(data => {
        this.getAll();
        this.showMessage('Registro guardado', 'success');
        this.addModal.close();
        });

    }

    eliminar(row: TipoRaza) {
        Swal.fire({
            title: 'Desea eliminar el registro?',
            showCancelButton: true,
            confirmButtonText: 'SI',
            icon: "warning",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await firstValueFrom(this.tipoRazaService.delete(row.id!));
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

