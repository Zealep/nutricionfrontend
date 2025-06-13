import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgSelectOption, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { firstValueFrom } from 'rxjs';
import { TipoRaza } from 'src/app/model/tipo-raza';
import { Toro } from 'src/app/model/toro';
import { TipoRazaService } from 'src/app/service/tipo-raza.service';
import { ToroService } from 'src/app/service/toro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-toro',
  standalone: true,
  imports: [DataTableModule, CommonModule, FormsModule, NgxCustomModalComponent, ReactiveFormsModule,
    NgSelectComponent ],
  templateUrl: './toro.component.html',
  styleUrl: './toro.component.css'
})
export class ToroComponent {

    loading = false;
    private readonly toroService = inject(ToroService);
    private readonly tipoRazaService = inject(TipoRazaService);
    private readonly fb = inject(FormBuilder);
    toros: Toro[] = [];
    @ViewChild ('datatable') datatable: any;
    @ViewChild('addModal') addModal!: NgxCustomModalComponent;
    params!: FormGroup;
    tiposRaza: TipoRaza[] = [];
    search = '';
    tipo:any;

    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'codigo', title: 'Codigo' },
        { field: 'nombre', title: 'Nombre' },
        { field: 'tiporaza', title: 'Tipo Raza' },
        { field: 'acciones', title: 'Acciones' },
    ];

    initForm() {
        this.params = this.fb.group({
            id: [0],
            codigo: [''],
            nombre: [''],
            tiporaza: [null],
        });
    }

    ngOnInit(): void {
        this.getAllTipoRaza();
        this.getAll();
    }

    getAll() {
        this.toroService.getAll().subscribe((data) => {
            this.toros = data;
        });
    }

    getAllTipoRaza() {
        this.tipoRazaService.getAll().subscribe((data) => {
            this.tiposRaza = data;
        });
    }

    editar(row: Toro | null) {
        this.addModal.open();
        this.initForm();
        if (row) {
            this.params.setValue({
                id: row.id,
                codigo: row.codigo,
                nombre: row.nombre,
                tiporaza: row.tipoRaza.id,
            });
        }
    }

    guardar(){
         if (this.params.controls['codigo'].errors) {
            this.showMessage('Codigo es requerido.', 'error');
            return;
        }

        if (this.params.controls['nombre'].errors) {
            this.showMessage('Nombre es requerido.', 'error');
            return;
        }

        if (this.params.controls['tiporaza'].errors) {
            this.showMessage('Tipo Raza es requerido.', 'error');
            return;
        }

        const req: Toro = {
            id: this.params.value.id != 0 ? this.params.value.id : null,
            codigo: this.params.value.codigo,
            nombre: this.params.value.codigo,
            tipoRaza: {
                id: this.params.value.tiporaza,
            },
        };

        this.toroService.save(req).subscribe(data => {
        this.getAll();
        this.showMessage('Registro guardado', 'success');
        this.addModal.close();
        });

    }

    eliminar(row: Toro) {
        Swal.fire({
            title: 'Desea eliminar el registro?',
            showCancelButton: true,
            confirmButtonText: 'SI',
            icon: "warning",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await firstValueFrom(this.toroService.delete(row.id!));
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
