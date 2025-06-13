import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { firstValueFrom } from 'rxjs';
import { Inseminador } from 'src/app/model/inseminador';
import { InseminadorService } from 'src/app/service/inseminador.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inseminador',
  standalone: true,
  imports: [DataTableModule, CommonModule, FormsModule, NgxCustomModalComponent, ReactiveFormsModule],
  templateUrl: './inseminador.component.html',
  styleUrl: './inseminador.component.css'
})
export class InseminadorComponent {
loading = false;
    private readonly inseminadorService = inject(InseminadorService);
    private readonly fb = inject(FormBuilder);
    inseminadores: Inseminador[] = [];
    @ViewChild ('datatable') datatable: any;
    @ViewChild('addModal') addModal!: NgxCustomModalComponent;
    params!: FormGroup;
    search = '';

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
        this.inseminadorService.getAll().subscribe((data) => {
            this.inseminadores = data;
        });
    }

    editar(row: Inseminador | null) {
        this.addModal.open();
        this.initForm();
        if (row) {
            this.params.setValue({
                id: row.id,
                nombre: row.nombre,
            });
        }
    }

    guardar(){
         if (this.params.controls['nombre'].errors) {
            this.showMessage('Nombre es requerido.', 'error');
            return;
        }


        const req: Inseminador = {
            id: this.params.value.id != 0 ? this.params.value.id : null,
            nombre: this.params.value.nombre,
        };

        this.inseminadorService.save(req).subscribe(data => {
        this.getAll();
        this.showMessage('Registro guardado', 'success');
        this.addModal.close();
        });

    }

    eliminar(row: Inseminador) {
        Swal.fire({
            title: 'Desea eliminar el registro?',
            showCancelButton: true,
            confirmButtonText: 'SI',
            icon: "warning",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await firstValueFrom(this.inseminadorService.delete(row.id!));
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
